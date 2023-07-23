import { Conversation, Message } from '@/types/chat';

import { API_LINKS, sendPostRequest } from './api';

export const updateConversation = (
  updatedConversation: Conversation,
  allConversations: Conversation[],
) => {
  const updatedConversations = allConversations.map((c) => {
    if (c.id === updatedConversation.id) {
      return updatedConversation;
    }

    return c;
  });

  saveConversation(updatedConversation);
  saveConversations(updatedConversations);

  return {
    single: updatedConversation,
    all: updatedConversations,
  };
};

export const saveConversation = (conversation: Conversation) => {
  localStorage.setItem('selectedConversation', JSON.stringify(conversation));
};

export const saveConversations = (conversations: Conversation[]) => {
  localStorage.setItem('conversationHistory', JSON.stringify(conversations));
};

export const createConversation = async (conversation: Conversation) => {
  return sendPostRequest({
    endPoint: API_LINKS.conversationCreate,
    data: conversation,
  });
};

export const updateConversationDB = async (conversation: Conversation) => {
  return sendPostRequest({
    endPoint: API_LINKS.conversationUpdate,
    data: conversation,
  });
};

export const getConversation = async (conversationId: string) => {
  return sendPostRequest({
    endPoint: API_LINKS.conversationGet,
    data: { id: conversationId },
  });
};

export const getAllConversations = async (userId: string) => {
  return sendPostRequest({
    endPoint: API_LINKS.conversationGetAll,
    data: { id: userId },
  });
};

export const createMessage = async (
  conversation: Conversation,
  message: Message,
) => {
  return sendPostRequest({
    endPoint: API_LINKS.messageCreate,
    data: { ...message, conversationId: conversation.id },
  });
};

export const getAllMessages = async (conversation: Conversation) => {
  return sendPostRequest({
    endPoint: API_LINKS.messageGetAll,
    data: conversation,
  });
};
