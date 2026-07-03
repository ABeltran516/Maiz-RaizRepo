import { atom } from 'nanostores';

export interface ToastState {
  id: number;
  message: string;
}

// Toast efímero, compartido entre islas (lo dispara "Agregar al carrito").
export const toast = atom<ToastState | null>(null);

export function showToast(message: string) {
  toast.set({ id: Date.now(), message });
}
