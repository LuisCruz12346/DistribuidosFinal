import { useEffect, useState } from "react";
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

export function Home({ user, onNavigate, onAddToCart, onSearch, cartItemsCount, onLogout }: HomeProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const fetchProducts = async (query: string) => {
    try {
      const response = await fetch("/api/productos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });

      if (!response.ok) {
        throw new Error(`Error del servidor: ${response.status}`);
      }

      const data: Product[] = await response.json();
      setProducts(data); // Guardar productos en estado
      console.log("Productos encontrados:", data);

    } catch (error) {
      console.error("Error al obtener productos:", error);
    }
  };

  // Ejecutar al cargar la página
  useEffect(() => {
    fetchProducts("a");
  }, []);
    
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
