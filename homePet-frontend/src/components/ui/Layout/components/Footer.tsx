import { Heart, Facebook, Instagram, Mail, Phone, MapPin } from 'lucide-react'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'

export const Footer = () => {
  return (
    <footer className="border-t bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 grid gap-10 grid-cols-1 sm:grid-cols-2 md:grid-cols-4">
        {/* Logo */}
        <div className="space-y-4 text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start gap-2">
            <div className="w-10 h-10 rounded-full bg-[#F97316] flex items-center justify-center">
              <Heart className="w-5 h-5 text-white" fill="currentColor" />
            </div>
            <h2 className="text-xl font-bold text-[#7C3AED]">Pet Home</h2>
          </div>
          <p className="text-sm text-[#6B7280]">
            Cuidamos a tus mascotas con amor, tecnología y profesionales
            capacitados.
          </p>
        </div>

        {/* Navegación */}
        <div className="text-center sm:text-left">
          <h3 className="font-semibold mb-4 text-[#7C3AED]">Navegación</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <a
                href="/"
                className="text-[#6B7280] hover:text-[#F97316] transition"
              >
                Inicio
              </a>
            </li>
            <li>
              <a
                href="/servicios"
                className="text-[#6B7280] hover:text-[#F97316] transition"
              >
                Servicios
              </a>
            </li>
            <li>
              <a
                href="/citas"
                className="text-[#6B7280] hover:text-[#F97316] transition"
              >
                Citas
              </a>
            </li>
            <li>
              <a
                href="/contacto"
                className="text-[#6B7280] hover:text-[#F97316] transition"
              >
                Contacto
              </a>
            </li>
          </ul>
        </div>

        {/* Contacto */}
        <div className="text-center sm:text-left">
          <h3 className="font-semibold mb-4 text-[#7C3AED]">Contacto</h3>
          <ul className="space-y-3 text-sm text-[#6B7280]">
            <li className="flex items-center justify-center sm:justify-start gap-2">
              <MapPin className="w-4 h-4 text-[#F97316]" /> Santa Cruz, Bolivia
            </li>
            <li className="flex items-center justify-center sm:justify-start gap-2">
              <Phone className="w-4 h-4 text-[#F97316]" /> +591 700 00000
            </li>
            <li className="flex items-center justify-center sm:justify-start gap-2">
              <Mail className="w-4 h-4 text-[#F97316]" /> contacto@pethome.com
            </li>
          </ul>
        </div>

        {/* Redes */}
        <div className="text-center sm:text-left">
          <h3 className="font-semibold mb-4 text-[#7C3AED]">Síguenos</h3>
          <div className="flex justify-center sm:justify-start gap-3">
            <Button
              variant="outline"
              size="icon"
              className="border-[#7C3AED] text-[#7C3AED] hover:bg-[#7C3AED] hover:text-white"
            >
              <Facebook className="w-4 h-4" />
            </Button>

            <Button
              variant="outline"
              size="icon"
              className="border-[#F97316] text-[#F97316] hover:bg-[#F97316] hover:text-white"
            >
              <Instagram className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      <Separator />

      <div className="text-center py-4 text-sm text-[#6B7280]">
        © {new Date().getFullYear()}{' '}
        <span className="text-[#7C3AED] font-semibold">Pet Home</span> 🐾 —
        Todos los derechos reservados
      </div>
    </footer>
  )
}
