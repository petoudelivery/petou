"use client";

import Image from "next/image";
import Link from "next/link";
import { MessageCircle, MapPin, Clock, Phone, Heart, ArrowUpRight } from "lucide-react";

export default function Footer() {
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "5591980762149";
  const cleanNumber = whatsappNumber.replace(/\D/g, "");

  const defaultMessage = encodeURIComponent(
    "Olá, equipe PETOU! Gostaria de tirar dúvidas sobre produtos e entregas em Barcarena."
  );

  return (
    <footer role="contentinfo" className="bg-[#FAF8F2] border-t border-[#E8EFE5] text-[#202C27] pt-16 pb-12">
      <h2 className="sr-only">Informações Institucionais e Rodapé</h2>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-[#E8EFE5]">
          
          {/* Column 1 & 2: Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" aria-label="Página inicial PETOU Store" className="inline-block rounded-xl focus-visible:outline-2 focus-visible:outline-[#174C3C]">
              <div className="relative w-36 sm:w-44 h-12">
                <Image
                  src="/petou-logo.png"
                  alt="PETOU - Cuidado que acompanha você"
                  fill
                  sizes="(max-width: 640px) 144px, 176px"
                  loading="lazy"
                  className="object-contain object-left"
                />
              </div>
            </Link>
            <p className="text-sm font-semibold text-[#174C3C]">
              Cuidado que acompanha você.
            </p>
            <p className="text-xs sm:text-sm text-[#202C27]/85 leading-relaxed max-w-sm">
              Tudo para cuidar melhor de quem faz parte da família. Alimentos selecionados,
              higiene e acessórios com atendimento próximo e entrega dedicada em Barcarena e região.
            </p>
            <div className="flex items-center gap-2 text-xs font-bold text-[#174C3C] pt-1">
              <MapPin className="w-4 h-4 text-[#F47C49] shrink-0" aria-hidden="true" />
              <span>Barcarena - Pará, Brasil</span>
            </div>
          </div>

          {/* Column 3: Categorias */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-[#174C3C] uppercase tracking-wider">
              Categorias
            </h3>
            <ul className="space-y-2 text-xs sm:text-sm text-[#202C27]/85" aria-label="Links rápidos de categorias">
              <li>
                <Link href="/categoria/caes" className="hover:text-[#174C3C] transition py-1 inline-block focus-visible:outline-2 focus-visible:outline-[#174C3C] rounded">
                  Cães
                </Link>
              </li>
              <li>
                <Link href="/categoria/gatos" className="hover:text-[#174C3C] transition py-1 inline-block focus-visible:outline-2 focus-visible:outline-[#174C3C] rounded">
                  Gatos
                </Link>
              </li>
              <li>
                <Link href="/categoria/alimentacao" className="hover:text-[#174C3C] transition py-1 inline-block focus-visible:outline-2 focus-visible:outline-[#174C3C] rounded">
                  Alimentação
                </Link>
              </li>
              <li>
                <Link href="/categoria/higiene" className="hover:text-[#174C3C] transition py-1 inline-block focus-visible:outline-2 focus-visible:outline-[#174C3C] rounded">
                  Higiene e cuidados
                </Link>
              </li>
              <li>
                <Link href="/categoria/acessorios" className="hover:text-[#174C3C] transition py-1 inline-block focus-visible:outline-2 focus-visible:outline-[#174C3C] rounded">
                  Acessórios
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Navegação */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-[#174C3C] uppercase tracking-wider">
              Navegação
            </h3>
            <ul className="space-y-2 text-xs sm:text-sm text-[#202C27]/85" aria-label="Navegação institucional">
              <li>
                <Link href="/" className="hover:text-[#174C3C] transition py-1 inline-block focus-visible:outline-2 focus-visible:outline-[#174C3C] rounded">
                  Início
                </Link>
              </li>
              <li>
                <Link href="/#categorias" className="hover:text-[#174C3C] transition py-1 inline-block focus-visible:outline-2 focus-visible:outline-[#174C3C] rounded">
                  Categorias em Destaque
                </Link>
              </li>
              <li>
                <Link href="/#produtos" className="hover:text-[#174C3C] transition py-1 inline-block focus-visible:outline-2 focus-visible:outline-[#174C3C] rounded">
                  Escolhas para o dia a dia
                </Link>
              </li>
              <li>
                <a
                  href={`https://wa.me/${cleanNumber}?text=${defaultMessage}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#174C3C] transition inline-flex items-center gap-1 py-1 focus-visible:outline-2 focus-visible:outline-[#174C3C] rounded"
                >
                  <span>Atendimento ao Tutor</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-[#F47C49]" aria-hidden="true" />
                </a>
              </li>
            </ul>
          </div>

          {/* Column 5: Atendimento Barcarena */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-[#174C3C] uppercase tracking-wider">
              Atendimento Barcarena
            </h3>
            <div className="space-y-2 text-xs text-[#202C27]/85">
              <div className="flex items-start gap-2">
                <Clock className="w-4 h-4 text-[#78916D] shrink-0 mt-0.5" aria-hidden="true" />
                <span>Segunda a Sábado, das 08h às 18h</span>
              </div>
              <div className="flex items-start gap-2">
                <Phone className="w-4 h-4 text-[#78916D] shrink-0 mt-0.5" aria-hidden="true" />
                <span>Estoque confirmado via WhatsApp</span>
              </div>
            </div>

            <div className="pt-2">
              <a
                href={`https://wa.me/${cleanNumber}?text=${defaultMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-[#174C3C] text-[#FFFFFF] text-xs font-bold hover:bg-[#174C3C]/90 active:scale-95 transition shadow-sm min-h-[44px] focus-visible:outline-2 focus-visible:outline-[#174C3C]"
              >
                <MessageCircle className="w-4 h-4 text-[#F47C49]" aria-hidden="true" />
                <span>Falar no WhatsApp</span>
              </a>
            </div>
          </div>

        </div>

        {/* Bottom Bar: Copyright & Note */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#66716A]">
          <p>© 2026 PETOU Store. Todos os direitos reservados. Barcarena - PA.</p>
          <p className="flex items-center gap-1.5 font-medium text-[#202C27]/85">
            <span>Cuidado que acompanha você</span>
            <Heart className="w-3.5 h-3.5 text-[#F47C49] fill-[#F47C49]" aria-hidden="true" />
          </p>
        </div>

      </div>
    </footer>
  );
}
