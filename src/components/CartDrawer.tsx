"use client";

import { useState, useMemo, useEffect } from "react";
import {
  X,
  Plus,
  Minus,
  Trash2,
  ShoppingBag,
  MessageCircle,
  AlertCircle,
  CheckCircle2,
  MapPin,
  CreditCard,
  Banknote,
  QrCode,
  Truck,
  ShieldCheck,
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { BARCARENA_NEIGHBORHOODS } from "@/data/neighborhoods";
import { fetchDeliveryAreas, fetchWhatsAppNumber } from "@/lib/storeService";
import { PaymentMethod, Neighborhood } from "@/types/store";

export default function CartDrawer() {
  const {
    items,
    isCartOpen,
    closeCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    subtotal,
    totalCount,
  } = useCart();

  // Dynamic delivery areas and WhatsApp with demo fallback
  const [neighborhoods, setNeighborhoods] = useState<Neighborhood[]>(BARCARENA_NEIGHBORHOODS);
  const [targetWhatsApp, setTargetWhatsApp] = useState<string>(
    process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "5591980762149"
  );

  // Form State
  const [fullName, setFullName] = useState("");
  const [streetAddress, setStreetAddress] = useState("");
  const [neighborhoodId, setNeighborhoodId] = useState(BARCARENA_NEIGHBORHOODS[0].id);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("Pix");
  const [cashChange, setCashChange] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      const [areas, wa] = await Promise.all([
        fetchDeliveryAreas(),
        fetchWhatsAppNumber(),
      ]);
      setNeighborhoods(areas);
      setTargetWhatsApp(wa);
    }
    loadData();
  }, []);

  const cleanNumber = targetWhatsApp.replace(/\D/g, "");

  const selectedNeighborhood = useMemo(() => {
    return (
      neighborhoods.find((n) => n.id === neighborhoodId) ||
      neighborhoods[0] ||
      BARCARENA_NEIGHBORHOODS[0]
    );
  }, [neighborhoods, neighborhoodId]);

  const deliveryFee = selectedNeighborhood.fee;

  const total = useMemo(() => {
    if (deliveryFee !== null) {
      return subtotal + deliveryFee;
    }
    return subtotal;
  }, [subtotal, deliveryFee]);

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Validations
    if (items.length === 0) {
      setErrorMessage("Seu carrinho está vazio. Adicione produtos para continuar.");
      return;
    }

    if (!fullName.trim() || fullName.trim().length < 3) {
      setErrorMessage("Por favor, informe seu nome completo.");
      return;
    }

    if (!streetAddress.trim() || streetAddress.trim().length < 5) {
      setErrorMessage("Por favor, informe seu endereço completo (rua, número e referência).");
      return;
    }

    if (!neighborhoodId) {
      setErrorMessage("Selecione o seu bairro em Barcarena.");
      return;
    }

    // Format delivery fee text
    const deliveryFeeText =
      deliveryFee !== null
        ? `R$ ${deliveryFee.toFixed(2).replace(".", ",")}`
        : "A confirmar no atendimento";

    const totalText =
      deliveryFee !== null
        ? `R$ ${total.toFixed(2).replace(".", ",")}`
        : `R$ ${subtotal.toFixed(2).replace(".", ",")} (+ taxa de entrega a confirmar)`;

    // Format payment text
    let paymentText: string = paymentMethod;
    if (paymentMethod === "Dinheiro" && cashChange.trim()) {
      paymentText = `Dinheiro (Troco para: ${cashChange.trim()})`;
    } else if (paymentMethod === "Cartão") {
      paymentText = "Cartão (Débito/Crédito na entrega)";
    }

    // Format items list
    const itemsFormatted = items
      .map((item, index) => {
        const lineTotal = item.product.price * item.quantity;
        return `${index + 1}. *${item.product.name}*\n   Marca: ${item.product.brand} | Tam: ${item.product.size}\n   Qtd: ${item.quantity} x R$ ${item.product.price.toFixed(2).replace(".", ",")} un. = *R$ ${lineTotal.toFixed(2).replace(".", ",")}*`;
      })
      .join("\n\n");

    // Compose PT-BR WhatsApp Summary
    const message = [
      `🐾 *NOVO PEDIDO - PETOU STORE (BARCARENA)*`,
      `----------------------------------------------`,
      `👤 *Cliente:* ${fullName.trim()}`,
      `📍 *Endereço:* ${streetAddress.trim()}`,
      `🏘️ *Bairro:* ${selectedNeighborhood.name} (Barcarena - PA)`,
      `----------------------------------------------`,
      `🛒 *ITENS DO PEDIDO (${totalCount} ${totalCount === 1 ? "item" : "itens"}):*`,
      itemsFormatted,
      `----------------------------------------------`,
      `💵 *Subtotal dos produtos:* R$ ${subtotal.toFixed(2).replace(".", ",")}`,
      `🛵 *Taxa de entrega (Barcarena):* ${deliveryFeeText}`,
      `💰 *Total estimado:* ${totalText}`,
      `💳 *Forma de pagamento:* ${paymentText}`,
      `----------------------------------------------`,
      `⚠️ *Aviso de estoque:* Entendo que nenhum pagamento é realizado online antes da confirmação da disponibilidade dos itens pela equipe Petou.`,
      `\n_Olá! Gostaria de confirmar a disponibilidade e finalizar meu pedido para entrega em Barcarena._`,
    ].join("\n");

    const url = `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
  };

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-petou-green/40 backdrop-blur-sm transition-opacity"
        onClick={closeCart}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-6 sm:pl-10">
        <div className="w-screen max-w-lg bg-petou-white shadow-2xl flex flex-col">

          {/* Header */}
          <div className="p-5 sm:p-6 bg-petou-cream border-b border-petou-green/10 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-petou-green text-petou-white flex items-center justify-center shadow-sm">
                <ShoppingBag className="w-5 h-5 text-petou-yellow" />
              </div>
              <div>
                <h2 className="text-lg font-black text-petou-green">Seu Carrinho Petou</h2>
                <p className="text-xs text-petou-green/75">
                  {totalCount} {totalCount === 1 ? "produto selecionado" : "produtos selecionados"}
                </p>
              </div>
            </div>

            <button
              onClick={closeCart}
              className="p-2 rounded-xl text-petou-green hover:bg-petou-green/10 transition"
              aria-label="Fechar carrinho"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Mandatory notice banner: No online payment before stock confirmation */}
          <div className="px-5 py-3 bg-amber-50 border-b border-amber-200/70 flex items-start gap-2.5 text-xs text-amber-900 shrink-0">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <p className="leading-snug">
              <strong>Importante:</strong> Nenhum pagamento é realizado online antes da confirmação do estoque pela equipe no atendimento via WhatsApp.
            </p>
          </div>

          {/* Scrollable Container */}
          <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">

            {/* Items List */}
            {items.length === 0 ? (
              <div className="py-12 flex flex-col items-center justify-center text-center text-petou-green/60 space-y-3">
                <div className="w-16 h-16 rounded-full bg-petou-cream flex items-center justify-center">
                  <ShoppingBag className="w-8 h-8 text-petou-green/40" />
                </div>
                <h3 className="text-base font-bold text-petou-green">Carrinho Vazio</h3>
                <p className="text-xs text-petou-green/70 max-w-xs">
                  Adicione rações, petiscos e brinquedos para montar o pedido do seu pet!
                </p>
                <button
                  onClick={closeCart}
                  className="mt-3 px-5 py-2.5 rounded-xl bg-petou-green text-petou-white font-bold text-xs hover:opacity-90 transition"
                >
                  Explorar Loja
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center justify-between pb-1">
                  <span className="text-xs font-bold uppercase tracking-wider text-petou-green/70">
                    Itens no Carrinho
                  </span>
                  <button
                    onClick={clearCart}
                    className="text-[11px] text-red-500 hover:underline font-semibold"
                  >
                    Esvaziar carrinho
                  </button>
                </div>

                {items.map((item) => {
                  const lineTotal = item.product.price * item.quantity;
                  return (
                    <div
                      key={item.product.id}
                      className="p-3.5 rounded-2xl bg-petou-cream/40 border border-petou-green/10 flex items-center gap-3.5"
                    >
                      {/* Item Visual */}
                      <div className="w-12 h-12 rounded-xl bg-petou-white border border-petou-green/10 flex items-center justify-center text-2xl shrink-0">
                        {item.product.iconName === "dog-bowl" && "🍲"}
                        {item.product.iconName === "cat-bowl" && "🐟"}
                        {item.product.iconName === "bone" && "🦴"}
                        {item.product.iconName === "toy" && "🎾"}
                        {item.product.iconName === "shampoo" && "🧴"}
                        {item.product.iconName === "collar" && "🦮"}
                      </div>

                      {/* Item Info */}
                      <div className="flex-1 min-w-0">
                        <span className="text-[9px] font-bold uppercase tracking-wider text-petou-green/60 bg-petou-white px-1.5 py-0.5 rounded border border-petou-green/10">
                          {item.product.brand} • {item.product.size}
                        </span>
                        <h4 className="text-xs sm:text-sm font-bold text-petou-green truncate mt-0.5">
                          {item.product.name}
                        </h4>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[11px] text-petou-green/70">
                            R$ {item.product.price.toFixed(2).replace(".", ",")} un.
                          </span>
                          <span className="text-[11px] font-extrabold text-petou-green">
                            Total: R$ {lineTotal.toFixed(2).replace(".", ",")}
                          </span>
                        </div>
                      </div>

                      {/* Controls */}
                      <div className="flex items-center gap-1.5">
                        <div className="flex items-center bg-petou-white rounded-xl border border-petou-green/15 p-0.5">
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.product.id, -1)}
                            className="w-6 h-6 flex items-center justify-center text-petou-green hover:bg-petou-green/10 rounded-lg transition"
                            aria-label="Diminuir"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-6 text-center text-xs font-bold text-petou-green">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.product.id, 1)}
                            className="w-6 h-6 flex items-center justify-center text-petou-green hover:bg-petou-green/10 rounded-lg transition"
                            aria-label="Aumentar"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <button
                          type="button"
                          onClick={() => removeFromCart(item.product.id)}
                          className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition"
                          aria-label="Remover"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Delivery & Payment Form */}
            {items.length > 0 && (
              <form onSubmit={handleCheckout} id="checkout-form" className="space-y-5 pt-2">

                {/* Section 1: Customer & Address */}
                <div className="space-y-3.5 p-4 rounded-2xl bg-petou-cream/30 border border-petou-green/10">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-petou-green">
                    <MapPin className="w-4 h-4 text-petou-yellow" />
                    <span>Dados de Entrega em Barcarena</span>
                  </div>

                  {/* Full Name */}
                  <div>
                    <label className="block text-xs font-bold text-petou-green mb-1">
                      Nome completo <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Ex: Maria dos Santos"
                      className="w-full bg-petou-white text-petou-green placeholder-petou-green/45 text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-petou-green/20 focus:outline-none focus:ring-2 focus:ring-petou-yellow"
                    />
                  </div>

                  {/* Street Address */}
                  <div>
                    <label className="block text-xs font-bold text-petou-green mb-1">
                      Endereço e número <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={streetAddress}
                      onChange={(e) => setStreetAddress(e.target.value)}
                      placeholder="Ex: Av. Cônego Jerônimo Pimentel, 450 - próx. à praça"
                      className="w-full bg-petou-white text-petou-green placeholder-petou-green/45 text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-petou-green/20 focus:outline-none focus:ring-2 focus:ring-petou-yellow"
                    />
                  </div>

                  {/* Neighborhood Select */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs font-bold text-petou-green">
                        Bairro em Barcarena <span className="text-red-500">*</span>
                      </label>
                      <span className="text-[11px] text-petou-green/70">
                        {deliveryFee !== null ? (
                          <span className="text-petou-green font-semibold">
                            Taxa: R$ {deliveryFee.toFixed(2).replace(".", ",")}
                          </span>
                        ) : (
                          <span className="text-amber-700 font-semibold">
                            Taxa a confirmar
                          </span>
                        )}
                      </span>
                    </div>
                    <select
                      value={neighborhoodId}
                      onChange={(e) => setNeighborhoodId(e.target.value)}
                      className="w-full bg-petou-white text-petou-green text-xs sm:text-sm px-3 py-2.5 rounded-xl border border-petou-green/20 focus:outline-none focus:ring-2 focus:ring-petou-yellow"
                    >
                      {neighborhoods.map((n) => (
                        <option key={n.id} value={n.id}>
                          {n.name}{" "}
                          {n.fee !== null
                            ? `(+ R$ ${n.fee.toFixed(2).replace(".", ",")})`
                            : "(Taxa a confirmar)"}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Section 2: Payment Method */}
                <div className="space-y-3 p-4 rounded-2xl bg-petou-cream/30 border border-petou-green/10">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-petou-green">
                    <CreditCard className="w-4 h-4 text-petou-yellow" />
                    <span>Forma de Pagamento (na confirmação / entrega)</span>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    {/* Pix */}
                    <label
                      className={`cursor-pointer p-3 rounded-xl border flex flex-col items-center justify-center text-center gap-1.5 transition ${paymentMethod === "Pix"
                        ? "bg-petou-green text-petou-white border-petou-green shadow-sm"
                        : "bg-petou-white text-petou-green border-petou-green/20 hover:border-petou-green/40"
                        }`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="Pix"
                        checked={paymentMethod === "Pix"}
                        onChange={() => setPaymentMethod("Pix")}
                        className="sr-only"
                      />
                      <QrCode className="w-5 h-5" />
                      <span className="text-xs font-bold">Pix</span>
                    </label>

                    {/* Dinheiro */}
                    <label
                      className={`cursor-pointer p-3 rounded-xl border flex flex-col items-center justify-center text-center gap-1.5 transition ${paymentMethod === "Dinheiro"
                        ? "bg-petou-green text-petou-white border-petou-green shadow-sm"
                        : "bg-petou-white text-petou-green border-petou-green/20 hover:border-petou-green/40"
                        }`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="Dinheiro"
                        checked={paymentMethod === "Dinheiro"}
                        onChange={() => setPaymentMethod("Dinheiro")}
                        className="sr-only"
                      />
                      <Banknote className="w-5 h-5" />
                      <span className="text-xs font-bold">Dinheiro</span>
                    </label>

                    {/* Cartão */}
                    <label
                      className={`cursor-pointer p-3 rounded-xl border flex flex-col items-center justify-center text-center gap-1.5 transition ${paymentMethod === "Cartão"
                        ? "bg-petou-green text-petou-white border-petou-green shadow-sm"
                        : "bg-petou-white text-petou-green border-petou-green/20 hover:border-petou-green/40"
                        }`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="Cartão"
                        checked={paymentMethod === "Cartão"}
                        onChange={() => setPaymentMethod("Cartão")}
                        className="sr-only"
                      />
                      <CreditCard className="w-5 h-5" />
                      <span className="text-xs font-bold">Cartão</span>
                    </label>
                  </div>

                  {/* Cash Change field if Dinheiro is selected */}
                  {paymentMethod === "Dinheiro" && (
                    <div className="pt-2">
                      <label className="block text-xs font-bold text-petou-green mb-1">
                        Precisa de troco para quanto? (opcional)
                      </label>
                      <input
                        type="text"
                        value={cashChange}
                        onChange={(e) => setCashChange(e.target.value)}
                        placeholder="Ex: Troco para R$ 100,00 ou Não preciso"
                        className="w-full bg-petou-white text-petou-green placeholder-petou-green/45 text-xs px-3 py-2 rounded-xl border border-petou-green/20 focus:outline-none focus:ring-2 focus:ring-petou-yellow"
                      />
                    </div>
                  )}

                  <div className="flex items-center gap-2 pt-1 text-[11px] text-petou-green/70">
                    <ShieldCheck className="w-3.5 h-3.5 text-petou-yellow shrink-0" />
                    <span>Pagamento efetuado via Pix na confirmação ou maquineta/dinheiro na entrega.</span>
                  </div>
                </div>

                {/* Validation Error Banner */}
                {errorMessage && (
                  <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                )}
              </form>
            )}

          </div>

          {/* Sticky Drawer Footer with Totals and Submit */}
          {items.length > 0 && (
            <div className="p-5 sm:p-6 bg-petou-cream border-t border-petou-green/10 shrink-0 space-y-3.5">

              {/* Financial Breakdown */}
              <div className="space-y-1.5 text-xs text-petou-green">
                <div className="flex justify-between">
                  <span className="text-petou-green/75">Subtotal dos produtos</span>
                  <span className="font-bold">
                    R$ {subtotal.toFixed(2).replace(".", ",")}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-petou-green/75 flex items-center gap-1">
                    <Truck className="w-3.5 h-3.5 text-petou-yellow" />
                    Taxa ({selectedNeighborhood.name})
                  </span>
                  <span className="font-bold">
                    {deliveryFee !== null ? (
                      `R$ ${deliveryFee.toFixed(2).replace(".", ",")}`
                    ) : (
                      <span className="text-amber-800 text-[11px] italic">A confirmar</span>
                    )}
                  </span>
                </div>

                <div className="pt-2 border-t border-petou-green/10 flex justify-between items-baseline">
                  <span className="text-sm font-bold text-petou-green">Total Estimado</span>
                  <div className="text-right">
                    <span className="text-xl font-black text-petou-green">
                      R$ {total.toFixed(2).replace(".", ",")}
                    </span>
                    {deliveryFee === null && (
                      <span className="block text-[10px] text-amber-800 italic">
                        + entrega a confirmar
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                form="checkout-form"
                className="w-full inline-flex items-center justify-center gap-2.5 py-3.5 px-6 rounded-2xl bg-petou-green text-petou-white font-black text-sm hover:bg-petou-green/90 transition shadow-lg shadow-petou-green/20"
              >
                <MessageCircle className="w-5 h-5 text-petou-yellow" />
                <span>Enviar pedido pelo WhatsApp</span>
              </button>

              <p className="text-[10px] text-center text-petou-green/70">
                Ao clicar, o WhatsApp abrirá com o resumo detalhado pronto para envio.
              </p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
