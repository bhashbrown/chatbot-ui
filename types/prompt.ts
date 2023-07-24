import { OpenAIModel } from './openai';

export interface Prompt {
  id: string;
  archived?: boolean;
  name: string;
  description: string;
  content: string;
  model: OpenAIModel;
  folderId: string | null;
}

export interface GetPromptBody {
  id: string;
}

export interface PromptDatabase {
  id: string;
  name: string;
  description: string;
  content: string;
  modelId: String;
  folderId: string | null;
}
