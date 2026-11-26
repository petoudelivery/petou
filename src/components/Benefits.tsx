import { Zap, MessageCircle, Truck, ShieldCheck } from "lucide-react";
import { BENEFITS } from "@/data/products";

export default function Benefits() {
  const getIcon = (name: string) => {
    switch (name) {
      case "zap":
        return <Zap className="w-6 h-6 text-petou-yellow" />;
      case "message-circle":
        return <MessageCircle className="w-6 h-6 text-petou-yellow" />;
      case "truck":
        return <Truck className="w-6 h-6 text-petou-yellow" />;
      case "shield-check":
      default:
        return <ShieldCheck className="w-6 h-6 text-petou-yellow" />;
    }
  };

  return (
    <section id="vantagens" className="py-16 sm:py-20 bg-petou-green text-petou-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-petou-yellow">
            Por que comprar na Petou?
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-petou-white tracking-tight mt-1">
            Vantagens Feitas para Você e seu Pet
          </h2>
          <p className="text-sm sm:text-base text-petou-white/80 mt-2">
            Comodidade, segurança e atendimento próximo do início ao fim em Barcarena.
          </p>
        </div>

        {/* 4 Benefits Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {BENEFITS.map((b) => (
            <div
              key={b.id}
              className="bg-petou-white/5 backdrop-blur-md rounded-3xl p-6 border border-petou-white/10 hover:border-petou-yellow/40 hover:bg-petou-white/10 transition-all duration-300 flex flex-col"
            >
              <div className="w-12 h-12 rounded-2xl bg-petou-white/10 flex items-center justify-center mb-4">
                {getIcon(b.iconName)}
              </div>
              <h3 className="text-lg font-bold text-petou-white mb-2">
                {b.title}
              </h3>
              <p className="text-xs sm:text-sm text-petou-white/75 leading-relaxed">
                {b.description}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
