import NextAuth from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      username: string
      name: string
      email?: string | null
      role: string
    }
  }

  interface User {
    id: string
    username: string
    name: string
    email?: string | null
    role: string
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    username: string
    role: string
  }
}