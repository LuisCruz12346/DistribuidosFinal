import { Header } from './Header';
import { User, Order } from '../App';
import { Package } from 'lucide-react';

type ProfileProps = {
  user: User | null;
  orders: Order[];
  onNavigate: (page: string) => void;
  onLogout: () => void;
  cartItemsCount: number;
};

export function Profile({ user, orders, onNavigate, onLogout, cartItemsCount }: ProfileProps) {
  if (!user) {
    onNavigate('login');
    return null;
  }

  return (
    <div className="min-h-screen bg-white">
      <Header
        user={user}
        onNavigate={onNavigate}
        onSearch={() => {}}
        cartItemsCount={cartItemsCount}
        onLogout={onLogout}
      />

      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="mb-8">Mi Perfil</h1>

        {/* Personal Information */}
        <div className="bg-gray-50 rounded-lg p-6 mb-6">
          <h2 className="mb-4">Información Personal</h2>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-600">Nombre</p>
              <p>{user.name} {user.lastName}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Correo electrónico</p>
              <p>{user.email}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Dirección</p>
              <p>{user.address}</p>
            </div>
          </div>
        </div>

        {/* Orders */}
        <div>
          <h2 className="mb-4">Pedidos Anteriores</h2>
          {orders.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <Package className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <p className="text-gray-600">No tienes pedidos anteriores</p>
              <button
                onClick={() => onNavigate('home')}
                className="mt-4 px-6 py-2 bg-black text-white rounded-full hover:bg-gray-800 transition-all text-center active:scale-95"
              >
                Ir de compras
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div key={order.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <p className="text-sm text-gray-600">Pedido #{order.id}</p>
                      <p className="text-sm text-gray-600">{order.date}</p>
                    </div>
                    <p>${order.total.toLocaleString()}</p>
                  </div>
                  <div className="space-y-2">
                    {order.products.map((item) => (
                      <div key={item.id} className="flex items-center gap-3">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded"
                        />
                        <div className="flex-1">
                          <p className="text-sm">{item.name}</p>
                          <p className="text-sm text-gray-600">Cantidad: {item.quantity}</p>
                        </div>
                        <p className="text-sm">${(item.price * item.quantity).toLocaleString()}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
