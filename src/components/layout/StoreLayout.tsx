import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, Search, Menu, X, User, Heart } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { categories } from '../../data/mockData';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { totalItems } = useCart();
  const location = useLocation();

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'Products', path: '/products' },
    { label: 'Categories', path: '/categories' },
    { label: 'About', path: '/about' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-color-8 border-b border-color-6 shadow-md">
      {/* Top bar */}
      <div className="bg-color-1 text-color-8 text-xs py-2 text-center">
        <p>Free delivery on orders above ৳2000 ✨ Shop now!</p>
      </div>

      {/* Main header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group" aria-label="Meili Beauty Shop home">
            <span className="text-2xl">✨</span>
            <span className="text-xl font-bold text-color-1 group-hover:text-color-4 transition-colors duration-150">
              Meili Beauty
            </span>
          </Link>

          {/* Search bar - desktop */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-color-2" aria-hidden="true" />
              <input
                type="search"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-sm bg-color-7 border border-color-6 rounded-md focus:border-color-3 focus:ring-2 focus:ring-color-3/20 transition-all duration-150 text-color-1 placeholder:text-color-2/50"
                aria-label="Search products"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <Link to="/admin" className="hidden sm:flex items-center gap-1 text-sm text-color-2 hover:text-color-4 transition-colors duration-150" aria-label="Admin dashboard">
              <User className="w-4 h-4" />
              <span className="hidden lg:inline">Admin</span>
            </Link>
            <button className="relative p-2 text-color-2 hover:text-color-4 transition-colors duration-150" aria-label="Wishlist">
              <Heart className="w-5 h-5" />
            </button>
            <Link to="/cart" className="relative p-2 text-color-2 hover:text-color-4 transition-colors duration-150" aria-label={`Shopping cart with ${totalItems} items`}>
              <ShoppingCart className="w-5 h-5" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-color-4 text-color-8 text-xs font-bold rounded-full flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>
            <button
              className="md:hidden p-2 text-color-2"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
              aria-expanded={isMenuOpen}
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Navigation - desktop */}
        <nav className="hidden md:flex items-center gap-6 pb-3" aria-label="Main navigation">
          {navLinks.map(link => (
            <Link
              key={link.path}
              to={link.path}
              className={`text-sm font-medium transition-colors duration-150 ${
                location.pathname === link.path ? 'text-color-4' : 'text-color-2 hover:text-color-1'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-color-6 bg-color-8">
          <div className="px-4 py-4 space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-color-2" aria-hidden="true" />
              <input
                type="search"
                placeholder="Search products..."
                className="w-full pl-10 pr-4 py-2 text-sm bg-color-7 border border-color-6 rounded-md text-color-1"
                aria-label="Search products"
              />
            </div>
            {navLinks.map(link => (
              <Link
                key={link.path}
                to={link.path}
                className={`block py-2 text-sm font-medium ${
                  location.pathname === link.path ? 'text-color-4' : 'text-color-2'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <Link to="/admin" className="block py-2 text-sm font-medium text-color-2" onClick={() => setIsMenuOpen(false)}>
              Admin dashboard
            </Link>
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
              <li>📞 +880 1712 345 678</li>
              <li>✉️ hello@meilibeauty.com</li>
              <li>📍 Shop 12, Bashundhara City, Dhaka</li>
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
