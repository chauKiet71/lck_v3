import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

export const authOptions = {
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) return null;

                const admin = await prisma.admin.findUnique({
                    where: { email: credentials.email }
                });

                if (admin && bcrypt.compareSync(credentials.password, admin.password)) {
                    return { id: admin.id, name: admin.name, email: admin.email };
                }
                return null;
            }
        })
    ],
    pages: {
        signIn: '/admin/login',
    },
    callbacks: {
        async session({ session, token }: any) {
            if (session?.user) {
                session.user.id = token.sub;
            }
            return session;
        }
    },
    secret: process.env.NEXTAUTH_SECRET || "default_secret_please_change",
}

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
