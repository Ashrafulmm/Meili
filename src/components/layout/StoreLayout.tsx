import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, Menu, X, Heart, User, Zap, Gift, Tag, ChevronRight, Search } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { LiveSearch } from '../search/LiveSearch';
import { supabase } from '../../lib/supabase';

interface SubCategory {
  id: string;
  name: string;
  slug: string;
}

interface Category {
  id: string;
  name: string;
  slug: string;
  image: string;
  subCategories?: SubCategory[];
}

const LOGO_URL = 'https://ktfxnbtmuwsqdszciwvg.supabase.co/storage/v1/object/public/product-images/products/Meili%20Beauty%20Shop.png';

// Default categories with subcategories from thebeautymartbd.com
const DEFAULT_CATEGORIES: Category[] = [
  {
    id: '1', name: 'K-Beauty', slug: 'k-beauty',
    image: 'https://images.unsplash.com/photo-1570194065650-d99fb4bedf0a?w=300&h=300&fit=crop',
    subCategories: [
      { id: 'kb1', name: 'COSRX', slug: 'cosrx' },
      { id: 'kb2', name: 'Beauty of Joseon', slug: 'beauty-of-joseon' },
      { id: 'kb3', name: 'SKIN1004', slug: 'skin1004' },
      { id: 'kb4', name: 'Anua', slug: 'anua' },
      { id: 'kb5', name: 'APLB', slug: 'aplb' },
      { id: 'kb6', name: 'Etude', slug: 'etude' },
      { id: 'kb7', name: 'Medicube', slug: 'medicube' },
      { id: 'kb8', name: 'Care:nel', slug: 'care-nel' },
    ],
  },
  {
    id: '2', name: 'Skincare', slug: 'skincare',
    image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=300&h=300&fit=crop',
    subCategories: [
      { id: 'sk1', name: 'Cleansers', slug: 'cleansers' },
      { id: 'sk2', name: 'Serums', slug: 'serums' },
      { id: 'sk3', name: 'Moisturizers', slug: 'moisturizers' },
      { id: 'sk4', name: 'Sunscreen', slug: 'sunscreen' },
      { id: 'sk5', name: 'Toners', slug: 'toners' },
      { id: 'sk6', name: 'Masks', slug: 'masks' },
    ],
  },
  {
    id: '3', name: 'Makeup', slug: 'makeup',
    image: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=300&h=300&fit=crop',
    subCategories: [
      { id: 'mk1', name: 'Lipstick', slug: 'lipstick' },
      { id: 'mk2', name: 'Lip tint', slug: 'lip-tint' },
      { id: 'mk3', name: 'Lip gloss', slug: 'lip-gloss' },
      { id: 'mk4', name: 'Foundation', slug: 'foundation' },
      { id: 'mk5', name: 'Eyebrow', slug: 'eyebrow' },
      { id: 'mk6', name: 'Blush', slug: 'blush' },
      { id: 'mk7', name: 'Mascara', slug: 'mascara' },
    ],
  },
  {
    id: '4', name: 'Haircare', slug: 'haircare',
    image: 'https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?w=300&h=300&fit=crop',
    subCategories: [
      { id: 'hc1', name: 'Shampoo', slug: 'shampoo' },
      { id: 'hc2', name: 'Conditioner', slug: 'conditioner' },
      { id: 'hc3', name: 'Hair mask', slug: 'hair-mask' },
      { id: 'hc4', name: 'Hair oil', slug: 'hair-oil' },
      { id: 'hc5', name: 'Hair serum', slug: 'hair-serum' },
    ],
  },
  {
    id: '5', name: 'Fragrance', slug: 'fragrance',
    image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=300&h=300&fit=crop',
    subCategories: [
      { id: 'fg1', name: 'Perfume', slug: 'perfume' },
      { id: 'fg2', name: 'Body mist', slug: 'body-mist' },
      { id: 'fg3', name: 'Roll-on', slug: 'roll-on' },
    ],
  },
  {
    id: '6', name: 'Body care', slug: 'body-care',
    image: 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=300&h=300&fit=crop',
    subCategories: [
      { id: 'bc1', name: 'Body lotion', slug: 'body-lotion' },
      { id: 'bc2', name: 'Body wash', slug: 'body-wash' },
      { id: 'bc3', name: 'Hand cream', slug: 'hand-cream' },
      { id: 'bc4', name: 'Foot care', slug: 'foot-care' },
    ],
  },
  {
    id: '7', name: 'Tools', slug: 'tools',
    image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=300&h=300&fit=crop',
    subCategories: [
      { id: 'tl1', name: 'Face roller', slug: 'face-roller' },
      { id: 'tl2', name: 'Brushes', slug: 'brushes' },
      { id: 'tl3', name: 'Sponges', slug: 'sponges' },
    ],
  },
];

export function Header() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { totalItems } = useCart();
  const location = useLocation();
  const [categories, setCategories] = useState<Category[]>(DEFAULT_CATEGORIES);

  // Close drawer on route change
  useEffect(() => {
    setIsDrawerOpen(false);
    setExpandedCategory(null);
  }, [location.pathname]);

  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (isDrawerOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isDrawerOpen]);

  return (
    <>
      <header className="sticky top-0 z-40 bg-color-8 border-b border-color-6 shadow-sm">
        <div className="w-full px-3 sm:px-4 lg:px-6">
          <div className="flex items-center justify-between h-14">
            {/* Left: Menu button */}
            <button
              className="p-2 -ml-2 text-color-1 hover:text-color-4 transition-colors duration-150"
              onClick={() => setIsDrawerOpen(true)}
              aria-label="Open menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Middle: Logo */}
            <Link to="/" className="flex items-center" aria-label="Meili Beauty Shop home">
              <img
                src={LOGO_URL}
                alt="Meili Beauty Shop"
                className="h-10 sm:h-12 w-auto object-contain"
                onError={(e) => {
                  // Fallback to text if image fails
                  (e.target as HTMLImageElement).style.display = 'none';
                  const fallback = (e.target as HTMLImageElement).nextElementSibling as HTMLElement;
                  if (fallback) fallback.style.display = 'flex';
                }}
              />
              <span className="hidden items-center gap-1 text-base sm:text-lg font-bold text-color-1">
                <span>✨</span> Meili Beauty
              </span>
            </Link>

            {/* Right: Search, Login, Cart */}
            <div className="flex items-center gap-1 sm:gap-2">
              <button
                className="p-2 text-color-2 hover:text-color-4 transition-colors duration-150 lg:hidden"
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                aria-label="Search"
              >
                <Search className="w-5 h-5" />
              </button>
              <Link
                to="/admin/login"
                className="hidden sm:flex p-2 text-color-2 hover:text-color-4 transition-colors duration-150"
                aria-label="Customer login"
              >
                <User className="w-5 h-5" />
              </Link>
              <Link to="/cart" className="relative p-2 text-color-2 hover:text-color-4 transition-colors duration-150" aria-label={`Shopping cart with ${totalItems} items`}>
                <ShoppingCart className="w-5 h-5" />
                {totalItems > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-color-4 text-color-8 text-[10px] font-bold rounded-full flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </Link>
            </div>
          </div>

          {/* Desktop search bar */}
          <div className="hidden lg:block pb-2">
            <LiveSearch />
          </div>

          {/* Mobile search bar */}
          {isSearchOpen && (
            <div className="lg:hidden pb-2">
              <LiveSearch />
            </div>
          )}
        </div>
      </header>

      {/* Drawer Overlay */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setIsDrawerOpen(false)}
          />
          <aside className="absolute left-0 top-0 bottom-0 w-80 max-w-[85vw] bg-color-8 shadow-sm overflow-y-auto">
            {/* Drawer header */}
            <div className="sticky top-0 bg-color-8 border-b border-color-6 px-4 py-3 flex items-center justify-between z-10">
              <span className="text-base font-bold text-color-1">Menu</span>
              <button
                onClick={() => setIsDrawerOpen(false)}
                className="p-2 text-color-2 hover:text-color-1 transition-colors duration-150"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Drawer content */}
            <nav className="p-2">
              {/* Sign in */}
              <Link
                to="/admin/login"
                className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-color-1 hover:bg-color-7 rounded-sm transition-colors duration-150"
              >
                <User className="w-4 h-4 text-color-4" />
                Sign in
              </Link>

              <div className="my-2 border-t border-color-6" />

              {/* Special sections */}
              <Link
                to="/offers"
                className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-color-1 hover:bg-color-7 rounded-sm transition-colors duration-150"
              >
                <Tag className="w-4 h-4 text-color-4" />
                Offers
              </Link>
              <Link
                to="/flash-sale"
                className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-color-1 hover:bg-color-7 rounded-sm transition-colors duration-150"
              >
                <Zap className="w-4 h-4 text-color-5" />
                Flash sale
              </Link>
              <Link
                to="/free-gifts"
                className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-color-1 hover:bg-color-7 rounded-sm transition-colors duration-150"
              >
                <Gift className="w-4 h-4 text-color-3" />
                Free gifts
              </Link>
              <Link
                to="/cart"
                className="flex items-center justify-between px-4 py-3 text-sm font-medium text-color-1 hover:bg-color-7 rounded-sm transition-colors duration-150"
              >
                <span className="flex items-center gap-3">
                  <ShoppingCart className="w-4 h-4 text-color-2" />
                  Cart
                  {totalItems > 0 && (
                    <span className="bg-color-4 text-color-8 text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                      {totalItems}
                    </span>
                  )}
                </span>
              </Link>

              <div className="my-2 border-t border-color-6" />

              {/* Categories */}
              <div className="px-4 py-2">
                <p className="text-xs font-semibold text-color-2 uppercase tracking-wider">Categories</p>
              </div>
              {categories.map(cat => (
                <div key={cat.id}>
                  <button
                    onClick={() => setExpandedCategory(expandedCategory === cat.id ? null : cat.id)}
                    className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium text-color-1 hover:bg-color-7 rounded-sm transition-colors duration-150"
                  >
                    <span className="flex items-center gap-3">
                      <img src={cat.image} alt="" className="w-6 h-6 rounded-full object-cover" />
                      {cat.name}
                    </span>
                    <ChevronRight
                      className={`w-4 h-4 text-color-2 transition-transform duration-150 ${expandedCategory === cat.id ? 'rotate-90' : ''}`}
                    />
                  </button>
                  {expandedCategory === cat.id && cat.subCategories && (
                    <div className="pl-12 pb-2 space-y-0.5">
                      {cat.subCategories.map(sub => (
                        <Link
                          key={sub.id}
                          to={`/products?category=${cat.slug}&sub=${sub.slug}`}
                          className="block px-4 py-2 text-sm text-color-2 hover:text-color-1 hover:bg-color-7 rounded-sm transition-colors duration-150"
                        >
                          {sub.name}
                        </Link>
                      ))}
                      <Link
                        to={`/products?category=${cat.slug}`}
                        className="block px-4 py-2 text-sm font-medium text-color-4 hover:text-color-5 transition-colors duration-150"
                      >
                        View all {cat.name} →
                      </Link>
                    </div>
                  )}
                </div>
              ))}
            </nav>
          </aside>
        </div>
      )}
    </>
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
              <img
                src={LOGO_URL}
                alt="Meili Beauty Shop"
                className="h-10 w-auto object-contain"
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
              />
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
              <li><Link to="/offers" className="hover:text-color-8 transition-colors duration-150">Offers</Link></li>
              <li><Link to="/flash-sale" className="hover:text-color-8 transition-colors duration-150">Flash sale</Link></li>
              <li><Link to="/free-gifts" className="hover:text-color-8 transition-colors duration-150">Free gifts</Link></li>
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
