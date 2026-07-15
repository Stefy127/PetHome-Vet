import { createFileRoute } from '@tanstack/react-router';
import BitacoraScreen from '@/app/features/AutenticacionySeguridad/bitacora/screen/BitacoraScreen';

export const Route = createFileRoute('/_admin/bitacora')({
  component: BitacoraScreen,
});