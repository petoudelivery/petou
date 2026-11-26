import Image from "next/image";
import { MessageCircle, MapPin, Clock, Phone, Heart } from "lucide-react";
import { CATEGORIES } from "@/data/products";

export default function Footer() {
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "5591980762149";
  const cleanNumber = whatsappNumber.replace(/\D/g, "");

  return (
    <footer className="bg-petou-cream border-t border-petou-green/10 text-petou-green pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-petou-green/10">
          
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="relative w-44 h-12">
              <Image
                src="/petou-logo.png"
                alt="Petou Store"
                fill
                className="object-contain object-left"
              />
            </div>
            <p className="text-sm text-petou-green/80 leading-relaxed max-w-sm">
              Petou Store é o seu pet shop de confiança em <strong>Barcarena</strong>.
              Oferecemos alimentos balanceados, petiscos saborosos e produtos de cuidado com entrega prática e confirmação humanizada.
            </p>
            <div className="flex items-center gap-2 text-xs text-petou-green/80 pt-1">
              <MapPin className="w-4 h-4 text-petou-yellow shrink-0" />
              <span>Barcarena - Pará, Brasil</span>
            </div>
          </div>

          {/* Categorias */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-petou-green uppercase tracking-wider">
              Categorias
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-petou-green/80">
              {CATEGORIES.slice(1).map((cat) => (
                <li key={cat}>
                  <a href="#produtos" className="hover:text-petou-yellow transition">
                    {cat}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Navegação Rápida */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-petou-green uppercase tracking-wider">
              Navegação
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-petou-green/80">
              <li>
                <a href="#produtos" className="hover:text-petou-yellow transition">
                  Produtos Populares
                </a>
              </li>
              <li>
                <a href="#colecoes" className="hover:text-petou-yellow transition">
                  Coleções Especiais
                </a>
              </li>
              <li>
                <a href="#vantagens" className="hover:text-petou-yellow transition">
                  Vantagens Petou
                </a>
              </li>
              <li>
                <a
                  href={`https://wa.me/${cleanNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-petou-yellow transition"
                >
                  Suporte ao Tutor
                </a>
              </li>
            </ul>
          </div>

          {/* Atendimento Barcarena */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-petou-green uppercase tracking-wider">
              Atendimento
            </h4>
            <div className="space-y-2 text-xs sm:text-sm text-petou-green/80">
              <div className="flex items-start gap-2">
                <Clock className="w-4 h-4 text-petou-yellow shrink-0 mt-0.5" />
                <span>Segunda a Sábado, das 08h às 18h</span>
              </div>
              <div className="flex items-start gap-2">
                <Phone className="w-4 h-4 text-petou-yellow shrink-0 mt-0.5" />
                <span>Confirmação via WhatsApp</span>
              </div>
            </div>

            <div className="pt-2">
              <a
                href={`https://wa.me/${cleanNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-petou-green text-petou-white text-xs font-bold hover:bg-petou-green/90 transition shadow-md"
              >
                <MessageCircle className="w-4 h-4 text-petou-yellow" />
                <span>Falar com Atendente</span>
              </a>
            </div>
          </div>

        </div>

        {/* Bottom Credits & Disclaimer */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-petou-green/70">
          <p>© 2026 PETOU Store. Todos os direitos reservados. Barcarena - PA.</p>
          <p className="flex items-center gap-1">
            Feito com carinho para os pets <Heart className="w-3.5 h-3.5 fill-petou-yellow text-petou-yellow inline" />
          </p>
        </div>
      </div>
    </footer>
  );
}
