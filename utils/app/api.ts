import {
  Conversation,
  CreateMessageBody,
  GetConversationBody,
  Message,
} from '@/types/chat';
import { Plugin, PluginID } from '@/types/plugin';
import { GetPromptBody, Prompt } from '@/types/prompt';

export const getEndpoint = (plugin: Plugin | null) => {
  if (!plugin) {
    return 'api/chat';
  }

  if (plugin.id === PluginID.GOOGLE_SEARCH) {
    return 'api/google';
  }

  return 'api/chat';
};

export const API_LINKS = {
  conversationGetAll: 'api/conversations/get-all-conversations',
  conversationUpdate: 'api/conversations/update-conversation',
  messageCreate: 'api/messages/create-message',
  messageGetAll: 'api/messages/get-all-messages',
  promptGetAll: 'api/prompts/get-all-prompts',
  promptUpdate: 'api/prompts/update-prompt',
};
type APILinks = typeof API_LINKS;
type APILink = APILinks[keyof APILinks];
type PostRequestInput = {
  endPoint: APILink;
  data:
    | Conversation
    | Prompt
    | GetConversationBody
    | GetPromptBody
    | Message
    | CreateMessageBody;
};

export const sendPostRequest = async ({ endPoint, data }: PostRequestInput) => {
  try {
    const response = await fetch(endPoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    }).then((response) => response.json());

    return response;
  } catch (error) {
    return console.error(error);
  }
};
