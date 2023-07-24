import { Prompt } from '@/types/prompt';

import { API_LINKS, sendPostRequest } from './api';

export const updatePrompt = (updatedPrompt: Prompt, allPrompts: Prompt[]) => {
  const updatedPrompts = allPrompts.map((c) => {
    if (c.id === updatedPrompt.id) {
      return updatedPrompt;
    }

    return c;
  });

  savePrompts(updatedPrompts);

  return {
    single: updatedPrompt,
    all: updatedPrompts,
  };
};

export const savePrompts = (prompts: Prompt[]) => {
  localStorage.setItem('prompts', JSON.stringify(prompts));
};

export const savePrompt = async (prompt: Prompt) =>
  sendPostRequest({ endPoint: API_LINKS.promptUpdate, data: prompt });
