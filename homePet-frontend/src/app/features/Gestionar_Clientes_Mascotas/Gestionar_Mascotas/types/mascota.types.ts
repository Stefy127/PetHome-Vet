export type SexoMascota = "MACHO" | "HEMBRA"
export type TamanoMascota = "Pequeño" | "Mediano" | "Grande"

export interface EspecieMascota {
  id_especie: number
  nombre: string
}

export interface RazaMascota {
  id_raza: number
  nombre: string
}

export interface UsuarioMascota {
  id_usuario: number
  nombre: string
}

export interface ClienteOption {
  id_usuario: number
  nombre: string
}

export interface EspecieOption {
  id_especie: number
  nombre: string
}

export interface RazaOption {
  id_raza: number
  nombre: string
}

export interface Mascota {
  id_mascota: number
  nombre: string
  color: string | null
  sexo: SexoMascota | null
  fecha_nac: string | null
  tamano: TamanoMascota | null
  peso: number
  foto: string | null
  alergias: string | null
  notas_generales: string | null
  fecha_registro: string
  estado: boolean

  usuario?: UsuarioMascota | null
  especie?: EspecieMascota | null
  raza?: RazaMascota | null
}

export interface MascotaPayload {
  usuario_id: number
  especie_id: number
  raza_id: number | null
  nombre: string
  color: string | null
  sexo: SexoMascota | null
  fecha_nac: string | null
  tamano: TamanoMascota | null
  peso: number | null
  foto: string | null
  alergias: string | null
  notas_generales: string | null
  estado: boolean
}

export interface MascotaFormValues {
  id_usuario: number | ""
  id_especie: number | ""
  id_raza: number | ""
  nombre: string
  color: string
  sexo: SexoMascota
  fecha_nac: string
  tamano: TamanoMascota
  peso: number | ""
  foto: string
  alergias: string
  notas_generales: string
  estado: boolean
}