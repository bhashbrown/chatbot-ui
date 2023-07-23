import { NextApiRequest, NextApiResponse } from 'next';

import { GetConversationBody } from '@/types/chat';

import prisma from '@/prisma/prisma';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { id: userId } = (await req.body) as GetConversationBody;

    if (!userId) {
      return res.status(400).send({
        statusText: 'error: Required fields were not provided.',
      });
    }

    const user = await prisma.user.findFirst({ where: { id: userId } });

    if (!user) {
      return res.status(400).send({
        statusText: 'error: User does not exist in the database.',
      });
    }

    const conversations = await prisma.conversation.findMany({
      where: { userId: user.id, archived: false },
    });

    return res.status(201).send({ conversations });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ error: error });
  }
};

export default handler;
