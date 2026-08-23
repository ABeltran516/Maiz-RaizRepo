import { useState } from 'preact/hooks';
import { track } from '@vercel/analytics';
import { addItem } from '../stores/cart';

interface Props {
  id: string;
  nombre: string;
  precio: number;
  disponible?: boolean;
}

type EstadoBoton = 'idle' | 'success';

// Control compacto para agregar al carrito desde la grilla de productos,
// sin entrar a la página del producto. Comparte la animación de éxito
// (.Buy-*) con AddToCartButton — misma sensación en todo el sitio.
export default function QuickAdd({ id, nombre, precio, disponible = true }: Props) {
  const [qty, setQty] = useState(1);
  const [estado, setEstado] = useState<EstadoBoton>('idle');

  const dec = () => setQty((q) => Math.max(1, q - 1));
  const inc = () => setQty((q) => Math.min(99, q + 1));

  if (!disponible) {
    return (
      <div class="Quick-add">
        <span class="Quick-add-agotado">Agotado por ahora</span>
      </div>
    );
  }

  const add = () => {
    addItem({ id, nombre, precio }, qty);
    track('agregar_carrito', { producto: nombre, cantidad: qty, origen: 'grilla' });

    setEstado('success');
    setTimeout(() => setEstado('idle'), 1600);
    setQty(1);
  };

  return (
    <div class="Quick-add">
      <div class="Qty-stepper Qty-stepper--sm">
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
          class="Btn-color1 Quick-add-btn Buy-btn"
          onClick={add}
          disabled={estado !== 'idle'}
          data-success={estado === 'success'}
          aria-label={`Agregar ${nombre} al carrito`}
        >
          <span class="Buy-layer" data-active={estado === 'idle'}>
            <svg
              class="Buy-icon"
              width="18"
              height="18"
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
            Agregar
          </span>
          <span class="Buy-layer" data-active={estado === 'success'}>
            <svg class="Buy-check" width="15" height="15" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M4 12l5 5 11-11" />
            </svg>
            Agregado
          </span>
        </button>
      </div>
    </div>
  );
}
