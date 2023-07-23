import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';

import { CreateMessageBody } from '@/types/chat';

import { authOptions } from '../auth/[...nextauth]';

import prisma from '@/prisma/prisma';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { content, conversationId, role } =
      (await req.body) as CreateMessageBody;

    if (!content || !role) {
      return res.status(400).send({
        statusText: 'error: Required field is missing.',
      });
    }

    const session = await getServerSession(req, res, authOptions);
    const userId = session?.user?.id;

    if (!userId) {
      return res.status(400).send({
        statusText: 'error: User must be logged in to save message.',
      });
    }

    const newMessage = await prisma.message.create({
      data: {
        content,
        conversationId,
        role,
        userId,
      },
    });

    return res.status(201).send({ message: newMessage });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ error: error });
  }
};

export default handler;
