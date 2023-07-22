import NextAuth, { NextAuthOptions } from 'next-auth';
import type { Adapter } from 'next-auth/adapters';
import CredentialsProvider from 'next-auth/providers/credentials';

import prisma from '@/prisma/prisma';
import { PrismaAdapter } from '@auth/prisma-adapter';
import argon2 from 'argon2';

export const authOptions: NextAuthOptions = {
  // This type assertion is needed to prevent a type error - https://github.com/nextauthjs/next-auth/issues/6106#issuecomment-1582582312
  // This is probably a bug since both packages are from NextAuth
  adapter: PrismaAdapter(prisma) as Adapter,
  // Callbacks are asynchronous functions you can use to control what happens
  // when an action is performed.
  // https://next-auth.js.org/configuration/callbacks
  callbacks: {
    // If we want info on token to be accessible to client, we need to add it to
    // session here.
    async session({ session, user, token }) {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id,
        },
      };
    },
    // Add additional info to JWT
    async jwt({ token, user }) {
      // User is only defined on signin/signup
      if (!user) return token;

      return {
        ...token,
        id: user.id,
      };
    },
  },
  // The secret should be set to a reasonably long random string.
  // It is used to sign cookies and to sign and encrypt JSON Web Tokens, unless
  // a separate secret is defined explicitly for encrypting the JWT.
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    // Use JSON Web Tokens for session instead of database sessions.
    // This option can be used with or without a database for users/accounts.
    // Note: `jwt` is automatically set to `true` if no database is specified.
    strategy: 'jwt',
  },
  providers: [
    CredentialsProvider({
      name: 'Login',
      credentials: {
        email: {
          label: 'Email',
          type: 'email',
        },
        password: { label: 'Password', type: 'password' },
      },
      // authorize either returns a user or null - https://next-auth.js.org/providers/credentials#example---username--password
      async authorize(credentials) {
        // verify that credentials have been sent
        if (!credentials) {
          console.error('Credentials are required, but none were found.');
          return null;
        }

        // verify that all required fields have been sent
        const { email, password } = credentials;
        if (!email || !password) {
          console.error('Some or all required fields were missing.');
          return null;
        }

        const sanitizedEmail = email.toLowerCase();

        try {
          // find user with the same email address
          const user = await prisma.user.findFirst({
            where: { email: sanitizedEmail },
          });

          // return null if no user was found
          if (!user) {
            console.error('No user found with this email address.');
            return null;
          }

          // verify that the encrypted password matches the password entered by the user
          const isPasswordCorrect = await argon2.verify(
            user.password,
            password,
          );

          return isPasswordCorrect
            ? {
                id: user.id,
                name: user.email,
                email: user.email,
              }
            : null;
        } catch (error) {
          console.error(error);
          return null;
        }
      },
    }),
  ],
};

export default NextAuth(authOptions);
