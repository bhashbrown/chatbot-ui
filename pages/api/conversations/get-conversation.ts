import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';

import { GetConversationBody } from '@/types/chat';

import { authOptions } from '../auth/[...nextauth]';

import prisma from '@/prisma/prisma';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { id: conversationId } = (await req.body) as GetConversationBody;

    if (!conversationId) {
      return res.status(400).send({
        statusText: 'error: Required field is missing.',
      });
    }

    const session = await getServerSession(req, res, authOptions);
    const userId = session?.user?.id;

    if (!userId) {
      return res.status(400).send({
        statusText: 'error: User must be logged in to fetch prompt.',
      });
    }

    const conversation = await prisma.conversation.findFirst({
      where: { id: conversationId },
    });

    return res.status(201).send({ conversation });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ error: error });
  }
};

export default handler;
