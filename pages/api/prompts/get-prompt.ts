import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';

import { GetPromptBody } from '@/types/prompt';

import { authOptions } from '../auth/[...nextauth]';

import prisma from '@/prisma/prisma';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { id: promptId } = (await req.body) as GetPromptBody;

    if (!promptId) {
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

    const prompt = await prisma.prompt.findFirst({
      where: { id: promptId },
    });

    return res.status(201).send({ prompt });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ error: error });
  }
};

export default handler;
