import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';

import { Conversation } from '@/types/chat';
import { Prompt } from '@/types/prompt';

import { authOptions } from '../auth/[...nextauth]';

import prisma from '@/prisma/prisma';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const {
      id: conversationId,
      archived,
      name,
      model,
      prompt,
      temperature,
      folderId,
    } = (await req.body) as Conversation;

    if (!conversationId) {
      return res.status(400).send({
        statusText: 'error: Required field is missing.',
      });
    }

    const session = await getServerSession(req, res, authOptions);
    const userId = session?.user?.id;

    if (!userId) {
      return res.status(400).send({
        statusText: 'error: User must be logged in to save conversation.',
      });
    }

    const conversationData = {
      id: conversationId,
      archived,
      name,
      modelId: model.id,
      prompt,
      temperature,
      folderId,
      userId,
    };

    const updatedConversation = await prisma.conversation.upsert({
      where: { id: conversationId },
      create: conversationData,
      update: conversationData,
    });

    return res.status(201).send({ conversation: updatedConversation });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ error: error });
  }
};

export default handler;
