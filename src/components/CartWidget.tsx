import { useState } from 'preact/hooks';
import { useStore } from '@nanostores/preact';
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
  const [abierto, setAbierto] = useState(false);

  const total = cartTotal(items);
  const count = cartCount(items);

  const pedirPorWhatsApp = () => {
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

  return (
    <div class="Cart-widget">
      <button
        class="Cart-trigger"
        aria-label="Abrir carrito de compras"
        onClick={() => setAbierto(true)}
      >
        <img src="/Assets/shopping_icon.svg" alt="" width="24" height="24" />
        {count > 0 && <span class="Cart-badge">{count}</span>}
      </button>

      {abierto && (
        <>
          <div class="Cart-overlay" onClick={() => setAbierto(false)} />
          <aside class="Cart-panel" role="dialog" aria-label="Carrito de compras">
            <header class="Cart-panel-header">
              <h2>Tu carrito</h2>
              <button
                class="Cart-close"
                aria-label="Cerrar carrito"
                onClick={() => setAbierto(false)}
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
                          🗑
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
        </>
      )}
    </div>
  );
}
