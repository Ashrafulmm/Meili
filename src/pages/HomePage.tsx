import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, Truck, Shield, RefreshCw } from 'lucide-react';
import { categories } from '../data/mockData';
import { Card, Button, Badge } from '../components/ui';
import { useCart } from '../context/CartContext';
import { supabase } from '../lib/supabase';
import type { Product } from '../data/mockData';

export function HomePage() {
  const [currentBanner, setCurrentBanner] = useState(0);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  // Fetch products from Supabase
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data, error } = await supabase
          .from('products')
          .select(`
            *,
            product_images(image_url, sort_order),
            product_sections(section_id, sections(name))
          `)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching products:', error);
          return;
        }

        // Transform data to match Product type
        const transformedProducts: Product[] = (data || []).map((p: any) => ({
          id: p.id,
          title: p.title,
          slug: p.slug,
          price: p.price,
          originalPrice: p.original_price,
          description: p.description,
          shortDescription: p.short_description,
          images: p.product_images?.sort((a: any, b: any) => a.sort_order - b.sort_order).map((img: any) => img.image_url) || [],
          category: p.category,
          stock: p.stock,
          rating: p.rating || 0,
          reviewCount: p.review_count || 0,
          isFeatured: p.is_featured,
          sections: p.product_sections?.map((ps: any) => ps.sections?.name) || [],
          seoTitle: p.seo_title,
          seoDescription: p.seo_description,
          createdAt: p.created_at,
        }));

        setProducts(transformedProducts);
      } catch (err) {
        console.error('Failed to fetch products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Banner rotation
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBanner(prev => (prev + 1) % 2);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  // Section data - driven by product.sections field (managed from admin)
  const bestDeals = products.filter(p => p.sections?.includes('best-deals'));
  const kBeauty = products.filter(p => p.sections?.includes('k-beauty'));
  const yourPick = products.filter(p => p.sections?.includes('your-pick'));
  const forYou = products.filter(p => p.sections?.includes('for-you'));

  // Banner data (hardcoded for now, can be moved to database later)
  const banners = [
    {
      title: 'Summer glow collection',
      subtitle: 'Up to 40% off on selected items',
      image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=1200&h=400&fit=crop',
    },
    {
      title: 'New arrivals',
      subtitle: 'Discover the latest in beauty',
      image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=1200&h=400&fit=crop',
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Banner - Slimmer */}
      <section className="relative overflow-hidden bg-color-1" aria-label="Featured banner">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10">
          <div className="grid lg:grid-cols-2 gap-6 items-center">
            <div className="space-y-4">
              <Badge variant="warning">✨ New collection</Badge>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-color-8 leading-tight">
                {banners[currentBanner]?.title || 'Summer glow collection'}
              </h1>
              <p className="text-base sm:text-lg text-color-6/80">
                {banners[currentBanner]?.subtitle || 'Up to 40% off on selected items'}
              </p>
              <div className="flex gap-3">
                <Link to="/products">
                  <Button size="md">
                    Shop now <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
                <Link to="/categories">
                  <Button variant="outline" size="md" className="border-color-8/30 text-color-8 hover:bg-color-8/10">
                    Browse
                  </Button>
                </Link>
              </div>
              {/* Banner dots */}
              <div className="flex gap-2 pt-2">
                {banners.map((_, i) => (
                  <button
                    key={i}
                    className={`w-2 h-2 rounded-full transition-all duration-150 ${i === currentBanner ? 'bg-color-4 w-6' : 'bg-color-8/40'}`}
                    onClick={() => setCurrentBanner(i)}
                    aria-label={`Go to banner ${i + 1}`}
                  />
                ))}
              </div>
            </div>
            <div className="hidden lg:block">
              <div className="relative">
                <div className="absolute inset-0 bg-color-4/20 rounded-sm blur-3xl" />
                <img
                  src={banners[currentBanner]?.image}
                  alt={banners[currentBanner]?.title}
                  className="relative rounded-sm shadow-sm object-cover w-full aspect-square max-h-80"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features bar */}
      <section className="bg-color-8 border-b border-color-6" aria-label="Store features">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-color-7 rounded-sm flex items-center justify-center">
                <Truck className="w-5 h-5 text-color-3" aria-hidden="true" />
              </div>
              <div>
                <p className="text-sm font-semibold text-color-1">Free delivery</p>
                <p className="text-xs text-color-2">On orders above ৳2000</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-color-7 rounded-sm flex items-center justify-center">
                <Shield className="w-5 h-5 text-color-3" aria-hidden="true" />
              </div>
              <div>
                <p className="text-sm font-semibold text-color-1">100% authentic</p>
                <p className="text-xs text-color-2">Genuine products only</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-color-7 rounded-sm flex items-center justify-center">
                <RefreshCw className="w-5 h-5 text-color-3" aria-hidden="true" />
              </div>
              <div>
                <p className="text-sm font-semibold text-color-1">Easy returns</p>
                <p className="text-xs text-color-2">7-day return policy</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12" aria-labelledby="categories-heading">
        <div className="flex items-center justify-between mb-8">
          <h2 id="categories-heading" className="text-2xl font-bold text-color-1">Shop by category</h2>
          <Link to="/categories" className="text-sm font-medium text-color-4 hover:text-color-5 transition-colors duration-150 flex items-center gap-1">
            View all <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map(cat => (
            <Link key={cat.id} to={`/products?category=${cat.slug}`} className="group">
              <Card hover className="text-center p-4">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-16 h-16 rounded-full mx-auto mb-3 object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <p className="text-sm font-medium text-color-1">{cat.name}</p>
                <p className="text-xs text-color-2">{cat.productCount} items</p>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* Best Deals Section */}
      {!loading && bestDeals.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12" aria-labelledby="best-deals-heading">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 id="best-deals-heading" className="text-2xl font-bold text-color-1">Best deals</h2>
              <p className="text-sm text-color-2 mt-1">Grab them before they're gone</p>
            </div>
            <Link to="/products" className="text-sm font-medium text-color-4 hover:text-color-5 transition-colors duration-150 flex items-center gap-1">
              View all <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {bestDeals.map(product => (
              <ProductCard key={product.id} product={product} onAddToCart={() => addToCart(product)} />
            ))}
          </div>
        </section>
      )}

      {/* K-Beauty Section */}
      {!loading && kBeauty.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12" aria-labelledby="kbeauty-heading">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 id="kbeauty-heading" className="text-2xl font-bold text-color-1">K-Beauty</h2>
              <p className="text-sm text-color-2 mt-1">Korean skincare favorites</p>
            </div>
            <Link to="/products?category=k-beauty" className="text-sm font-medium text-color-4 hover:text-color-5 transition-colors duration-150 flex items-center gap-1">
              View all <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {kBeauty.map(product => (
              <ProductCard key={product.id} product={product} onAddToCart={() => addToCart(product)} />
            ))}
          </div>
        </section>
      )}

      {/* Your Pick Section */}
      {!loading && yourPick.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12" aria-labelledby="your-pick-heading">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 id="your-pick-heading" className="text-2xl font-bold text-color-1">Your pick</h2>
              <p className="text-sm text-color-2 mt-1">Handpicked by our team</p>
            </div>
            <Link to="/products" className="text-sm font-medium text-color-4 hover:text-color-5 transition-colors duration-150 flex items-center gap-1">
              View all <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {yourPick.map(product => (
              <ProductCard key={product.id} product={product} onAddToCart={() => addToCart(product)} />
            ))}
          </div>
        </section>
      )}

      {/* For You Section */}
      {!loading && forYou.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12" aria-labelledby="for-you-heading">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 id="for-you-heading" className="text-2xl font-bold text-color-1">For you</h2>
              <p className="text-sm text-color-2 mt-1">Recommended based on top-rated products</p>
            </div>
            <Link to="/products" className="text-sm font-medium text-color-4 hover:text-color-5 transition-colors duration-150 flex items-center gap-1">
              View all <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {forYou.map(product => (
              <ProductCard key={product.id} product={product} onAddToCart={() => addToCart(product)} />
            ))}
          </div>
        </section>
      )}

      {/* Empty state when no products */}
      {!loading && products.length === 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <p className="text-lg text-color-2 mb-4">No products available yet</p>
          <Link to="/products">
            <Button>Browse all products</Button>
          </Link>
        </section>
      )}

      {/* CTA Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-color-3 rounded-sm p-8 lg:p-12 text-center shadow-sm">
          <h2 className="text-2xl lg:text-3xl font-bold text-color-8 mb-4">Join our beauty community</h2>
          <p className="text-color-7/80 mb-6 max-w-lg mx-auto">Subscribe to get exclusive offers, beauty tips, and early access to new arrivals.</p>
          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Your email address"
              className="flex-1 px-4 py-3 text-sm bg-color-8 rounded-sm text-color-1 placeholder:text-color-2/50 focus:outline-none focus:ring-2 focus:ring-color-8/50"
              aria-label="Email address for newsletter"
            />
            <Button variant="secondary" size="md" className="bg-color-4 hover:bg-color-5">
              Subscribe
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}

// Product Card Component with 1:1 image and centered standard-size add-to-cart
interface ProductCardProps {
  product: Product;
  onAddToCart: () => void;
}

function ProductCard({ product, onAddToCart }: ProductCardProps) {
  return (
    <Card hover className="overflow-hidden group flex flex-col">
      <Link to={`/products/${product.slug}`} className="block">
        <div className="relative overflow-hidden">
          <img
            src={product.images[0]}
            alt={product.title}
            className="w-full aspect-square object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {product.originalPrice && (
            <Badge className="absolute top-3 left-3" variant="danger">
              -{Math.round((1 - product.price / product.originalPrice) * 100)}%
            </Badge>
          )}
        </div>
      </Link>
      <div className="p-4 flex flex-col flex-1">
        <div className="flex-1">
          <p className="text-xs text-color-2 mb-1">{product.category}</p>
          <Link to={`/products/${product.slug}`}>
            <h3 className="text-sm font-semibold text-color-1 hover:text-color-4 transition-colors duration-150 line-clamp-2">
              {product.title}
            </h3>
          </Link>
          <div className="flex items-center gap-1 mt-2">
            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" aria-hidden="true" />
            <span className="text-xs text-color-2">{product.rating}</span>
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-base font-bold text-color-1">৳{product.price}</span>
            {product.originalPrice && (
              <span className="text-xs text-color-2 line-through">৳{product.originalPrice}</span>
            )}
          </div>
        </div>
        <div className="mt-3 flex justify-center">
          <button
            onClick={onAddToCart}
            style={{ borderRadius: '5px', padding: '8px 16px', fontSize: '13px' }}
            className="inline-flex items-center justify-center font-semibold bg-color-4 text-color-8 hover:bg-color-5 active:bg-color-1 shadow-md hover:shadow-sm transition-all duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-color-3 disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label={`Add ${product.title} to cart`}
          >
            Add to cart
          </button>
        </div>
      </div>
    </Card>
  );
}
