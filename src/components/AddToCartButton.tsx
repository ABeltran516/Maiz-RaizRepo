import { useState } from 'preact/hooks';
import { track } from '@vercel/analytics';
import { addItem } from '../stores/cart';

interface Props {
  id: string;
  nombre: string;
  precio: number;
}

type EstadoBoton = 'idle' | 'success';

export default function AddToCartButton({ id, nombre, precio }: Props) {
  const [qty, setQty] = useState(1);
  const [estado, setEstado] = useState<EstadoBoton>('idle');

  const dec = () => setQty((q) => Math.max(1, q - 1));
  const inc = () => setQty((q) => Math.min(99, q + 1));

  const total = precio * qty;

  const handleClick = () => {
    addItem({ id, nombre, precio }, qty);
    track('agregar_carrito', { producto: nombre, cantidad: qty, origen: 'detalle' });

    setEstado('success');
    setTimeout(() => setEstado('idle'), 1600);
  };

  return (
    <div class="Add-to-cart">
      <div class="Qty-stepper">
        <button
          type="button"
          class="Qty-btn"
          aria-label="Quitar una unidad"
          onClick={dec}
          disabled={qty <= 1}
        >
          −
        </button>
        <span class="Qty-value" aria-live="polite">
          {qty}
        </span>
        <button
          type="button"
          class="Qty-btn"
          aria-label="Agregar una unidad"
          onClick={inc}
        >
          +
        </button>
      </div>

      <div class="Buy-wrap">
        {estado === 'success' && (
          <span class="Fly-badge" aria-hidden="true">
            +{qty}
          </span>
        )}

        <button
          class="Btn-color1 Product-detail-cta Buy-btn"
          onClick={handleClick}
          disabled={estado !== 'idle'}
          data-success={estado === 'success'}
        >
          <span class="Buy-layer" data-active={estado === 'idle'}>
            <svg
              class="Buy-icon"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              aria-hidden="true"
            >
              <circle cx="9" cy="21" r="1" />
              <circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
            </svg>
            Agregar · ${total} MXN
          </span>
          <span class="Buy-layer" data-active={estado === 'success'}>
            <svg class="Buy-check" width="17" height="17" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M4 12l5 5 11-11" />
            </svg>
            Agregado
          </span>
        </button>
      </div>
    </div>
  );
}
