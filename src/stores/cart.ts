import { persistentAtom } from '@nanostores/persistent';

export interface CartItem {
  id: string;
  nombre: string;
  precio: number;
  cantidad: number;
}

// Estado del carrito persistido en localStorage. Compartido entre todas las islas
// (el contador del navbar y los botones "Agregar al carrito").
export const cartItems = persistentAtom<CartItem[]>('maizraiz-cart', [], {
  encode: JSON.stringify,
  decode: JSON.parse,
});

export function addItem(item: Omit<CartItem, 'cantidad'>) {
  const items = cartItems.get();
  const existente = items.find((i) => i.id === item.id);
  if (existente) {
    cartItems.set(
      items.map((i) =>
        i.id === item.id ? { ...i, cantidad: i.cantidad + 1 } : i
      )
    );
  } else {
    cartItems.set([...items, { ...item, cantidad: 1 }]);
  }
}

export function removeItem(id: string) {
  cartItems.set(cartItems.get().filter((i) => i.id !== id));
}

export function changeQty(id: string, delta: number) {
  cartItems.set(
    cartItems
      .get()
      .map((i) => (i.id === id ? { ...i, cantidad: i.cantidad + delta } : i))
      .filter((i) => i.cantidad > 0)
  );
}

export function clearCart() {
  cartItems.set([]);
}

export function cartCount(items: CartItem[]) {
  return items.reduce((acc, i) => acc + i.cantidad, 0);
}

export function cartTotal(items: CartItem[]) {
  return items.reduce((acc, i) => acc + i.precio * i.cantidad, 0);
}
