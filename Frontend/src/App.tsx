import { useState, useEffect } from 'react';
import { Home } from './components/Home';
import { Login } from './components/Login';
import { Register } from './components/Register';
import { Profile } from './components/Profile';
import { Search } from './components/Search';
import { Cart } from './components/Cart';
import { Checkout } from './components/Checkout';
import { OrderConfirmation } from './components/OrderConfirmation';

export type Product = {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
};

export type CartItem = Product & { quantity: number };

export type User = {
  email: string;
  name: string;
  lastName: string;
  address: string;
  password: string;
};

export type Order = {
  id: string;
  date: string;
  products: CartItem[];
  total: number;
};

type Page = 'home' | 'login' | 'register' | 'profile' | 'search' | 'cart' | 'checkout' | 'confirmation';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [user, setUser] = useState<User | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Al iniciar, intenta recuperar el usuario
  useEffect(() => {
  const savedUser = localStorage.getItem('user');
  if (savedUser) {
    setUser(JSON.parse(savedUser));
  }
}, []);

// Si el usuario existe, carga su carrito PARCIALMENTE LISTO
useEffect(() => {
  const fetchCart = async () => {
    if (!user) return;

    try {
      const response = await fetch("http://localhost:5000/carrito", {
        method: "GET",
        credentials: "include", // enviar cookies de sesión
      });

      const data = await response.json();
      if (data.success) {
        setCart(data.cart);
        console.log("Carrito cargado:", data.cart);
      } else {
        console.warn(data.message);
      }
    } catch (error) {
      console.error("Error al obtener carrito:", error);
    }
  };

  fetchCart();
}, [user]);


// Guardar carrito cada vez que cambia
//useEffect(() => {
//  if (user) { // solo si hay usuario logueado
//    localStorage.setItem('cart', JSON.stringify(cart));
//  }
// }, [cart, user]);

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prev =>
      prev.map(item =>
        item.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
    localStorage.setItem('cart', JSON.stringify([]));
  };
// Inicio de sesion listo
  const login = async (email: string, password: string) => {
  try {
      const response = await fetch("http://localhost:5000/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({email, password }),
      credentials: "include", 
    });

    const data = await response.json();
    console.log("Respuesta del servidor:", data);

    if (!data.success) return false;

    setUser(data.user);
    localStorage.setItem("user", JSON.stringify(data.user));
    
    setCurrentPage("home");
    
    return true;

  } catch (error) {
    console.error(error);
    return false;
  }
};

// Salir de sesion LISTO
const logout = async () => {
  try {
    await fetch("http://localhost:5000/logout", {
      method: "GET",
      credentials: "include",   // <<< IMPORTANTE PARA BORRAR SESIÓN
    });

    setUser(null);
    setCart([]); // Esto limpia el carrito en memoria (estado de React)
    localStorage.removeItem("user");
    localStorage.removeItem('cart');
    setCurrentPage("home");

  } catch (error) {
    console.error("Error en logout:", error);
  }
};

// Registrarse Nuevo usuarios LISTO
const register = async (userData: User) => {
  try {
    const response = await fetch("http://localhost:5000/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",        // <<< Necesario si usas sesión
      body: JSON.stringify(userData)
    });

    const data = await response.json();
    console.log("Respuesta del servidor:", data);

    if (!data.success) {
      alert(data.message);
      return false;
    }

    // Si fue exitoso, guardamos usuario localmente
    //setUser(userData);
    //localStorage.setItem("user", JSON.stringify(userData));
    setCurrentPage("home");
    return true;

  } catch (error) {
    console.error("Error en register:", error);
    return false;
  }
};


const addOrder = (order: Order) => {
    if (!user) return;
    const orders = JSON.parse(localStorage.getItem(`orders_${user.email}`) || '[]');
    orders.push(order);
    localStorage.setItem(`orders_${user.email}`, JSON.stringify(orders));
  };

  const getOrders = (): Order[] => {
    if (!user) return [];
    return JSON.parse(localStorage.getItem(`orders_${user.email}`) || '[]');
  };

// Buscar productos en la base de datos LISTO
const handleSearch = async (query: string) => {
  try {
    const response = await fetch("http://localhost:5000/productos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query }), // Enviar el texto de búsqueda
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error(`Error del servidor: ${response.status}`);
    }

    const data = await response.json(); // Recibir productos en JSON
    console.log("Productos encontrados:", data);
    setSearchQuery(data); // Aquí data es un arreglo de productos
    setCurrentPage("search");

  } catch (error) {
    console.error("Error al buscar productos:", error);
  }
};


  return (
    <div className="min-h-screen bg-white">
      {currentPage === 'home' && (
        <Home
          user={user}
          onNavigate={setCurrentPage}
          onAddToCart={addToCart}
          onSearch={handleSearch}
          cartItemsCount={cart.reduce((sum, item) => sum + item.quantity, 0)}
          onLogout={logout}
        />
      )}
      {currentPage === 'login' && (
        <Login onLogin={login} onNavigate={setCurrentPage} />
      )}
      {currentPage === 'register' && (
        <Register onRegister={register} onNavigate={setCurrentPage} />
      )}
      {currentPage === 'profile' && (
        <Profile
          user={user}
          orders={getOrders()}
          onNavigate={setCurrentPage}
          onLogout={logout}
          cartItemsCount={cart.reduce((sum, item) => sum + item.quantity, 0)}
        />
      )}
      {currentPage === 'search' && (
        <Search
          user={user}
          searchQuery={searchQuery}
          onNavigate={setCurrentPage}
          onAddToCart={addToCart}
          onSearch={handleSearch}
          cartItemsCount={cart.reduce((sum, item) => sum + item.quantity, 0)}
          onLogout={logout}
        />
      )}
      {currentPage === 'cart' && (
        <Cart
          user={user}
          cart={cart}
          onNavigate={setCurrentPage}
          onUpdateQuantity={updateQuantity}
          onRemoveFromCart={removeFromCart}
          onLogout={logout}
        />
      )}
      {currentPage === 'checkout' && (
        <Checkout
          user={user}
          cart={cart}
          onNavigate={setCurrentPage}
          onOrderComplete={(order) => {
            addOrder(order);
            clearCart();
            setCurrentPage('confirmation');
          }}
          onLogout={logout}
        />
      )}
      {currentPage === 'confirmation' && (
        <OrderConfirmation onNavigate={setCurrentPage} />
      )}
    </div>
  );
}
