import { useState, useEffect, useRef } from 'preact/hooks';
import { createPortal } from 'preact/compat';
import { useStore } from '@nanostores/preact';
import { track } from '@vercel/analytics';
import {
  cartItems,
  changeQty,
  removeItem,
  clearCart,
  cartCount,
  cartTotal,
} from '../stores/cart';
import { WHATSAPP_NUMBER, BRAND } from '../config';

export default function CartWidget() {
  const items = useStore(cartItems);
  const [mounted, setMounted] = useState(false); // presencia en el DOM
  const [open, setOpen] = useState(false); // estado visual (data-state)
  const [pop, setPop] = useState(false); // pop del contador al agregar
  const [hydrated, setHydrated] = useState(false); // evita mismatch SSR/cliente

  // El estado del carrito vive en localStorage (no existe en el servidor).
  // Solo mostramos datos dependientes del carrito tras montar en el cliente.
  useEffect(() => setHydrated(true), []);

  const total = cartTotal(items);
  const count = cartCount(items);

  // Pop del badge cuando el total de items aumenta (feedback aunque el drawer esté cerrado).
  const prevCount = useRef(count);
  useEffect(() => {
    if (count > prevCount.current) {
      setPop(true);
      const t = setTimeout(() => setPop(false), 200);
      prevCount.current = count;
      return () => clearTimeout(t);
    }
    prevCount.current = count;
  }, [count]);

  const openCart = () => {
    setMounted(true);
    // Doble rAF: garantiza que el panel pinte en estado cerrado antes de abrir,
    // para que la transición de entrada se dispare.
    requestAnimationFrame(() => requestAnimationFrame(() => setOpen(true)));
  };

  const closeCart = () => {
    setOpen(false);
    // Espera a que termine la animación de salida (220ms) antes de desmontar.
    setTimeout(() => setMounted(false), 240);
  };

  // Cerrar con la tecla Escape mientras el drawer está abierto.
  useEffect(() => {
    if (!mounted) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeCart();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [mounted]);

  const pedirPorWhatsApp = () => {
    track('click_comprar', { total, productos: count });
    const lineas = items.map(
      (i) => `• ${i.cantidad}x ${i.nombre} ($${i.precio * i.cantidad})`
    );
    const mensaje =
      `Hola ${BRAND}, quiero hacer este pedido:\n\n` +
      `${lineas.join('\n')}\n\n` +
      `Total: $${total} MXN`;
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(mensaje)}`;
    window.open(url, '_blank');
  };

  const state = open ? 'open' : 'closed';

  return (
    <div class="Cart-widget">
      <button
        class="Cart-buy"
        onClick={pedirPorWhatsApp}
        disabled={!hydrated || count === 0}
        aria-label="Finalizar compra por WhatsApp"
      >
        Comprar
      </button>
      <button
        class="Cart-trigger"
        aria-label="Abrir carrito de compras"
        onClick={openCart}
      >
        <svg
          width="22"
          height="22"
          viewBox="0 -960 960 960"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M200-80q-33 0-56.5-23.5T120-160v-480q0-33 23.5-56.5T200-720h80q0-83 58.5-141.5T480-920q83 0 141.5 58.5T680-720h80q33 0 56.5 23.5T840-640v480q0 33-23.5 56.5T760-80H200Zm0-80h560v-480h-80v80q0 17-11.5 28.5T640-520q-17 0-28.5-11.5T600-560v-80H360v80q0 17-11.5 28.5T320-520q-17 0-28.5-11.5T280-560v-80h-80v480Zm160-560h240q0-50-35-85t-85-35q-50 0-85 35t-35 85ZM200-160v-480 480Z" />
        </svg>
        {hydrated && count > 0 && (
          <span class="Cart-badge" data-pop={pop}>
            {count}
          </span>
        )}
      </button>

      {mounted &&
        createPortal(
          <>
            <div class="Cart-overlay" data-state={state} onClick={closeCart} />
          <aside
            class="Cart-panel"
            data-state={state}
            role="dialog"
            aria-label="Carrito de compras"
          >
            <header class="Cart-panel-header">
              <h2>Tu carrito</h2>
              <button
                class="Cart-close"
                aria-label="Cerrar carrito"
                onClick={closeCart}
              >
                ✕
              </button>
            </header>

            {items.length === 0 ? (
              <p class="Cart-empty">Tu carrito está vacío.</p>
            ) : (
              <>
                <ul class="Cart-list">
                  {items.map((i) => (
                    <li key={i.id} class="Cart-item">
                      <div class="Cart-item-info">
                        <span class="Cart-item-name">{i.nombre}</span>
                        <span class="Cart-item-price">${i.precio} MXN</span>
                      </div>
                      <div class="Cart-item-qty">
                        <button
                          aria-label={`Quitar uno de ${i.nombre}`}
                          onClick={() => changeQty(i.id, -1)}
                        >
                          −
                        </button>
                        <span>{i.cantidad}</span>
                        <button
                          aria-label={`Agregar uno de ${i.nombre}`}
                          onClick={() => changeQty(i.id, 1)}
                        >
                          +
                        </button>
                        <button
                          class="Cart-item-remove"
                          aria-label={`Eliminar ${i.nombre}`}
                          onClick={() => removeItem(i.id)}
                        >
                          Eliminar
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>

                <footer class="Cart-panel-footer">
                  <div class="Cart-total">
                    <span>Total</span>
                    <strong>${total} MXN</strong>
                  </div>
                  <button class="Btn-color1 Cart-checkout" onClick={pedirPorWhatsApp}>
                    Pedir por WhatsApp
                  </button>
                  <button class="Cart-clear" onClick={clearCart}>
                    Vaciar carrito
                  </button>
                </footer>
              </>
            )}
          </aside>
          </>,
          document.body
        )}
    </div>
  );
}
