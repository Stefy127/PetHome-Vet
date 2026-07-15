export interface DetalleReceta {
  id_detalle_receta: number
  medicamento?: string | null
  dosis?: string | null
  frecuencia?: string | null
  duracion_dias?: number | null
  indicaciones_adicionales?: string | null
  id_producto?: number | null
  receta?: number | null
}

export interface DetalleRecetaPayload {
  receta?: number | null
  medicamento: string
  dosis: string
  frecuencia: string
  duracion_dias?: number | null
  indicaciones_adicionales?: string | null
  id_producto?: number | null
}

export interface Receta {
  id_receta: number
  fecha?: string | null
  indicaciones?: string | null
  observacion?: string | null
  detalles?: DetalleReceta[]
}

export interface RecetaPayload {
  consulta_clinica?: number | null
  fecha: string
  indicaciones: string
  observacion?: string | null
}

export interface Tratamiento {
  id_tratamiento: number
  tipo?: string | null
  descripcion?: string | null
  fecha_ini?: string | null
  fecha_fin?: string | null
  observacion?: string | null
  estado_tratamiento?: string | null
  estado?: boolean
  fecha_creacion?: string | null
  fecha_actualizacion?: string | null
  id_consulta_clinica?: number | null
}

export interface TratamientoPayload {
  consulta_clinica?: number | null
  tipo: string
  descripcion: string
  fecha_ini?: string | null
  fecha_fin?: string | null
  observacion?: string | null
  estado_tratamiento?: string | null
}

export interface VacunaAplicada {
  id_vacuna_aplicada: number
  nombre_vacuna?: string | null
  dosis?: string | null
  fecha_aplicada?: string | null
  fecha_proxima?: string | null
  observacion?: string | null
  lote?: string | null
  fabricante?: string | null
  estado_vacuna?: string | null
  estado?: boolean
  fecha_creacion?: string | null
  id_consulta_clinica?: number | null
}

export interface VacunaAplicadaPayload {
  consulta_clinica?: number | null
  nombre_vacuna: string
  dosis?: string | null
  fecha_aplicada: string
  fecha_proxima?: string | null
  observacion?: string | null
  lote?: string | null
  fabricante?: string | null
  estado_vacuna?: string | null
}

export interface ArchivoClinico {
  id_archivo_clinico: number
  consulta_clinica?: number | null
  nombre_archivo?: string | null
  archivo?: string | null
  tipo_archivo?: "IMAGEN" | "PDF" | "WORD" | "OTRO" | string | null
  extension?: string | null
  tamano_bytes?: number | null
  descripcion?: string | null
  fecha_subida?: string | null
  estado?: boolean
}

export interface ArchivoClinicoPayload {
  consulta_clinica?: number | null
  nombre_archivo: string
  archivo?: File | null
  tipo_archivo: "IMAGEN" | "PDF" | "WORD" | "OTRO" | string
  descripcion?: string | null
  estado?: boolean
}

export interface ConsultaClinica {
  id_consulta_clinica: number
  historial_clinico?: number | null
  cita?: number | null
  usuario_veterinario?: number | null

  veterinario_nombre?: string | null
  mascota_nombre?: string | null
  propietario_id?: number | null
  propietario_nombre?: string | null

  motivo_consulta?: string | null
  diagnostico?: string | null
  observaciones?: string | null
  fecha_consulta?: string | null

  peso?: number | null
  temperatura?: number | null
  frecuencia_cardiaca?: number | null
  frecuencia_respiratoria?: number | null
  proxima_revision?: string | null

  fecha_creacion?: string | null
  fecha_actualizacion?: string | null
  estado?: boolean

  tratamientos?: Tratamiento[]
  receta?: Receta | null
  vacunas_aplicadas?: VacunaAplicada[]
  archivos_clinicos?: ArchivoClinico[]
}
export interface ProductoOption {
  id_producto: number
  nombre?: string | null
  precio_compra?: number | null
  precio_venta?: number | null
  unidad_medida?: string | null
  estado?: boolean
}
export interface ConsultaClinicaPayload {
  usuario_veterinario: number
  fecha_consulta: string
  motivo_consulta: string
  diagnostico?: string | null
  observaciones?: string | null
  peso?: number | null
  temperatura?: number | null
  frecuencia_cardiaca?: number | null
  frecuencia_respiratoria?: number | null
  proxima_revision?: string | null
  cita?: number | null
}

export interface ClinicalHistory {
  id_historial_clinico: number
  mascota?: number | null
  mascota_id?: number | null
  mascota_nombre?: string | null
  mascota_especie?: string | null
  mascota_raza?: string | null
  propietario_id?: number | null
  propietario_nombre?: string | null
  observaciones_generales?: string | null
  fecha_creacion?: string | null
  fecha_actualizacion?: string | null
  estado?: boolean
  consultas_clinicas?: ConsultaClinica[]
}

export interface ClinicalHistoryPayload {
  mascota: number
  observaciones_generales?: string | null
}

export interface VeterinarioOption {
  id_usuario: number
  nombre?: string | null
  correo?: string | null
}