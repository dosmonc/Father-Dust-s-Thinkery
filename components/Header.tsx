import React from 'react';
import { CartIcon } from './Icons';

interface HeaderProps {
  cartCount: number;
  onCartClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ cartCount, onCartClick }) => {
  return (
    <header className="bg-[hsl(var(--surface))] border-b border-[hsl(var(--border))] py-4 px-6 sticky top-0 z-40 shadow-sm">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <a href="#home" className="text-xl md:text-2xl font-bold text-[hsl(var(--primary))]">
          📚 Father Dust's Thinkery
        </a>
        <nav className="flex gap-4 md:gap-8 items-center">
          <a href="#home" className="hidden md:inline text-sm font-medium text-[hsl(var(--foreground))] hover:text-[hsl(var(--primary))] transition-colors">Home</a>
          <a href="https://tmoncrieff.gumroad.com/l/promptinjector" target="_blank" rel="noopener noreferrer" className="hidden md:inline text-sm font-medium text-[hsl(var(--foreground))] hover:text-[hsl(var(--primary))] transition-colors">AI Tools</a>
          <button onClick={onCartClick} className="relative bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] px-4 py-2 rounded-lg font-medium cursor-pointer transition-colors hover:bg-opacity-90 flex items-center gap-2">
            <CartIcon className="w-5 h-5" />
            <span className="hidden sm:inline">Cart</span>
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                {cartCount}
              </span>
            )}
          </button>
        </nav>
      </div>
    </header>
  );
};

export default Header;
