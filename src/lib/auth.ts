import { getServerSession, type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";

import { PrismaAdapter } from "@next-auth/prisma-adapter";

import { prismaClient } from "@/database/client";
import { compareSync } from "bcryptjs";

export const authConfigs: NextAuthOptions = {
  adapter: PrismaAdapter(prismaClient),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          scope:
            "https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email",
        },
      },
    }),
    CredentialsProvider({
      type: "credentials",
      credentials: {
        username: { label: "Usuário", type: "text" },
        password: { label: "Senha", type: "password" },
      },
      async authorize(credentials) {
        const user = await prismaClient.user.findFirst({
          where: {
            username: credentials?.username,
          },
        });
      
        if (!user || !compareSync(credentials?.password!, user.password!)) {
          throw new Error('Credenciais não encontradas')
        }

        return user;
      },
    }),
  ],

  callbacks: {
    session({ session }) {
      return session
    },

    jwt({ token, user, account }) {
      if (account && user) token.user = user;

      return token;
    },

  },
  pages: {
    signIn: "/",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export const getServerSessionApp = () => getServerSession(authConfigs);
