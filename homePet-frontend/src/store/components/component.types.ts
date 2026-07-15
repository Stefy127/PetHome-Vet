export type Plataforma = "WEB" | "MOVIL" | "AMBOS" | "SAAS";

export type TipoComponente =
  | "MODULO"
  | "MENU"
  | "FORMULARIO"
  | "BOTON"
  | "CAMPO"
  | "LABEL"
  | "TEXTO"
  | "ACCION";

export type PermisosComponente = {
  ver: boolean;
  crear: boolean;
  editar: boolean;
  eliminar: boolean;
  exportar: boolean;
  ejecutar: boolean;
};

export type ComponenteSistema = {
  id_componente: number;
  codigo: string;
  nombre: string;
  tipo: TipoComponente;
  modulo: string;
  ruta: string | null;
  plataforma: Plataforma;
  id_padre: number | null;
  orden: number;
  permisos: PermisosComponente;
  children: ComponenteSistema[];
};
