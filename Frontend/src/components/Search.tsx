import { Header } from './Header';
import { Product, User } from '../App';
import { toast } from 'sonner@2.0.3';

type SearchProps = {
  user: User | null;
  searchQuery: Product[];
  searchTerm: string; // 🔹 nuevo
  onNavigate: (page: string) => void;
  onAddToCart: (product: Product) => void;
  onSearch: (query: string) => void;
  cartItemsCount: number;
  onLogout: () => void;
};

export function Search({ user, searchQuery,searchTerm, onNavigate, onAddToCart, onSearch, cartItemsCount, onLogout }: SearchProps) {
  const filteredProducts = searchQuery;

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

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="mb-2">Resultados de búsqueda</h1>
          <p className="text-gray-600">"{searchTerm}" ({filteredProducts.length} resultados)</p>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 mb-4">No se encontraron productos</p>
            <button
              onClick={() => onNavigate('home')}
              className="px-6 py-2 bg-black text-white rounded-full hover:bg-gray-800 transition-all text-center active:scale-95"
            >
              Volver al inicio
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
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
        )}
      </div>
    </div>
  );
}
