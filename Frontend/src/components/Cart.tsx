import { Header } from './Header';
import { CartItem, User } from '../App';
import { Trash2 } from 'lucide-react';

type CartProps = {
  user: User | null;
  cart: CartItem[];
  onNavigate: (page: string) => void;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveFromCart: (productId: string) => void;
  onLogout: () => void;
};

const SHIPPING_COST = 150;

export function Cart({ user, cart, onNavigate, onUpdateQuantity, onRemoveFromCart, onLogout }: CartProps) {
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const total = subtotal + SHIPPING_COST;
  console.log("Soy el carrito")
  console.log(cart); 

  const handleCheckout = () => {
    if (!user) {
      onNavigate('login');
      return;
    }
    onNavigate('checkout');
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
        <h1 className="mb-8">Carrito de Compras</h1>

        {cart.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 mb-4">Tu carrito está vacío</p>
            <button
              onClick={() => onNavigate('home')}
              className="px-6 py-2 bg-black text-white rounded-full hover:bg-gray-800 transition-all text-center active:scale-95"
            >
              Ir de compras
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-4">
              {cart.map((item) => (
                <div key={item.id} className="flex gap-4 p-4 border rounded-lg">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-24 h-24 object-cover rounded"
                  />
                  <div className="flex-1">
                    <h3 className="mb-2">{item.name}</h3>
                    <p className="text-gray-600 mb-2">${item.price.toLocaleString()}</p>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onUpdateQuantity(item.id_carrito, item.quantity - 1)}
                        className="w-8 h-8 border rounded flex items-center justify-center hover:bg-gray-100"
                      >
                        -
                      </button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <button
                        onClick={() => onUpdateQuantity(item.id_carrito, item.quantity + 1)}
                        className="w-8 h-8 border rounded flex items-center justify-center hover:bg-gray-100"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <div className="flex flex-col items-end justify-between">
                    <button
                      onClick={() => onRemoveFromCart(item.id_carrito)}
                      className="text-gray-400 hover:text-red-500"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                    <p>${(item.price * item.quantity).toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-gray-50 rounded-lg p-6 h-fit">
              <h2 className="mb-4">Resumen</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <p className="text-gray-600">Subtotal</p>
                  <p>${subtotal.toLocaleString()}</p>
                </div>
                <div className="flex justify-between">
                  <p className="text-gray-600">Envío</p>
                  <p>${SHIPPING_COST.toLocaleString()}</p>
                </div>
                <div className="border-t pt-3">
                  <div className="flex justify-between">
                    <p>Total</p>
                    <p>${total.toLocaleString()}</p>
                  </div>
                </div>
              </div>
              <button
                onClick={handleCheckout}
                className="w-full mt-6 bg-black text-white py-3 rounded-full hover:bg-gray-800 transition-all text-center active:scale-95"
              >
                Pagar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
