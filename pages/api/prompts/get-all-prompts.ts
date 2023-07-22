import { NextApiRequest, NextApiResponse } from 'next';

import { GetPromptBody } from '@/types/prompt';

import prisma from '@/prisma/prisma';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { id: userId } = (await req.body) as GetPromptBody;

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

    const prompts = await prisma.prompt.findMany({
      where: { userId: user.id },
    });

    return res.status(201).send({ prompts });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ error: error });
  }
};

export default handler;
