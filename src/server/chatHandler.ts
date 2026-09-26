import { GoogleGenAI } from '@google/genai';
import { DomainType, ToneType, UserMemory, SentimentType, MessageCard } from '../types';
import { DOMAINS, TONES } from '../data/mockData';

export interface ChatServerRequest {
  messages: { role: 'user' | 'assistant' | 'system'; content: string }[];
  domain: DomainType;
  tone: ToneType;
  memory: UserMemory;
  externalApiContext?: string;
  customDomain?: {
    companyName: string;
    businessType: string;
    knowledgeText: string;
  };
}

export async function handleChatApi(reqBody: ChatServerRequest): Promise<{
  reply: string;
  updatedMemory?: Partial<UserMemory>;
  sentiment?: SentimentType;
  card?: MessageCard;
}> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not set in environment');
  }

  const ai = new GoogleGenAI({ apiKey });

  const domain = reqBody.domain || 'HEALTH';
  const tone = reqBody.tone || 'CASUAL';
  const memory = reqBody.memory || { userName: '', preferences: [], notes: [] };
  const domainMeta = DOMAINS[domain];

  // Craft System Instruction
  let knowledgePrompt = domainMeta ? domainMeta.knowledgeOverview : '';
  if (domain === 'CUSTOM' && reqBody.customDomain) {
    knowledgePrompt = `Nama Bisnis: ${reqBody.customDomain.companyName}\nBidang: ${reqBody.customDomain.businessType}\nBasis Pengetahuan:\n${reqBody.customDomain.knowledgeText}`;
  }

  let toneGuidance = '';
  switch (tone) {
    case 'FORMAL':
      toneGuidance = 'Gunakan Bahasa Indonesia baku, santun, terstruktur rapi. Sapa dengan "Bapak/Ibu [Nama]". Hindari singkatan gaul atau slang.';
      break;
    case 'CASUAL':
      toneGuidance = 'Gunakan Bahasa Indonesia santai, hangat, dan ramah seperti kawan akrab ("Halo kak [Nama]! 😊"). Boleh gunakan emoji yang bersahabat dan kata percakapan hangat.';
      break;
    case 'CONCISE':
      toneGuidance = 'Jawaban to the point, padat, berupa poin-poin jelas dan efisien tanpa pengantar basa-basi berlebih.';
      break;
    case 'EMPATHETIC':
      toneGuidance = 'Tunjukkan empati mendalam, validasi keluhan atau kekhawatiran pelanggan terlebih dahulu dengan tulus, berikan ketenangan dan solusi yang jelas.';
      break;
  }

  const memoryContext = `
PROFIL MEMORI PELANGGAN SAAT INI:
- Nama Pelanggan: ${memory.userName || '(Belum diketahui)'}
- Preferensi Tercatat: ${memory.preferences.length > 0 ? memory.preferences.join(', ') : 'Belum ada'}
- Catatan Interaksi Sebelumnya: ${memory.notes.length > 0 ? memory.notes.join(', ') : 'Belum ada'}
- Topik Terakhir: ${memory.recentTopic || '-'}
Jika pengguna menyebutkan nama barunya atau preferensi baru (misal alergi, budget, minat produk, latar belakang), kamu harus menyapa dan mengingatnya.`;

  const externalToolsInfo = reqBody.externalApiContext
    ? `\nINFORMASI DATA DARI SISTEM / API EKSTERNAL:\n${reqBody.externalApiContext}\nGunakan data ini untuk menjawab pertanyaan pengguna dengan tepat.`
    : '';

  const systemInstruction = `Kamu adalah Customer Service AI yang sangat handal, ramah, dan profesional untuk domain: ${domainMeta ? domainMeta.name : 'Customer Support'}.
Nama Persona Kamu: ${domainMeta ? domainMeta.agentName : 'Customer Service Specialist'}.

PANDUAN GAYA BAHASA (TONE OF VOICE):
${toneGuidance}

BASIS PENGETAHUAN RESMI DOMAIN:
${knowledgePrompt}
${memoryContext}
${externalToolsInfo}

ATURAN PENTING:
1. Jawablah selalu dalam Bahasa Indonesia sesuai gaya bahasa yang diminta.
2. Jika ada informasi dari API eksternal (resi/tiket/cuaca/booking), rangkum dengan sangat jelas dan tawarkan bantuan lanjutan.
3. Jika pelanggan komplain keras atau frustrasi, tawarkan solusi dan sebutkan bahwa Anda dapat membantu eskalasi ke agen manusia jika diperlukan.
4. Jangan mengarang data jadwal atau nomor kontak penting di luar basis pengetahuan resmi yang telah disediakan.`;

  // Format message history
  const contents = reqBody.messages.map(m => ({
    role: m.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: m.content }]
  }));

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: contents as any,
    config: {
      systemInstruction,
      temperature: 0.7,
    }
  });

  const reply = response.text || 'Mohon maaf, saya belum dapat memproses jawaban saat ini. Ada hal lain yang bisa kami bantu?';

  // Sentiment detection
  const lastUserMsg = reqBody.messages[reqBody.messages.length - 1]?.content.toLowerCase() || '';
  let sentiment: SentimentType = 'NEUTRAL';
  if (/kecewa|rusak|lama|komplain|rugi|marah|payah|buruk|error|down/i.test(lastUserMsg)) {
    sentiment = 'FRUSTRATED';
  } else if (/terima kasih|makasih|mantap|keren|puas|bagus|hebat|suka/i.test(lastUserMsg)) {
    sentiment = 'POSITIVE';
  } else if (/bagaimana|apakah|bisa|apa|berapa|kapan|kenapa/i.test(lastUserMsg)) {
    sentiment = 'CURIOUS';
  }

  // Memory extraction
  const updatedMemory: Partial<UserMemory> = {};
  const nameMatch = lastUserMsg.match(/(?:nama saya|panggil saya|saya)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)/i);
  if (nameMatch && nameMatch[1]) {
    const cleanName = nameMatch[1].trim();
    if (!['mau', 'bisa', 'ingin', 'adalah', 'sedang'].includes(cleanName.toLowerCase())) {
      updatedMemory.userName = cleanName;
    }
  }

  return {
    reply,
    updatedMemory,
    sentiment
  };
}
