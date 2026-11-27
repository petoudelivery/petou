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
  const [liveMessage, setLiveMessage] = useState("");

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

  // WCAG 2.2: Esc key closes CartDrawer
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isCartOpen) {
        closeCart();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isCartOpen, closeCart]);

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

  const handleUpdateQty = (productId: string, productName: string, delta: number) => {
    updateQuantity(productId, delta);
    setLiveMessage(`Quantidade de ${productName} alterada.`);
  };

  const handleRemove = (productId: string, productName: string) => {
    removeFromCart(productId);
    setLiveMessage(`${productName} removido do carrinho.`);
  };

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Validations
    if (items.length === 0) {
      const msg = "Seu carrinho está vazio. Adicione produtos para continuar.";
      setErrorMessage(msg);
      setLiveMessage(msg);
      return;
    }

    if (!fullName.trim() || fullName.trim().length < 3) {
      const msg = "Por favor, informe seu nome completo.";
      setErrorMessage(msg);
      setLiveMessage(msg);
      return;
    }

    if (!streetAddress.trim() || streetAddress.trim().length < 5) {
      const msg = "Por favor, informe seu endereço completo (rua, número e referência).";
      setErrorMessage(msg);
      setLiveMessage(msg);
      return;
    }

    if (!neighborhoodId) {
      const msg = "Selecione o seu bairro em Barcarena.";
      setErrorMessage(msg);
      setLiveMessage(msg);
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
      `🐾 *NOVO PEDIDO - Petou Store (Barcarena)*`,
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
      `⚠️ *Aviso de estoque:* Nenhum pagamento é realizado online antes da confirmação da disponibilidade dos itens pela equipe Petou.`,
      `\n_Olá! Gostaria de confirmar a disponibilidade e finalizar meu pedido para entrega em Barcarena._`,
    ].join("\n");

    const url = `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`;

    // Do NOT clear cart on failed navigation
    window.open(url, "_blank");
  };

  if (!isCartOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="cart-drawer-heading"
      className="fixed inset-0 z-50 overflow-hidden font-sans"
    >
      {/* Screen Reader Live Announcements */}
      <div role="status" aria-live="polite" className="sr-only">
        {liveMessage}
      </div>

      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#202C27]/50 backdrop-blur-sm transition-opacity"
        onClick={closeCart}
        aria-hidden="true"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-0 sm:pl-10">
        <div className="w-screen max-w-lg bg-[#FAF8F2] shadow-2xl flex flex-col border-l border-[#E8EFE5]">

          {/* Header */}
          <div className="p-5 sm:p-6 bg-[#FFFFFF] border-b border-[#E8EFE5] flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#174C3C] text-[#FAF8F2] flex items-center justify-center shadow-sm">
                <ShoppingBag className="w-5 h-5 text-[#F47C49]" aria-hidden="true" />
              </div>
              <div>
                <h2 id="cart-drawer-heading" className="text-lg font-black text-[#174C3C]">
                  Seu Carrinho Petou
                </h2>
                <p className="text-xs text-[#66716A]">
                  {totalCount} {totalCount === 1 ? "item selecionado" : "itens selecionados"}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={closeCart}
              className="p-2.5 rounded-xl text-[#202C27] hover:bg-[#E8EFE5] transition min-w-[44px] min-h-[44px] flex items-center justify-center focus-visible:outline-2 focus-visible:outline-[#174C3C]"
              aria-label="Fechar carrinho de compras (Esc)"
            >
              <X className="w-5 h-5" aria-hidden="true" />
            </button>
          </div>

          {/* Mandatory notice banner */}
          <div className="px-5 py-3 bg-[#E8EFE5] border-b border-[#78916D]/20 flex items-start gap-2.5 text-xs text-[#174C3C] shrink-0">
            <AlertCircle className="w-4 h-4 text-[#F47C49] shrink-0 mt-0.5" aria-hidden="true" />
            <p className="leading-snug">
              <strong>Importante:</strong> Nenhum pagamento é realizado online antes da confirmação do estoque pela equipe no atendimento via WhatsApp.
            </p>
          </div>

          {/* Scrollable Container */}
          <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">

            {/* Items List */}
            {items.length === 0 ? (
              <div className="py-12 flex flex-col items-center justify-center text-center text-[#66716A] space-y-3">
                <div className="w-16 h-16 rounded-full bg-[#E8EFE5] flex items-center justify-center text-3xl" aria-hidden="true">
                  🐾
                </div>
                <h3 className="text-base font-bold text-[#174C3C]">Seu carrinho está vazio</h3>
                <p className="text-xs text-[#66716A] max-w-xs leading-relaxed">
                  Explore nossas rações, petiscos e itens de higiene para montar o pedido do seu pet!
                </p>
                <button
                  type="button"
                  onClick={closeCart}
                  className="mt-3 px-6 py-3 rounded-full bg-[#174C3C] text-[#FFFFFF] font-bold text-xs hover:bg-[#174C3C]/90 transition shadow-sm min-h-[44px] focus-visible:outline-2 focus-visible:outline-[#174C3C]"
                >
                  Explorar catálogo
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center justify-between pb-1">
                  <span className="text-[11px] font-bold tracking-wider text-[#66716A]">
                    Itens no carrinho
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      clearCart();
                      setLiveMessage("O carrinho foi esvaziado.");
                    }}
                    className="text-[11px] text-[#F47C49] hover:underline font-bold p-1 rounded focus-visible:outline-2 focus-visible:outline-[#174C3C]"
                  >
                    Esvaziar carrinho
                  </button>
                </div>

                <ul className="space-y-3" aria-label="Lista de produtos no carrinho">
                  {items.map((item) => {
                    const lineTotal = item.product.price * item.quantity;
                    return (
                      <li
                        key={item.product.id}
                        className="p-3.5 rounded-2xl bg-[#FFFFFF] border border-[#E8EFE5] flex items-center gap-3.5 shadow-sm"
                      >
                        {/* Item Visual */}
                        <div
                          className="w-12 h-12 rounded-xl bg-[#FAF8F2] border border-[#E8EFE5] flex items-center justify-center text-2xl shrink-0"
                          aria-hidden="true"
                        >
                          {item.product.iconName === "dog-bowl" && "🍲"}
                          {item.product.iconName === "cat-bowl" && "🐟"}
                          {item.product.iconName === "bone" && "🦴"}
                          {item.product.iconName === "toy" && "🎾"}
                          {item.product.iconName === "shampoo" && "🧴"}
                          {item.product.iconName === "collar" && "🦮"}
                        </div>

                        {/* Item Info */}
                        <div className="flex-1 min-w-0">
                          <span className="text-[9px] font-bold tracking-wider text-[#78916D] bg-[#E8EFE5] px-1.5 py-0.5 rounded">
                            {item.product.brand} • {item.product.size}
                          </span>
                          <h4 className="text-xs sm:text-sm font-bold text-[#174C3C] truncate mt-0.5">
                            {item.product.name}
                          </h4>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-[11px] text-[#66716A]">
                              R$ {item.product.price.toFixed(2).replace(".", ",")} un.
                            </span>
                            <span className="text-[11px] font-black text-[#174C3C]">
                              R$ {lineTotal.toFixed(2).replace(".", ",")}
                            </span>
                          </div>
                        </div>

                        {/* Controls */}
                        <div className="flex items-center gap-1.5">
                          <div className="flex items-center bg-[#FAF8F2] rounded-xl border border-[#E8EFE5] p-0.5">
                            <button
                              type="button"
                              onClick={() => handleUpdateQty(item.product.id, item.product.name, -1)}
                              className="w-8 h-8 flex items-center justify-center text-[#174C3C] hover:bg-[#E8EFE5] rounded-lg transition focus-visible:outline-2 focus-visible:outline-[#174C3C]"
                              aria-label={`Diminuir quantidade de ${item.product.name}`}
                            >
                              <Minus className="w-3.5 h-3.5" aria-hidden="true" />
                            </button>
                            <span className="w-7 text-center text-xs font-bold text-[#174C3C]" aria-label={`Quantidade atual: ${item.quantity}`}>
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleUpdateQty(item.product.id, item.product.name, 1)}
                              className="w-8 h-8 flex items-center justify-center text-[#174C3C] hover:bg-[#E8EFE5] rounded-lg transition focus-visible:outline-2 focus-visible:outline-[#174C3C]"
                              aria-label={`Aumentar quantidade de ${item.product.name}`}
                            >
                              <Plus className="w-3.5 h-3.5" aria-hidden="true" />
                            </button>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleRemove(item.product.id, item.product.name)}
                            className="p-2 text-[#F47C49] hover:bg-[#F47C49]/10 rounded-lg transition min-w-[36px] min-h-[36px] flex items-center justify-center focus-visible:outline-2 focus-visible:outline-[#174C3C]"
                            aria-label={`Remover ${item.product.name} do carrinho`}
                          >
                            <Trash2 className="w-4 h-4" aria-hidden="true" />
                          </button>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}

            {/* Delivery & Payment Form */}
            {items.length > 0 && (
              <form onSubmit={handleCheckout} id="checkout-form" className="space-y-4 pt-2">

                {/* Section 1: Customer & Address */}
                <div className="space-y-3 p-4 rounded-2xl bg-[#FFFFFF] border border-[#E8EFE5] shadow-sm">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#174C3C]">
                    <MapPin className="w-4 h-4 text-[#F47C49]" aria-hidden="true" />
                    <span>Dados de Entrega em Barcarena</span>
                  </div>

                  {/* Full Name */}
                  <div>
                    <label htmlFor="checkout-full-name" className="block text-xs font-bold text-[#202C27] mb-1">
                      Nome completo <span className="text-[#F47C49]" aria-hidden="true">*</span>
                    </label>
                    <input
                      id="checkout-full-name"
                      type="text"
                      required
                      autoComplete="name"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Ex: Maria dos Santos"
                      className="w-full bg-[#FAF8F2] text-[#202C27] placeholder-[#66716A]/75 text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-[#E8EFE5] focus-visible:outline-2 focus-visible:outline-[#174C3C] min-h-[44px]"
                    />
                  </div>

                  {/* Street Address */}
                  <div>
                    <label htmlFor="checkout-street-address" className="block text-xs font-bold text-[#202C27] mb-1">
                      Endereço e número <span className="text-[#F47C49]" aria-hidden="true">*</span>
                    </label>
                    <input
                      id="checkout-street-address"
                      type="text"
                      required
                      autoComplete="street-address"
                      value={streetAddress}
                      onChange={(e) => setStreetAddress(e.target.value)}
                      placeholder="Ex: Av. Cônego Jerônimo Pimentel, 450 - próx. à praça"
                      className="w-full bg-[#FAF8F2] text-[#202C27] placeholder-[#66716A]/75 text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-[#E8EFE5] focus-visible:outline-2 focus-visible:outline-[#174C3C] min-h-[44px]"
                    />
                  </div>

                  {/* Neighborhood Select */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label htmlFor="checkout-neighborhood" className="text-xs font-bold text-[#202C27]">
                        Bairro em Barcarena <span className="text-[#F47C49]" aria-hidden="true">*</span>
                      </label>
                      <span className="text-[11px] text-[#66716A]">
                        {deliveryFee !== null ? (
                          <span className="text-[#174C3C] font-semibold">
                            Taxa: R$ {deliveryFee.toFixed(2).replace(".", ",")}
                          </span>
                        ) : (
                          <span className="text-[#F47C49] font-semibold">
                            Taxa a confirmar
                          </span>
                        )}
                      </span>
                    </div>
                    <select
                      id="checkout-neighborhood"
                      value={neighborhoodId}
                      onChange={(e) => setNeighborhoodId(e.target.value)}
                      className="w-full bg-[#FAF8F2] text-[#202C27] text-xs sm:text-sm px-3 py-2.5 rounded-xl border border-[#E8EFE5] focus-visible:outline-2 focus-visible:outline-[#174C3C] min-h-[44px]"
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
                <fieldset className="space-y-3 p-4 rounded-2xl bg-[#FFFFFF] border border-[#E8EFE5] shadow-sm">
                  <legend className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#174C3C] px-1">
                    <CreditCard className="w-4 h-4 text-[#F47C49]" aria-hidden="true" />
                    <span>Forma de Pagamento (na confirmação / entrega)</span>
                  </legend>

                  <div className="grid grid-cols-3 gap-2">
                    {/* Pix */}
                    <label
                      className={`cursor-pointer p-3 rounded-xl border flex flex-col items-center justify-center text-center gap-1.5 transition min-h-[64px] focus-within:ring-2 focus-within:ring-[#174C3C] ${paymentMethod === "Pix"
                          ? "bg-[#174C3C] text-[#FFFFFF] border-[#174C3C] shadow-sm"
                          : "bg-[#FAF8F2] text-[#202C27] border-[#E8EFE5] hover:border-[#78916D]"
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
                      <QrCode className="w-5 h-5" aria-hidden="true" />
                      <span className="text-xs font-bold">Pix</span>
                    </label>

                    {/* Dinheiro */}
                    <label
                      className={`cursor-pointer p-3 rounded-xl border flex flex-col items-center justify-center text-center gap-1.5 transition min-h-[64px] focus-within:ring-2 focus-within:ring-[#174C3C] ${paymentMethod === "Dinheiro"
                          ? "bg-[#174C3C] text-[#FFFFFF] border-[#174C3C] shadow-sm"
                          : "bg-[#FAF8F2] text-[#202C27] border-[#E8EFE5] hover:border-[#78916D]"
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
                      <Banknote className="w-5 h-5" aria-hidden="true" />
                      <span className="text-xs font-bold">Dinheiro</span>
                    </label>

                    {/* Cartão */}
                    <label
                      className={`cursor-pointer p-3 rounded-xl border flex flex-col items-center justify-center text-center gap-1.5 transition min-h-[64px] focus-within:ring-2 focus-within:ring-[#174C3C] ${paymentMethod === "Cartão"
                          ? "bg-[#174C3C] text-[#FFFFFF] border-[#174C3C] shadow-sm"
                          : "bg-[#FAF8F2] text-[#202C27] border-[#E8EFE5] hover:border-[#78916D]"
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
                      <CreditCard className="w-5 h-5" aria-hidden="true" />
                      <span className="text-xs font-bold">Cartão</span>
                    </label>
                  </div>

                  {/* Cash Change field if Dinheiro is selected */}
                  {paymentMethod === "Dinheiro" && (
                    <div className="pt-2">
                      <label htmlFor="checkout-cash-change" className="block text-xs font-bold text-[#202C27] mb-1">
                        Precisa de troco para quanto? (opcional)
                      </label>
                      <input
                        id="checkout-cash-change"
                        type="text"
                        value={cashChange}
                        onChange={(e) => setCashChange(e.target.value)}
                        placeholder="Ex: Troco para R$ 100,00 ou Não preciso"
                        className="w-full bg-[#FAF8F2] text-[#202C27] placeholder-[#66716A]/75 text-xs px-3 py-2.5 rounded-xl border border-[#E8EFE5] focus-visible:outline-2 focus-visible:outline-[#174C3C] min-h-[44px]"
                      />
                    </div>
                  )}

                  <div className="flex items-center gap-2 pt-1 text-[11px] text-[#66716A]">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#78916D] shrink-0" aria-hidden="true" />
                    <span>Pagamento via Pix na confirmação ou maquineta/dinheiro na entrega.</span>
                  </div>
                </fieldset>

                {/* Validation Error Banner with role="alert" */}
                {errorMessage && (
                  <div
                    role="alert"
                    aria-live="assertive"
                    className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-center gap-2"
                  >
                    <AlertCircle className="w-4 h-4 shrink-0 text-red-600" aria-hidden="true" />
                    <span className="font-semibold">{errorMessage}</span>
                  </div>
                )}
              </form>
            )}

          </div>

          {/* Sticky Drawer Footer with Totals and Submit */}
          {items.length > 0 && (
            <div className="p-5 sm:p-6 bg-[#FFFFFF] border-t border-[#E8EFE5] shrink-0 space-y-3.5">

              {/* Financial Breakdown */}
              <div className="space-y-1.5 text-xs text-[#202C27]">
                <div className="flex justify-between">
                  <span className="text-[#66716A]">Subtotal dos produtos</span>
                  <span className="font-bold">
                    R$ {subtotal.toFixed(2).replace(".", ",")}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-[#66716A] flex items-center gap-1">
                    <Truck className="w-3.5 h-3.5 text-[#F47C49]" aria-hidden="true" />
                    Taxa ({selectedNeighborhood.name})
                  </span>
                  <span className="font-bold">
                    {deliveryFee !== null ? (
                      `R$ ${deliveryFee.toFixed(2).replace(".", ",")}`
                    ) : (
                      <span className="text-[#F47C49] text-[11px] italic">A confirmar</span>
                    )}
                  </span>
                </div>

                <div className="pt-2 border-t border-[#E8EFE5] flex justify-between items-baseline">
                  <span className="text-sm font-bold text-[#174C3C]">Total Estimado</span>
                  <div className="text-right">
                    <span className="text-xl font-black text-[#174C3C]">
                      R$ {total.toFixed(2).replace(".", ",")}
                    </span>
                    {deliveryFee === null && (
                      <span className="block text-[10px] text-[#F47C49] italic">
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
                className="w-full inline-flex items-center justify-center gap-2.5 py-4 px-6 rounded-full bg-[#174C3C] text-[#FFFFFF] font-bold text-sm hover:bg-[#174C3C]/90 active:scale-95 transition-all shadow-lg shadow-[#174C3C]/20 min-h-[48px] focus-visible:outline-2 focus-visible:outline-[#174C3C]"
              >
                <MessageCircle className="w-5 h-5 text-[#F47C49]" aria-hidden="true" />
                <span>Enviar pedido pelo WhatsApp</span>
              </button>

              <p className="text-[10px] text-center text-[#66716A]">
                Ao clicar, o WhatsApp abrirá com o pedido formatado sem perder os itens do carrinho.
              </p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
