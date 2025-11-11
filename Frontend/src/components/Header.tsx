import { Search, ShoppingCart, User } from 'lucide-react';
import { User as UserType } from '../App';

type HeaderProps = {
  user: UserType | null;
  onNavigate: (page: string) => void;
  onSearch: (query: string) => void;
  cartItemsCount: number;
  onLogout: () => void;
};

export function Header({ user, onNavigate, onSearch, cartItemsCount, onLogout }: HeaderProps) {
  return (
    <header className="border-b">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <button onClick={() => onNavigate('home')} className="flex items-center gap-2">
            <svg className="h-10 w-10" viewBox="0 0 100 100" fill="none">
              <path 
                d="M30 45 L50 25 L70 45 L70 75 L30 75 Z" 
                stroke="currentColor" 
                strokeWidth="4" 
                fill="none"
              />
              <path 
                d="M70 30 Q 75 25, 80 30 Q 82 35, 78 40 L70 45" 
                fill="currentColor"
              />
            </svg>
            <span className="text-xl tracking-wider">MIPLACE</span>
          </button>

          <div className="flex-1 max-w-md mx-8">
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar"
                className="w-full px-4 py-2 border rounded-full bg-gray-100 focus:outline-none focus:ring-2 focus:ring-black"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    onSearch(e.currentTarget.value);
                  }
                }}
              />
              <Search className="absolute right-3 top-2.5 h-5 w-5 text-gray-500" />
            </div>
          </div>

          <div className="flex items-center gap-6">
            {user ? (
              <div className="relative group">
                <button className="flex items-center gap-2">
                  <User className="h-6 w-6" />
                </button>
                <div className="absolute right-0 top-full mt-2 w-48 bg-white border shadow-lg rounded-lg py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                  <button
                    onClick={() => onNavigate('profile')}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100"
                  >
                    Mi Perfil
                  </button>
                  <button
                    onClick={onLogout}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100"
                  >
                    Cerrar Sesión
                  </button>
                </div>
              </div>
            ) : (
              <button onClick={() => onNavigate('login')}>
                <User className="h-6 w-6" />
              </button>
            )}
            <button onClick={() => onNavigate('cart')} className="relative">
              <ShoppingCart className="h-6 w-6" />
              {cartItemsCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-black text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                  {cartItemsCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
