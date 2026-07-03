import { useState } from 'preact/hooks';
import { addItem } from '../stores/cart';
import { showToast } from '../stores/toast';

interface Props {
  id: string;
  nombre: string;
  precio: number;
}

export default function AddToCartButton({ id, nombre, precio }: Props) {
  const [agregado, setAgregado] = useState(false);
  const [swapping, setSwapping] = useState(false);

  const handleClick = () => {
    addItem({ id, nombre, precio });
    showToast(`${nombre} agregado`);
    // Blur breve que enmascara el swap de texto (dos estados no se ven "saltar").
    setSwapping(true);
    setAgregado(true);
    setTimeout(() => setSwapping(false), 180);
    setTimeout(() => setAgregado(false), 1500);
  };

  return (
    <button class="Btn-color1 Product-detail-cta" onClick={handleClick}>
      <span class="Btn-label" data-swapping={swapping}>
        {agregado ? '✔ Agregado' : 'Agregar al carrito'}
      </span>
    </button>
  );
}
