"use client";

import { useState } from "react";
import { MessageCircle, Send } from "lucide-react";

export default function NewsletterWhatsApp() {
  const [phone, setPhone] = useState("");
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "5591980762149";
  const cleanNumber = whatsappNumber.replace(/\D/g, "");

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    const text = encodeURIComponent(
      `Olá, Petou Store! Gostaria de receber novidades e tirar dúvidas sobre entregas em Barcarena. Meu contato é: ${phone}`
    );
    window.open(`https://wa.me/${cleanNumber}?text=${text}`, "_blank");
  };

  return (
    <section className="py-12 bg-petou-cream border-t border-petou-green/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-petou-white rounded-3xl p-8 sm:p-10 border border-petou-green/10 shadow-sm flex flex-col lg:flex-row items-center justify-between gap-8">
          
          {/* Info */}
          <div className="flex items-center gap-4 text-center lg:text-left">
            <div className="w-14 h-14 rounded-2xl bg-petou-green text-petou-yellow flex items-center justify-center shrink-0 hidden sm:flex">
              <MessageCircle className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-xl sm:text-2xl font-black text-petou-green">
                Atendimento Rápido no WhatsApp
              </h3>
              <p className="text-xs sm:text-sm text-petou-green/75 mt-1 max-w-lg">
                Fale com a nossa equipe em Barcarena para checar lotes, sabores disponíveis e agendar sua entrega.
              </p>
            </div>
          </div>

          {/* Form */}
          <form
            onSubmit={handleSend}
            className="w-full lg:w-auto flex-1 max-w-md flex flex-col sm:flex-row gap-3"
          >
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Digite seu nome ou telefone..."
              className="flex-1 bg-petou-cream/50 text-petou-green placeholder-petou-green/50 text-sm px-4 py-3 rounded-2xl border border-petou-green/20 focus:outline-none focus:ring-2 focus:ring-petou-yellow"
            />
            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-petou-green text-petou-white font-bold text-sm hover:bg-petou-green/90 transition shadow-md whitespace-nowrap"
            >
              <span>Conversar</span>
              <Send className="w-4 h-4 text-petou-yellow" />
            </button>
          </form>

        </div>
      </div>
    </section>
  );
}
