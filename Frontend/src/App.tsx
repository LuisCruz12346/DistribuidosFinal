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
      // CORREGIDO: Usando /api/carrito
      const response = await fetch("/api/carrito", {
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
//  if (user) { // solo si hay usuario logueado
//    localStorage.setItem('cart', JSON.stringify(cart));
//  }
// }, [cart, user]);

// Anadir al carrito Listo
const addToCart = async (product: Product) => {
  try {
    // CORREGIDO: Usando /api/AgreCarrito
    const response = await fetch("/api/AgreCarrito", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", // importante para mantener la sesión
      body: JSON.stringify({
        id_producto: product.id
      }),
    });

    const data = await response.json();

    if (response.ok) {
      console.log(" Producto agregado:", data);
    } else {
      console.error(" Error al agregar producto:", data.error || data);
    }
  } catch (error) {
    console.error(" Error de red:", error);
  }
};

// Remover producto de carrito CASI LISTO
const removeFromCart = async (productId: string) => {
  try {
    // CORREGIDO: Usando /api/borCarr
    const response = await fetch("/api/borCarr", {
      method: "POST", // podrías usar DELETE si lo ajustas también en Flask
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", // mantiene la sesión activa
      body: JSON.stringify({
        id_carrito: productId
      }),
    });
    console.log("Salio esto  ", productId)
    const data = await response.json();

    if (response.ok) {
      console.log("Producto borrado del carrito:", data.mensaje);
      // Aquí podrías actualizar el estado local del carrito:
      // setCart(prev => prev.filter(item => item.id !== productId));
    } else {
      console.error("Error al borrar el producto:", data.error || data);
    }

  } catch (error) {
    console.error(" Error de red:", error);
  }
};

// Modicar la cantidad de productos en el carrito
const updateQuantity = async (id_carrito: string, quantity: number) => {
  if (quantity <= 0) {
    removeFromCart(id_carrito);
    return;
  }

  try {
    // CORREGIDO: Usando /api/ModCarrito
    const response = await fetch("/api/ModCarrito", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", // mantiene la sesión activa
      body: JSON.stringify({
        id_carrito: id_carrito,
        cantidad: quantity,
      }),
    });
    if (!response.ok) {
      const errorData = await response.json();
      console.error("Error al actualizar carrito:", errorData.error);
      return;
    }

    const data = await response.json();
    console.log("Cantidad actualizada correctamente:", data.message);

  } catch (error) {
    console.error("Error de conexión con el servidor:", error);
  }
};

  
// Se borra el carrito
  const clearCart = () => {
    setCart([]);
    localStorage.setItem('cart', JSON.stringify([]));
  };

// Inicio de sesion listo
  const login = async (email: string, password: string) => {
  try {
      // CORREGIDO: Usando /api/login
      const response = await fetch("/api/login", {
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
    // CORREGIDO: Usando /api/logout
    await fetch("/api/logout", {
      method: "GET",
      credentials: "include",   // <<< IMPORTANTE PARA BORRAR SESIÓN
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
    // CORREGIDO: Usando /api/register
    const response = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",        // <<< Necesario si usas sesión
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

// Cada vez que hay una confirmacion de orden se guardan en la seccion de compras
const addOrder = async (order: Order) => {
  if (!user) return;
  try {
    // CORREGIDO: Usando /api/compra
    const response = await fetch("/api/compra", {
      method: "POST",
      credentials: "include", // Mantiene la sesión
      headers: {
        "Content-Type": "application/json",
      },
      //body: JSON.stringify({productos: order.products, total : order.total}), // Enviamos la orden si es necesario
    });

    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }

    const data = await response.json();
    console.log("Compra procesada correctamente:", data);

  } catch (error) {
    console.error("Error al procesar la compra:", error);
  }
};

  const getOrders = (): Order[] => {
    if (!user) return [];
    return JSON.parse(localStorage.getItem(`orders_${user.email}`) || '[]');
  };

// Buscar productos en la base de datos LISTO
const handleSearch = async (query: string) => {
  try {
    // CORREGIDO: Usando /api/productos
    const response = await fetch("/api/productos", {
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
