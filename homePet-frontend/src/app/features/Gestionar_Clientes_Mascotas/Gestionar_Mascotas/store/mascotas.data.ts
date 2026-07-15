import type { MascotaFormValues, MascotaPayload } from "../types"

export const tamanoOptions = ["Pequeño", "Mediano", "Grande"] as const

export const mascotaInitialValues: MascotaFormValues = {
  id_usuario: "",
  id_especie: "",
  id_raza: "",
  nombre: "",
  color: "",
  sexo: "MACHO",
  fecha_nac: "",
  tamano: "Mediano",
  peso: "",
  foto: "",
  alergias: "",
  notas_generales: "",
  estado: true,
}

export function mapMascotaFormToPayload(
  data: MascotaFormValues,
): MascotaPayload {
  return {
    usuario_id: Number(data.id_usuario),
    especie_id: Number(data.id_especie),
    raza_id: data.id_raza === "" ? null : Number(data.id_raza),
    nombre: data.nombre.trim(),
    color: data.color.trim() || null,
    sexo: data.sexo || null,
    fecha_nac: data.fecha_nac || null,
    tamano: data.tamano || null,
    peso: data.peso === "" ? null : Number(data.peso),
    foto: data.foto.trim() || null,
    alergias: data.alergias.trim() || null,
    notas_generales: data.notas_generales.trim() || null,
    estado: Boolean(data.estado),
  }
}