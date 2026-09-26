export type DomainType = 'HEALTH' | 'EDUCATION' | 'HOBBY' | 'SAAS' | 'CUSTOM';

export type ToneType = 'FORMAL' | 'CASUAL' | 'CONCISE' | 'EMPATHETIC';

export type SentimentType = 'POSITIVE' | 'NEUTRAL' | 'FRUSTRATED' | 'CURIOUS';

export interface UserMemory {
  userName: string;
  userEmail?: string;
  userPhone?: string;
  preferences: string[];
  recentTopic?: string;
  notes: string[];
  lastInteraction?: string;
}

export interface RecommendationItem {
  id: string;
  title: string;
  category: string;
  description: string;
  price?: string;
  badge?: string;
  imageUrl?: string;
  actionText?: string;
  promptToAsk: string;
}

export interface TrackingResult {
  code: string;
  type: 'ORDER' | 'TICKET' | 'BOOKING' | 'INVOICE';
  status: string;
  title: string;
  courierOrAgent?: string;
  estimatedDeliveryOrResponse?: string;
  timeline: {
    time: string;
    description: string;
    location?: string;
    completed: boolean;
  }[];
}

export interface WeatherResult {
  location: string;
  temperature: string;
  condition: string;
  humidity: string;
  windSpeed: string;
  hikingAdvice: string;
}

export interface BookingResult {
  bookingId: string;
  patientOrStudentName: string;
  serviceName: string;
  date: string;
  timeSlot: string;
  doctorOrMentor: string;
  status: 'CONFIRMED' | 'PENDING';
  locationOrLink: string;
}

export interface MessageCard {
  type: 'TRACKING' | 'RECOMMENDATION' | 'BOOKING' | 'ESCALATION';
  trackingData?: TrackingResult;
  recommendationData?: RecommendationItem[];
  bookingData?: BookingResult;
  escalationTicketId?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'bot' | 'system';
  text: string;
  timestamp: string;
  toneUsed?: ToneType;
  sentimentDetected?: SentimentType;
  card?: MessageCard;
  isStreaming?: boolean;
}

export interface CustomDomainConfig {
  companyName: string;
  businessType: string;
  knowledgeText: string;
  faqs: { question: string; answer: string }[];
}

export interface ChatRequestPayload {
  messages: { role: 'user' | 'assistant' | 'system'; content: string }[];
  domain: DomainType;
  tone: ToneType;
  memory: UserMemory;
  customDomain?: CustomDomainConfig;
}

export interface ChatResponsePayload {
  reply: string;
  updatedMemory?: Partial<UserMemory>;
  sentiment?: SentimentType;
  card?: MessageCard;
  recommendations?: RecommendationItem[];
}
