import {
  LayoutDashboard,
  PawPrint,
  Users,
  CalendarDays,
  ShieldCheck,
  Building2,
  CreditCard,
  Settings,
  Activity,
  UserCircle,
} from "lucide-react";

export const iconMap: Record<string, any> = {
  MENU_DASHBOARD: LayoutDashboard,
  MENU_MASCOTAS: PawPrint,
  MENU_USUARIOS: Users,
  MENU_CITAS: CalendarDays,
  MENU_BITACORA: ShieldCheck,
  MENU_SAAS_VETERINARIAS: Building2,
  MENU_SAAS_PLANES: CreditCard,
  MENU_SERVICIOS: Activity,
  MENU_CLIENTES: UserCircle,
  // Agrega más mapeos según tus códigos de componente
};

export const getIconByCode = (code: string) => {
  return iconMap[code] || Settings;
};
