import NextAuth from "next-auth";

import { authConfigs } from "@/lib";

const handler = NextAuth(authConfigs);

export { handler as GET, handler as POST };
