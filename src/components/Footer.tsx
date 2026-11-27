"use client";

import Image from "next/image";
import Link from "next/link";
import { MessageCircle, MapPin, Clock, Phone, Heart, ArrowUpRight } from "lucide-react";

export default function Footer() {
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "5591980762149";
  const cleanNumber = whatsappNumber.replace(/\D/g, "");

  const defaultMessage = encodeURIComponent(
    "Olá, equipe Petou! Gostaria de tirar dúvidas sobre produtos e entregas em Barcarena."
  );

  return (
    <footer role="contentinfo" className="bg-[#08422E] text-white">
      <h2 className="sr-only">Informações Institucionais e Rodapé</h2>

      {/* Main footer body */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-white/10">

          {/* Brand column */}
          <div className="lg:col-span-2 space-y-5">
            <Link
              href="/"
              aria-label="Página inicial Petou Store"
              className="inline-block rounded-xl focus-visible:outline-2 focus-visible:outline-[#FAB31F]"
            >
              <div className="relative w-36 sm:w-44 h-12">
                <Image
                  src="/petou-logo.png"
                  alt="PETOU - Tudo para o seu pet pertinho de você"
                  fill
                  sizes="(max-width: 640px) 144px, 176px"
                  loading="lazy"
                  className="object-contain object-left brightness-0 invert"
                />
              </div>
            </Link>

            <p className="text-sm font-semibold text-[#FAB31F] tracking-wide">
              Tudo para o seu pet pertinho de você.
            </p>

            <p className="text-sm text-white/70 leading-relaxed max-w-sm">
              Tudo para cuidar melhor de quem faz parte da família. Alimentos
              selecionados, higiene e acessórios com atendimento próximo e
              entrega dedicada em Barcarena e região.
            </p>

            <div className="flex items-center gap-2 text-sm font-medium text-white/80 pt-1">
              <MapPin className="w-4 h-4 text-[#FAB31F] shrink-0" aria-hidden="true" />
              <span>Barcarena — Pará, Brasil</span>
            </div>
          </div>

          {/* Categorias */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-[#FAB31F] tracking-widest">
              Categorias
            </h3>
            <ul className="space-y-2.5 text-sm text-white/70" aria-label="Links rápidos de categorias">
              {[
                { label: "Cães", href: "/categoria/caes" },
                { label: "Gatos", href: "/categoria/gatos" },
                { label: "Alimentação", href: "/categoria/alimentacao" },
                { label: "Higiene e cuidados", href: "/categoria/higiene" },
                { label: "Acessórios", href: "/categoria/acessorios" },
              ].map(({ label, href }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="hover:text-white transition-colors duration-150 py-0.5 inline-block focus-visible:outline-2 focus-visible:outline-[#FAB31F] rounded"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Navegação */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-[#FAB31F] tracking-widest">
              Navegação
            </h3>
            <ul className="space-y-2.5 text-sm text-white/70" aria-label="Navegação institucional">
              <li>
                <Link
                  href="/"
                  className="hover:text-white transition-colors duration-150 py-0.5 inline-block focus-visible:outline-2 focus-visible:outline-[#FAB31F] rounded"
                >
                  Início
                </Link>
              </li>
              <li>
                <Link
                  href="/#categorias"
                  className="hover:text-white transition-colors duration-150 py-0.5 inline-block focus-visible:outline-2 focus-visible:outline-[#FAB31F] rounded"
                >
                  Categorias em Destaque
                </Link>
              </li>
              <li>
                <Link
                  href="/#produtos"
                  className="hover:text-white transition-colors duration-150 py-0.5 inline-block focus-visible:outline-2 focus-visible:outline-[#FAB31F] rounded"
                >
                  Escolhas para o dia a dia
                </Link>
              </li>
              <li>
                <a
                  href={`https://wa.me/${cleanNumber}?text=${defaultMessage}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors duration-150 inline-flex items-center gap-1 py-0.5 focus-visible:outline-2 focus-visible:outline-[#FAB31F] rounded"
                >
                  <span>Atendimento ao Tutor</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-[#FAB31F]" aria-hidden="true" />
                </a>
              </li>
            </ul>
          </div>

          {/* Atendimento */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-[#FAB31F] tracking-widest">
              Atendimento Barcarena
            </h3>

            <div className="space-y-3 text-sm text-white/70">
              <div className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-[#FAB31F] shrink-0 mt-0.5" aria-hidden="true" />
                <span>Segunda a Sábado, das 08h às 18h</span>
              </div>
              <div className="flex items-start gap-2.5">
                <Phone className="w-4 h-4 text-[#FAB31F] shrink-0 mt-0.5" aria-hidden="true" />
                <span>Estoque confirmado via WhatsApp</span>
              </div>
            </div>

            <div className="pt-1">
              <a
                href={`https://wa.me/${cleanNumber}?text=${defaultMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-[#FAB31F] text-[#08422E] text-sm font-bold hover:bg-[#FAB31F]/90 active:scale-95 transition min-h-[44px] focus-visible:outline-2 focus-visible:outline-white shadow-md"
              >
                <MessageCircle className="w-4 h-4" aria-hidden="true" />
                <span>Falar no WhatsApp</span>
              </a>
            </div>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/40">
          <p>© 2026 PETOU Store. Todos os direitos reservados. Barcarena — PA.</p>
          <p className="flex items-center gap-1.5 font-medium text-white/60">
            <span>Tudo para o seu pet pertinho de você</span>
            <Heart className="w-3.5 h-3.5 text-[#FAB31F] fill-[#FAB31F]" aria-hidden="true" />
          </p>
        </div>
      </div>
    </footer>
  );
}
