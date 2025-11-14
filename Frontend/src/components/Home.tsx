import { Header } from './Header';
import { Product, User } from '../App';
import { toast } from 'sonner@2.0.3';

type HomeProps = {
  user: User | null;
  onNavigate: (page: string) => void;
  onAddToCart: (product: Product) => void;
  onSearch: (query: string) => void;
  cartItemsCount: number;
  onLogout: () => void;
};

const products: Product[] = [
  {
    id: '1',
    name: 'Audífonos Inalámbricos',
    price: 1299,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aXJlbGVzcyUyMGhlYWRwaG9uZXN8ZW58MXx8fHwxNzYyMzA0MTQ2fDA&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'Electrónica',
  },
  {
    id: '2',
    name: 'Reloj Moderno',
    price: 2499,
    image: 'https://images.unsplash.com/photo-1745256375848-1d599594635d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjB3YXRjaHxlbnwxfHx8fDE3NjIyNDY1ODN8MA&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'Accesorios',
  },
  {
    id: '3',
    name: 'Laptop Premium',
    price: 18999,
    image: 'https://images.unsplash.com/photo-1511385348-a52b4a160dc2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsYXB0b3AlMjBjb21wdXRlcnxlbnwxfHx8fDE3NjIyNTE0MDJ8MA&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'Electrónica',
  },
  {
    id: '4',
    name: 'Cafetera Moderna',
    price: 899,
    image: 'https://images.unsplash.com/photo-1608354580875-30bd4168b351?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2ZmZWUlMjBtYWtlcnxlbnwxfHx8fDE3NjIzMTQzMDZ8MA&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'Hogar',
  },
  {
    id: '5',
    name: 'Mochila Urbana',
    price: 799,
    image: 'https://images.unsplash.com/photo-1680039211156-66c721b87625?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYWNrcGFjayUyMGJhZ3xlbnwxfHx8fDE3NjIyMjU0NDJ8MA&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'Accesorios',
  },
  {
    id: '6',
    name: 'Lentes de Sol',
    price: 599,
    image: 'https://images.unsplash.com/photo-1663585703603-9be01a72a62a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdW5nbGFzc2VzJTIwZmFzaGlvbnxlbnwxfHx8fDE3NjIyMjc5NTF8MA&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'Accesorios',
  },
];

export function Home({ user, onNavigate, onAddToCart, onSearch, cartItemsCount, onLogout }: HomeProps) {
  const handleAddToCart = (product: Product) => {
    onAddToCart(product);
    toast.success('Producto agregado al carrito');
  };

  return (
    <div className="min-h-screen">
      <Header
        user={user}
        onNavigate={onNavigate}
        onSearch={onSearch}
        cartItemsCount={cartItemsCount}
        onLogout={onLogout}
      />

      {/* Hero Banner */}
      <div className="relative h-96 bg-gradient-to-r from-gray-900 to-gray-700">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white">
            <h1 className="mb-4">YA DISPONIBLE</h1>
            <p className="text-xl">Nuevos productos para ti</p>
          </div>
        </div>
      </div>

      {/* Products Section */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-8">
          <h2>Nuevos lanzamientos ({products.length})</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {products.map((product) => (
            <div key={product.id} className="group cursor-pointer">
              <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden mb-4">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
              </div>
              <div className="space-y-2">
                <p className="text-sm text-gray-600">{product.category}</p>
                <h3>{product.name}</h3>
                <p>${product.price.toLocaleString()}</p>
                <button
                  onClick={() => handleAddToCart(product)}
                  className="w-full bg-black text-white py-2 rounded-full hover:bg-gray-800 transition-all text-center active:scale-95"
                >
                  Agregar al carrito
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
