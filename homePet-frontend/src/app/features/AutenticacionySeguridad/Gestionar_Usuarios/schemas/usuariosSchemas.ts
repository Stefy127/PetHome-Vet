import { z } from 'zod'

export const PerfilUsuarioSchema = z.object({
  id_perfil: z.number(),
  usuario: z.number(), // ID del usuario
  correo: z.string().email(),
  rol: z.string(), // "Administrador", "Veterinaria", etc.
  nombre: z.string(),
  telefono: z.string(),
  direccion: z.string(),
  estado: z.boolean(),
  fecha_creacion: z.string(),
})

// Para la creación (POST)
export const CreateUsuarioSchema = z.object({
  correo: z.string().email('Correo no válido'),
  password: z.string().min(8, 'Mínimo 8 caracteres'),
  id_rol: z.number(),
  nombre: z.string().min(2, 'Nombre requerido'),
  telefono: z.string(),
  direccion: z.string(),
})

export type PerfilUsuario = z.infer<typeof PerfilUsuarioSchema>
export type CreateUsuarioInput = z.infer<typeof CreateUsuarioSchema>
