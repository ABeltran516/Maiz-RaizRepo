import { useState } from 'preact/hooks';
import { track } from '@vercel/analytics';
import { addItem } from '../stores/cart';
import { showToast } from '../stores/toast';

interface Props {
  id: string;
  nombre: string;
  precio: number;
}

export default function AddToCartButton({ id, nombre, precio }: Props) {
  const [qty, setQty] = useState(1);
  const [agregado, setAgregado] = useState(false);
  const [swapping, setSwapping] = useState(false);

  const dec = () => setQty((q) => Math.max(1, q - 1));
  const inc = () => setQty((q) => Math.min(99, q + 1));

  const total = precio * qty;

  const handleClick = () => {
    addItem({ id, nombre, precio }, qty);
    track('agregar_carrito', { producto: nombre, cantidad: qty, origen: 'detalle' });
    showToast(`${qty > 1 ? qty + '× ' : ''}${nombre} agregado`);
    // Blur breve que enmascara el swap de texto.
    setSwapping(true);
    setAgregado(true);
    setTimeout(() => setSwapping(false), 180);
    setTimeout(() => setAgregado(false), 1500);
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

      <button class="Btn-color1 Product-detail-cta" onClick={handleClick}>
        <span class="Btn-label" data-swapping={swapping}>
          {agregado ? '✔ Agregado' : `Agregar al carrito · $${total} MXN`}
        </span>
      </button>
    </div>
  );
}
