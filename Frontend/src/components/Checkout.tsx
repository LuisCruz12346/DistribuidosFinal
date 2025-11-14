import { useState } from 'react';
import { Header } from './Header';
import { CartItem, User, Order } from '../App';
import { toast } from 'sonner@2.0.3';

type CheckoutProps = {
  user: User | null;
  cart: CartItem[];
  onNavigate: (page: string) => void;
  onOrderComplete: (order: Order) => void;
  onLogout: () => void;
};

const SHIPPING_COST = 150;

export function Checkout({ user, cart, onNavigate, onOrderComplete, onLogout }: CheckoutProps) {
  const [cardData, setCardData] = useState({
    number: '',
    name: '',
    expiry: '',
    cvv: '',
  });

  if (!user) {
    onNavigate('login');
    return null;
  }

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const total = subtotal + SHIPPING_COST;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!cardData.number || !cardData.name || !cardData.expiry || !cardData.cvv) {
      toast.error('Por favor completa todos los campos');
      return;
    }

    // Simular procesamiento de pago
    const order: Order = {
      id: Date.now().toString(),
      date: new Date().toLocaleDateString('es-MX', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
      products: cart,
      total,
    };

    onOrderComplete(order);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    const name = e.target.name;

    // Formatear número de tarjeta
    if (name === 'number') {
      value = value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim();
      if (value.length > 19) return;
    }

    // Formatear fecha de expiración
    if (name === 'expiry') {
      value = value.replace(/\D/g, '');
      if (value.length >= 2) {
        value = value.slice(0, 2) + '/' + value.slice(2, 4);
      }
      if (value.length > 5) return;
    }

    // Limitar CVV a 3 dígitos
    if (name === 'cvv' && value.length > 3) return;

    setCardData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="min-h-screen bg-white">
      <Header
        user={user}
        onNavigate={onNavigate}
        onSearch={() => {}}
        cartItemsCount={cart.reduce((sum, item) => sum + item.quantity, 0)}
        onLogout={onLogout}
      />

      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="mb-8">Finalizar Compra</h1>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            {/* Dirección de envío */}
            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <h2 className="mb-4">Dirección de envío</h2>
              <p>{user.name} {user.lastName}</p>
              <p className="text-gray-600">{user.address}</p>
              <p className="text-gray-600">{user.email}</p>
            </div>

            {/* Información de pago */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h2 className="mb-4">Información de pago</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="number" className="block text-sm text-gray-600 mb-2">
                    Número de tarjeta
                  </label>
                  <input
                    id="number"
                    name="number"
                    type="text"
                    value={cardData.number}
                    onChange={handleChange}
                    placeholder="1234 5678 9012 3456"
                    className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="name" className="block text-sm text-gray-600 mb-2">
                    Nombre en la tarjeta
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={cardData.name}
                    onChange={handleChange}
                    placeholder="Juan Pérez"
                    className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="expiry" className="block text-sm text-gray-600 mb-2">
                      Fecha de expiración
                    </label>
                    <input
                      id="expiry"
                      name="expiry"
                      type="text"
                      value={cardData.expiry}
                      onChange={handleChange}
                      placeholder="MM/AA"
                      className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="cvv" className="block text-sm text-gray-600 mb-2">
                      CVV
                    </label>
                    <input
                      id="cvv"
                      name="cvv"
                      type="text"
                      value={cardData.cvv}
                      onChange={handleChange}
                      placeholder="123"
                      className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-black text-white py-3 rounded-full hover:bg-gray-800 transition-all text-center active:scale-95"
                >
                  Pagar ${total.toLocaleString()}
                </button>
              </form>
            </div>
          </div>

          {/* Resumen del pedido */}
          <div className="bg-gray-50 rounded-lg p-6 h-fit">
            <h2 className="mb-4">Resumen del pedido</h2>
            <div className="space-y-3 mb-4">
              {cart.map((item) => (
                <div key={item.id} className="flex gap-3">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div className="flex-1">
                    <p className="text-sm">{item.name}</p>
                    <p className="text-sm text-gray-600">x{item.quantity}</p>
                  </div>
                  <p className="text-sm">${(item.price * item.quantity).toLocaleString()}</p>
                </div>
              ))}
            </div>
            <div className="border-t pt-3 space-y-2">
              <div className="flex justify-between text-sm">
                <p className="text-gray-600">Subtotal</p>
                <p>${subtotal.toLocaleString()}</p>
              </div>
              <div className="flex justify-between text-sm">
                <p className="text-gray-600">Envío</p>
                <p>${SHIPPING_COST.toLocaleString()}</p>
              </div>
              <div className="flex justify-between pt-2 border-t">
                <p>Total</p>
                <p>${total.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
