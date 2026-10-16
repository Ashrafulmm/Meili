import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Star, ShoppingCart, Heart, Minus, Plus, Truck, Shield, RefreshCw, Zap } from 'lucide-react';
import { Button, Badge, Card } from '../components/ui';
import { useCart } from '../context/CartContext';
import { supabase } from '../lib/supabase';
import type { Product } from '../data/mockData';

export function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);

  // Fetch product from Supabase
  useEffect(() => {
    const fetchProduct = async () => {
      if (!slug) return;

      try {
        const { data, error } = await supabase
          .from('products')
          .select(`
            *,
            product_images(image_url, sort_order),
            product_sections(section_id, sections(name))
          `)
          .eq('slug', slug)
          .single();

        if (error) {
          console.error('Error fetching product:', error);
          setLoading(false);
          return;
        }

        // Transform data to match Product type
        const transformedProduct: Product = {
          id: data.id,
          title: data.title,
          slug: data.slug,
          price: data.price,
          originalPrice: data.original_price,
          description: data.description,
          shortDescription: data.short_description,
          images: data.product_images?.sort((a: any, b: any) => a.sort_order - b.sort_order).map((img: any) => img.image_url) || [],
          category: data.category,
          stock: data.stock,
          rating: data.rating || 0,
          reviewCount: data.review_count || 0,
          isFeatured: data.is_featured,
          sections: data.product_sections?.map((ps: any) => ps.sections?.name) || [],
          seoTitle: data.seo_title,
          seoDescription: data.seo_description,
          createdAt: data.created_at,
        };

        setProduct(transformedProduct);

        // Fetch related products
        const { data: relatedData } = await supabase
          .from('products')
          .select(`
            *,
            product_images(image_url, sort_order)
          `)
          .eq('category', data.category)
          .neq('id', data.id)
          .limit(4);

        if (relatedData) {
          const transformedRelated: Product[] = relatedData.map((p: any) => ({
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
            sections: [],
            seoTitle: p.seo_title,
            seoDescription: p.seo_description,
            createdAt: p.created_at,
          }));
          setRelatedProducts(transformedRelated);
        }
      } catch (err) {
        console.error('Failed to fetch product:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <p className="text-color-2">Loading product...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <h1 className="text-2xl font-bold text-color-1 mb-4">Product not found</h1>
        <Link to="/products"><Button>Back to products</Button></Link>
      </div>
    );
  }

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const handleBuyNow = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
    navigate('/checkout');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs sm:text-sm text-color-2 mb-4" aria-label="Breadcrumb">
        <Link to="/" className="hover:text-color-4 transition-colors duration-150">Home</Link>
        <span>/</span>
        <Link to="/products" className="hover:text-color-4 transition-colors duration-150">Products</Link>
        <span>/</span>
        <span className="text-color-1 font-medium truncate">{product.title}</span>
      </nav>

      {/* Product detail */}
      <div className="grid lg:grid-cols-2 gap-6 lg:gap-10">
        {/* Images */}
        <div className="space-y-3">
          <div className="relative overflow-hidden rounded-md bg-color-7">
            <img
              src={product.images[selectedImage] || product.images[0]}
              alt={product.title}
              className="w-full aspect-square object-cover"
            />
            {product.originalPrice && (
              <Badge className="absolute top-3 left-3" variant="danger">
                -{Math.round((1 - product.price / product.originalPrice) * 100)}% off
              </Badge>
            )}
          </div>
          {/* Thumbnail gallery */}
          {product.images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-2">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`shrink-0 w-16 h-16 rounded-md overflow-hidden border-2 transition-all duration-150 ${
                    selectedImage === idx ? 'border-color-4' : 'border-color-6 hover:border-color-4'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="space-y-4">
          <div>
            <p className="text-xs text-color-2 mb-1">{product.category}</p>
            <h1 className="text-xl sm:text-2xl font-bold text-color-1 mb-2">{product.title}</h1>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`w-3.5 h-3.5 ${i < Math.floor(product.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-color-6'}`} />
                ))}
              </div>
              <span className="text-xs text-color-2">{product.rating} ({product.reviewCount} reviews)</span>
            </div>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-2 py-2 border-y border-color-6">
            <span className="text-2xl font-extrabold text-color-1">৳{product.price}</span>
            {product.originalPrice && (
              <span className="text-sm text-color-2 line-through">৳{product.originalPrice}</span>
            )}
          </div>

          {/* Description */}
          <div>
            <h2 className="text-sm font-semibold text-color-1 mb-1.5">Description</h2>
            <p className="text-sm text-color-2 leading-relaxed">{product.description}</p>
          </div>

          {/* Stock status */}
          <div className="flex items-center gap-2">
            {product.stock > 0 ? (
              <>
                <span className="w-2 h-2 bg-green-500 rounded-full" aria-hidden="true" />
                <span className="text-sm text-green-700 font-medium">In stock ({product.stock} available)</span>
              </>
            ) : (
              <>
                <span className="w-2 h-2 bg-red-500 rounded-full" aria-hidden="true" />
                <span className="text-sm text-red-700 font-medium">Out of stock</span>
              </>
            )}
          </div>

          {/* Quantity selector */}
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-color-1">Quantity:</span>
            <div className="flex items-center border border-color-6 rounded-md">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="p-2 text-color-2 hover:text-color-1 transition-colors duration-150"
                aria-label="Decrease quantity"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="px-3 py-2 text-sm font-medium text-color-1 min-w-[36px] text-center">{quantity}</span>
              <button
                onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                className="p-2 text-color-2 hover:text-color-1 transition-colors duration-150"
                aria-label="Increase quantity"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 text-sm font-semibold bg-color-8 text-color-4 border-2 border-color-4 rounded-md hover:bg-color-4 hover:text-color-8 active:bg-color-1 transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ borderRadius: '5px' }}
            >
              <ShoppingCart className="w-4 h-4" />
              {addedToCart ? 'Added!' : 'Add to cart'}
            </button>
            <button
              onClick={handleBuyNow}
              disabled={product.stock === 0}
              className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 text-sm font-semibold bg-color-4 text-color-8 rounded-md hover:bg-color-5 active:bg-color-1 shadow-md hover:shadow-sm transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ borderRadius: '5px' }}
            >
              <Zap className="w-4 h-4" />
              Buy now
            </button>
            <button
              className="p-3 border-2 border-color-6 rounded-md text-color-2 hover:text-color-4 hover:border-color-4 transition-all duration-150"
              aria-label="Add to wishlist"
            >
              <Heart className="w-4 h-4" />
            </button>
          </div>

          {/* Features */}
          <div className="grid grid-cols-3 gap-3 pt-4 border-t border-color-6">
            <div className="text-center">
              <Truck className="w-4 h-4 text-color-3 mx-auto mb-1" aria-hidden="true" />
              <p className="text-xs text-color-2">Free delivery</p>
            </div>
            <div className="text-center">
              <Shield className="w-4 h-4 text-color-3 mx-auto mb-1" aria-hidden="true" />
              <p className="text-xs text-color-2">Authentic</p>
            </div>
            <div className="text-center">
              <RefreshCw className="w-4 h-4 text-color-3 mx-auto mb-1" aria-hidden="true" />
              <p className="text-xs text-color-2">Easy returns</p>
            </div>
          </div>
        </div>
      </div>

      {/* Related products */}
      {relatedProducts.length > 0 && (
        <section className="mt-16" aria-labelledby="related-heading">
          <h2 id="related-heading" className="text-xl font-bold text-color-1 mb-6">You might also like</h2>
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {relatedProducts.map(p => (
              <Card key={p.id} hover className="overflow-hidden group flex flex-col">
                <Link to={`/products/${p.slug}`} className="block">
                  <img src={p.images[0]} alt={p.title} className="w-full aspect-square object-cover group-hover:scale-105 transition-transform duration-300" />
                </Link>
                <div className="p-4 flex flex-col flex-1">
                  <Link to={`/products/${p.slug}`}>
                    <h3 className="text-sm font-semibold text-color-1 hover:text-color-4 transition-colors duration-150 line-clamp-2">{p.title}</h3>
                  </Link>
                  <p className="text-lg font-bold text-color-1 mt-2">৳{p.price}</p>
                  <div className="mt-3 flex justify-center">
                    <button
                      onClick={() => addToCart(p)}
                      style={{ borderRadius: '5px', padding: '8px 16px', fontSize: '13px' }}
                      className="inline-flex items-center justify-center font-semibold bg-color-4 text-color-8 hover:bg-color-5 active:bg-color-1 shadow-md hover:shadow-sm transition-all duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-color-3"
                      aria-label={`Add ${p.title} to cart`}
                    >
                      Add to cart
                    </button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
