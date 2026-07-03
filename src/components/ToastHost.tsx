import { useEffect } from 'preact/hooks';
import { useStore } from '@nanostores/preact';
import { toast } from '../stores/toast';

export default function ToastHost() {
  const current = useStore(toast);

  useEffect(() => {
    if (!current) return;
    const t = setTimeout(() => toast.set(null), 2400);
    return () => clearTimeout(t);
  }, [current?.id]);

  if (!current) return null;

  return (
    <div class="Toast-host" aria-live="polite">
      <div class="Toast" key={current.id}>
        <span class="Toast-check">✔</span>
        {current.message}
      </div>
    </div>
  );
}
