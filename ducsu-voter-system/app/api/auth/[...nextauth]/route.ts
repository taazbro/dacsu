import NextAuth, { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { z } from "zod"

const loginSchema = z.object({
  username: z.string().min(3).max(20),
  password: z.string().min(6)
})

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        try {
          const { username, password } = loginSchema.parse(credentials)
          
          const user = await prisma.user.findUnique({
            where: { username }
          })
          
          if (!user) {
            throw new Error("Invalid credentials")
          }
          
          const isValid = await bcrypt.compare(password, user.password)
          
          if (!isValid) {
            throw new Error("Invalid credentials")
          }
          
          // Log the login
          await prisma.auditLog.create({
            data: {
              userId: user.id,
              action: "LOGIN",
              details: { username }
            }
          })
          
          return {
            id: user.id,
            username: user.username,
            name: user.name,
            email: user.email,
            role: user.role
          }
        } catch (error) {
          console.error("Auth error:", error)
          return null
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.username = user.username
        token.role = user.role
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string
        session.user.username = token.username as string
        session.user.role = token.role as string
      }
      return session
    }
  },
  pages: {
    signIn: "/",
    error: "/auth/error",
  },
  secret: process.env.NEXTAUTH_SECRET,
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }
