import { z } from 'zod'

export const RolSchema = z.object({
  id_rol: z.number(),
  nombre: z.string(),
  descripcion: z.string().optional().nullable(),
})

export const UserSchema = z.object({
  id_usuario: z.number(),
  correo: z.string().email(),
  role: RolSchema,
  is_active: z.boolean(),
  date_joined: z.string(),
})

export const LoginResponseSchema = z.object({
  tokens: z.object({
    refresh: z.string(),
    access: z.string(),
  }),
  user: UserSchema,
})

export type User = z.infer<typeof UserSchema>
export type LoginResponse = z.infer<typeof LoginResponseSchema>
