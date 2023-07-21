import { NextApiRequest, NextApiResponse } from 'next';

import { SignUpBody } from '@/types/auth';

import prisma from '@/prisma/prisma';
import argon2 from 'argon2';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { email, password } = (await req.body) as SignUpBody;

    // verify that all required fields have been sent
    if (!email || !password) {
      return res.status(400).send({
        statusText: 'Sign up error: Required field is missing.',
      });
    }

    const user = await prisma.user.findFirst({ where: { email } });

    if (user) {
      return res.status(201).send({
        email: user.email,
      });
    }

    // encrypt password before storing on the database
    const passwordHash = await argon2.hash(password);
    const sanitizedEmail = email.toLowerCase();

    // add user to the database - if one already exists, return error
    const newUser = await prisma.user.create({
      data: {
        email: sanitizedEmail,
        password: passwordHash,
      },
    });

    return res.status(201).send({
      email: newUser.email,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ error: error });
  }
};

export default handler;
