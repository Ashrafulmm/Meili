import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, Menu, X, Heart } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { LiveSearch } from '../search/LiveSearch';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { totalItems } = useCart();
  const location = useLocation();

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'Products', path: '/products' },
    { label: 'Categories', path: '/categories' },
    { label: 'About', path: '/about' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-color-8 border-b border-color-6 shadow-sm">
      {/* Main header - compact layout */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
        <div className="flex items-center justify-between h-12 sm:h-14">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-1.5 sm:gap-2 group shrink-0" aria-label="Meili Beauty Shop home">
            <span className="text-lg sm:text-xl">✨</span>
            <span className="text-sm sm:text-base font-bold text-color-1 group-hover:text-color-4 transition-colors duration-150">
              Meili Beauty
            </span>
          </Link>

          {/* Desktop: Search + Navigation inline */}
          <div className="hidden md:flex items-center gap-4 flex-1 max-w-md mx-4">
            <LiveSearch />
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-4" aria-label="Main navigation">
            {navLinks.map(link => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-xs font-medium transition-colors duration-150 whitespace-nowrap ${
                  location.pathname === link.path ? 'text-color-4' : 'text-color-2 hover:text-color-1'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-1 shrink-0">
            <button className="relative p-1.5 text-color-2 hover:text-color-4 transition-colors duration-150" aria-label="Wishlist">
              <Heart className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            <Link to="/cart" className="relative p-1.5 text-color-2 hover:text-color-4 transition-colors duration-150" aria-label={`Shopping cart with ${totalItems} items`}>
              <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 bg-color-4 text-color-8 text-[10px] sm:text-xs font-bold rounded-full flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>
            <button
              className="md:hidden p-1.5 text-color-2"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
              aria-expanded={isMenuOpen}
            >
              {isMenuOpen ? <X className="w-4 h-4 sm:w-5 sm:h-5" /> : <Menu className="w-4 h-4 sm:w-5 sm:h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile: Search bar below header */}
        <div className="md:hidden pb-2">
          <LiveSearch />
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-color-6 bg-color-8">
          <div className="px-4 py-4 space-y-2">
            {navLinks.map(link => (
              <Link
                key={link.path}
                to={link.path}
                className={`block py-2 px-3 rounded-sm text-sm font-medium transition-colors duration-150 ${
                  location.pathname === link.path 
                    ? 'bg-color-4 text-color-8' 
                    : 'text-color-2 hover:bg-color-7'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}

export function Footer() {
  return (
    <footer className="bg-color-1 text-color-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">✨</span>
              <span className="text-xl font-bold">Meili Beauty Shop</span>
            </div>
            <p className="text-sm text-color-6/80 max-w-sm">
              Your one-stop destination for premium beauty and skincare products. We bring you the best from around the world.
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="font-semibold mb-4 text-sm">Quick links</h3>
            <ul className="space-y-2 text-sm text-color-6/80">
              <li><Link to="/products" className="hover:text-color-8 transition-colors duration-150">All products</Link></li>
              <li><Link to="/categories" className="hover:text-color-8 transition-colors duration-150">Categories</Link></li>
              <li><Link to="/about" className="hover:text-color-8 transition-colors duration-150">About us</Link></li>
              <li><Link to="/cart" className="hover:text-color-8 transition-colors duration-150">Cart</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold mb-4 text-sm">Contact us</h3>
            <ul className="space-y-2 text-sm text-color-6/80">
              <li>📞 +880 1965 480 023</li>
              <li>✉️ meilibeautybd@gmail.com</li>
              <li>📍 Mohammadpur, Dhaka</li>
              <li className="pt-2 text-xs text-color-6/60">Operated from Nanjing, China 🇨🇳</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-color-8/20 mt-8 pt-6 text-center text-xs text-color-6/60">
          <p>© 2024 Meili Beauty Shop. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
