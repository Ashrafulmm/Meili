import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Tag, Zap, Gift, ShoppingCart } from 'lucide-react';
import { Card, Badge } from '../components/ui';
import { useCart } from '../context/CartContext';
import { supabase } from '../lib/supabase';
import type { Product } from '../data/mockData';

// Shared product card component
function ProductCard({ product, onAddToCart }: { product: Product; onAddToCart: () => void }) {
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
            className="inline-flex items-center justify-center gap-1.5 font-semibold bg-color-4 text-color-8 hover:bg-color-5 active:bg-color-1 shadow-md hover:shadow-sm transition-all duration-150"
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            Add to cart
          </button>
        </div>
      </div>
    </Card>
  );
}

export function OffersPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const { data, error } = await supabase
          .from('products')
          .select(`*, product_images(image_url, sort_order)`)
          .not('original_price', 'is', null)
          .order('created_at', { ascending: false });

        if (!error && data) {
          const transformed: Product[] = data.map((p: any) => ({
            id: p.id, title: p.title, slug: p.slug, price: p.price,
            originalPrice: p.original_price, description: p.description,
            shortDescription: p.short_description,
            images: p.product_images?.sort((a: any, b: any) => a.sort_order - b.sort_order).map((img: any) => img.image_url) || [],
            category: p.category, stock: p.stock, rating: p.rating || 0,
            reviewCount: p.review_count || 0, isFeatured: p.is_featured,
            sections: [], seoTitle: p.seo_title, seoDescription: p.seo_description,
            createdAt: p.created_at,
          }));
          setProducts(transformed);
        }
      } catch (err) {
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchOffers();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-gradient-to-r from-color-4 to-color-5 rounded-sm p-6 sm:p-8 mb-8 text-color-8">
        <div className="flex items-center gap-3 mb-2">
          <Tag className="w-6 h-6" />
          <h1 className="text-2xl sm:text-3xl font-bold">Offers</h1>
        </div>
        <p className="text-sm sm:text-base opacity-90">Grab the best deals before they're gone!</p>
      </div>

      {loading ? (
        <p className="text-center text-color-2 py-12">Loading offers...</p>
      ) : products.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-lg text-color-2 mb-4">No offers available right now</p>
          <Link to="/products"><button className="px-6 py-3 bg-color-4 text-color-8 rounded-md font-semibold">Browse all products</button></Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
          {products.map(product => (
            <ProductCard key={product.id} product={product} onAddToCart={() => addToCart(product)} />
          ))}
        </div>
      )}
    </div>
  );
}

export function FlashSalePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchFlashSale = async () => {
      try {
        const { data, error } = await supabase
          .from('products')
          .select(`*, product_images(image_url, sort_order), product_sections(section_id, sections(name))`)
          .order('price', { ascending: true })
          .limit(20);

        if (!error && data) {
          const transformed: Product[] = data.map((p: any) => ({
            id: p.id, title: p.title, slug: p.slug, price: p.price,
            originalPrice: p.original_price, description: p.description,
            shortDescription: p.short_description,
            images: p.product_images?.sort((a: any, b: any) => a.sort_order - b.sort_order).map((img: any) => img.image_url) || [],
            category: p.category, stock: p.stock, rating: p.rating || 0,
            reviewCount: p.review_count || 0, isFeatured: p.is_featured,
            sections: p.product_sections?.map((ps: any) => ps.sections?.name) || [],
            seoTitle: p.seo_title, seoDescription: p.seo_description,
            createdAt: p.created_at,
          }));
          setProducts(transformed);
        }
      } catch (err) {
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchFlashSale();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-gradient-to-r from-color-1 to-color-4 rounded-sm p-6 sm:p-8 mb-8 text-color-8">
        <div className="flex items-center gap-3 mb-2">
          <Zap className="w-6 h-6 fill-current" />
          <h1 className="text-2xl sm:text-3xl font-bold">Flash sale</h1>
        </div>
        <p className="text-sm sm:text-base opacity-90">Lowest prices, limited time only!</p>
      </div>

      {loading ? (
        <p className="text-center text-color-2 py-12">Loading flash sale...</p>
      ) : products.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-lg text-color-2 mb-4">No flash sale items right now</p>
          <Link to="/products"><button className="px-6 py-3 bg-color-4 text-color-8 rounded-md font-semibold">Browse all products</button></Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
          {products.map(product => (
            <ProductCard key={product.id} product={product} onAddToCart={() => addToCart(product)} />
          ))}
        </div>
      )}
    </div>
  );
}

export function FreeGiftsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchFreeGifts = async () => {
      try {
        // Free gifts are low-priced items
        const { data, error } = await supabase
          .from('products')
          .select(`*, product_images(image_url, sort_order)`)
          .lte('price', 500)
          .order('price', { ascending: true });

        if (!error && data) {
          const transformed: Product[] = data.map((p: any) => ({
            id: p.id, title: p.title, slug: p.slug, price: p.price,
            originalPrice: p.original_price, description: p.description,
            shortDescription: p.short_description,
            images: p.product_images?.sort((a: any, b: any) => a.sort_order - b.sort_order).map((img: any) => img.image_url) || [],
            category: p.category, stock: p.stock, rating: p.rating || 0,
            reviewCount: p.review_count || 0, isFeatured: p.is_featured,
            sections: [], seoTitle: p.seo_title, seoDescription: p.seo_description,
            createdAt: p.created_at,
          }));
          setProducts(transformed);
        }
      } catch (err) {
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchFreeGifts();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-gradient-to-r from-color-3 to-color-3/80 rounded-sm p-6 sm:p-8 mb-8 text-color-8">
        <div className="flex items-center gap-3 mb-2">
          <Gift className="w-6 h-6" />
          <h1 className="text-2xl sm:text-3xl font-bold">Free gifts</h1>
        </div>
        <p className="text-sm sm:text-base opacity-90">Complimentary gifts with qualifying orders!</p>
      </div>

      {loading ? (
        <p className="text-center text-color-2 py-12">Loading free gifts...</p>
      ) : products.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-lg text-color-2 mb-4">No free gifts available right now</p>
          <Link to="/products"><button className="px-6 py-3 bg-color-4 text-color-8 rounded-md font-semibold">Browse all products</button></Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
          {products.map(product => (
            <ProductCard key={product.id} product={product} onAddToCart={() => addToCart(product)} />
          ))}
        </div>
      )}
    </div>
  );
}
