import { useState } from 'preact/hooks';
import { addItem } from '../stores/cart';
import { showToast } from '../stores/toast';

interface Props {
  id: string;
  nombre: string;
  precio: number;
}

// Control compacto para agregar al carrito desde la grilla de productos,
// sin entrar a la página del producto.
export default function QuickAdd({ id, nombre, precio }: Props) {
  const [qty, setQty] = useState(1);

  const dec = () => setQty((q) => Math.max(1, q - 1));
  const inc = () => setQty((q) => Math.min(99, q + 1));

  const add = () => {
    addItem({ id, nombre, precio }, qty);
    showToast(`${qty > 1 ? qty + '× ' : ''}${nombre} agregado`);
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

      <button
        class="Btn-color1 Quick-add-btn"
        onClick={add}
        aria-label={`Agregar ${nombre} al carrito`}
      >
        <svg
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
        Agregar al carrito
      </button>
    </div>
  );
}
