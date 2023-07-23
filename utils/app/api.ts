import { Conversation, GetConversationBody } from '@/types/chat';
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
  promptGet: '/api/prompts/get-prompt',
  promptGetAll: '/api/prompts/get-all-prompts',
  promptSave: '/api/prompts/save-prompt',
  conversationCreate: '/api/conversations/create-conversation',
  conversationGet: '/api/conversations/get-conversation',
  conversationGetAll: '/api/conversations/get-all-conversations',
  conversationUpdate: '/api/conversations/update-conversation',
};
type APILinks = typeof API_LINKS;
type APILink = APILinks[keyof APILinks];
type PostRequestInput = {
  endPoint: APILink;
  data: Conversation | Prompt | GetConversationBody | GetPromptBody;
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

    console.log(`RESPONSE - ${endPoint}`, response);

    return response;
  } catch (error) {
    return console.error(error);
  }
};
