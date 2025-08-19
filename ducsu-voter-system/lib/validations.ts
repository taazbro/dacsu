import { z } from 'zod'

export const loginSchema = z.object({
  username: z.string().min(3).max(20),
  password: z.string().min(6)
})

export const voterSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  nameBn: z.string().optional(),
  hallId: z.string().min(1),
  department: z.string().optional(),
  departmentBn: z.string().optional(),
  session: z.string().optional(),
  year: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email().optional(),
  verified: z.boolean().default(false)
})

export const hallSchema = z.object({
  name: z.string().min(1),
  nameBn: z.string().min(1),
  prefix: z.string().min(1).max(10)
})

export const searchSchema = z.object({
  q: z.string().optional(),
  hall: z.string().optional(),
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(100).default(50),
  sortBy: z.enum(['name', 'id', 'hall', 'createdAt']).default('name'),
  order: z.enum(['asc', 'desc']).default('asc')
})
