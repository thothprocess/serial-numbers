import { createLazyFileRoute } from '@tanstack/react-router';
import { SerialNumbers } from '@/components/serial-numbers/SerialNumbers';

export const Route = createLazyFileRoute('/')({
  component: () => (
    <div>
      <SerialNumbers />
    </div>
  ),
});
