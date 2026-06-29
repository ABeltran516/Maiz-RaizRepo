import { useState } from 'preact/hooks';
import { addItem } from '../stores/cart';

interface Props {
  id: string;
  nombre: string;
  precio: number;
}

export default function AddToCartButton({ id, nombre, precio }: Props) {
  const [agregado, setAgregado] = useState(false);

  const handleClick = () => {
    addItem({ id, nombre, precio });
    setAgregado(true);
    setTimeout(() => setAgregado(false), 1500);
  };

  return (
    <button class="Btn-color1 Product-detail-cta" onClick={handleClick}>
      {agregado ? '✔ Agregado' : 'Agregar al carrito'}
    </button>
  );
}
