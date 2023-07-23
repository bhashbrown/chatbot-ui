import { OpenAIModel } from './openai';

export interface Message {
  role: Role;
  content: string;
}

export type Role = 'assistant' | 'user';

export interface ChatBody {
  model: OpenAIModel;
  messages: Message[];
  key: string;
  prompt: string;
  temperature: number;
}

export interface Conversation {
  id: string;
  archived?: boolean;
  name: string;
  messages: Message[];
  model: OpenAIModel;
  prompt: string;
  temperature: number;
  folderId: string | null;
}

export interface ConversationDatabase {
  id: string;
  archived?: boolean;
  name: string;
  modelId: string;
  prompt: string;
  temperature: number;
  folderId: string | null;
  updatedAt: string;
}

export interface GetConversationBody {
  id: string;
}
