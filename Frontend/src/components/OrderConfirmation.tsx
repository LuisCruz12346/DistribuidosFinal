import { useEffect } from 'react';
import { CheckCircle2 } from 'lucide-react';

type OrderConfirmationProps = {
  onNavigate: (page: string) => void;
};

export function OrderConfirmation({ onNavigate }: OrderConfirmationProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onNavigate('home');
    }, 3000);

    return () => clearTimeout(timer);
  }, [onNavigate]);

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="mb-6 flex justify-center">
          <CheckCircle2 className="h-24 w-24 text-green-500" />
        </div>
        <h1 className="mb-4">¡Pedido realizado!</h1>
        <p className="text-gray-600 mb-8">
          Tu pedido ha sido procesado exitosamente. Recibirás un correo de confirmación pronto.
        </p>
        <p className="text-sm text-gray-500">
          Serás redirigido al inicio en unos segundos...
        </p>
        <button
          onClick={() => onNavigate('home')}
          className="mt-6 px-8 py-3 bg-black text-white rounded-full hover:bg-gray-800 transition-all text-center active:scale-95"
        >
          Volver al inicio
        </button>
      </div>
    </div>
  );
}
