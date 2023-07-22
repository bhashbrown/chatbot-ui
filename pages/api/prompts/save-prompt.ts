import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';

import { Prompt } from '@/types/prompt';

import { authOptions } from '../auth/[...nextauth]';

import prisma from '@/prisma/prisma';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const {
      id: promptId,
      name,
      description,
      content,
      model,
      folderId,
    } = (await req.body) as Prompt;

    if (!promptId) {
      return res.status(400).send({
        statusText: 'error: Required field is missing.',
      });
    }

    const session = await getServerSession(req, res, authOptions);
    const email = session?.user?.email;

    if (!email) {
      return res.status(400).send({
        statusText: 'error: User must be logged in to save prompt.',
      });
    }

    const user = await prisma.user.findFirst({ where: { email } });

    if (!user) {
      return res.status(400).send({
        statusText: 'error: User does not exist in the database.',
      });
    }

    const promptData = {
      id: promptId,
      name,
      description,
      content,
      modelId: model.id,
      folderId,
      userId: user.id,
    };

    const newPrompt = await prisma.prompt.upsert({
      where: { id: promptId },
      update: promptData,
      create: promptData,
    });

    return res.status(201).send({ prompt: newPrompt });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ error: error });
  }
};

export default handler;
