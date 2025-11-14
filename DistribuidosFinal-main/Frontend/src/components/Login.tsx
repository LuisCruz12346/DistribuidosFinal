import { useState } from 'react';
import { toast } from 'sonner@2.0.3';
import React from 'react'; // Aseguramos que React esté importado

type LoginProps = {
  // onLogin debe devolver una Promesa de booleano
  onLogin: (email: string, password: string) => Promise<boolean>;
  onNavigate: (page: string) => void;
};

export function Login({ onLogin, onNavigate }: LoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // --- FUNCIÓN CORREGIDA ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Detiene la recarga de la página

    // CRÍTICO: Usamos 'await' porque onLogin es asíncrona
    const success = await onLogin(email, password); 
    
    if (success) {
      toast.success('Inicio de sesión exitoso');
    } else {
      toast.error('Correo o contraseña incorrectos');
    }
  };
  // --- FIN DE LA CORRECCIÓN ---

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <svg className="h-12 w-12 mx-auto mb-6" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z" />
          </svg>
          <h1 className="mb-2">Ingresa tu correo electrónico para</h1>
          <h1>registrarte o iniciar sesión.</h1>
        </div>

        {/* El formulario llama a handleSubmit */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm text-gray-600 mb-2">
              Correo electrónico*
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm text-gray-600 mb-2">
              Contraseña*
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-black text-white py-3 rounded-full hover:bg-gray-800 transition-all text-center active:scale-95"
          >
            Continuar
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600 mb-2">¿No tienes cuenta?</p>
          <button
            onClick={() => onNavigate('register')}
            className="text-sm underline hover:no-underline"
          >
            Regístrate aquí
          </button>
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={() => onNavigate('home')}
            className="text-sm text-gray-600 hover:text-black"
          >
            ← Volver al inicio
          </button>
        </div>
      </div>
    </div>
  );
}
