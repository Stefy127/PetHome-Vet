export type Veterinaria = {
  id_veterinaria: number;
  nombre: string;
  slug: string;
  logo?: string | null;
  estado: boolean;
};

export type Plan = {
  nombre: string;
  permite_app_movil: boolean;
  permite_reportes: boolean;
  permite_backup: boolean;
  limite_usuarios: number;
  limite_mascotas: number;
};

export type VeterinariaPublica = {
  id_veterinaria: number;
  nombre: string;
  slug: string;
  logo?: string | null;
  direccion?: string | null;
};
