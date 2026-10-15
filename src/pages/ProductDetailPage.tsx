import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, ShoppingCart, Heart, Minus, Plus, Truck, Shield, RefreshCw } from 'lucide-react';
import { products } from '../data/mockData';
import { Button, Badge, Card } from '../components/ui';
import { useCart } from '../context/CartContext';

export function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const product = products.find(p => p.slug === slug);
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);

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

  const relatedProducts = products.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-color-2 mb-6" aria-label="Breadcrumb">
        <Link to="/" className="hover:text-color-4 transition-colors duration-150">Home</Link>
        <span>/</span>
        <Link to="/products" className="hover:text-color-4 transition-colors duration-150">Products</Link>
        <span>/</span>
        <span className="text-color-1 font-medium">{product.title}</span>
      </nav>

      {/* Product detail */}
      <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Images */}
        <div className="space-y-4">
          <div className="relative overflow-hidden rounded-sm bg-color-7">
            <img
              src={product.images[0]}
              alt={product.title}
              className="w-full aspect-square object-cover"
            />
            {product.originalPrice && (
              <Badge className="absolute top-4 left-4" variant="danger">
                -{Math.round((1 - product.price / product.originalPrice) * 100)}% off
              </Badge>
            )}
          </div>
        </div>

        {/* Info */}
        <div className="space-y-6">
          <div>
            <p className="text-sm text-color-2 mb-2">{product.category}</p>
            <h1 className="text-2xl lg:text-3xl font-bold text-color-1 mb-3">{product.title}</h1>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-color-6'}`} />
                ))}
              </div>
              <span className="text-sm text-color-2">{product.rating} ({product.reviewCount} reviews)</span>
            </div>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-extrabold text-color-1">৳{product.price}</span>
            {product.originalPrice && (
              <span className="text-lg text-color-2 line-through">৳{product.originalPrice}</span>
            )}
          </div>

          {/* Description */}
          <div>
            <h2 className="text-sm font-semibold text-color-1 mb-2">Description</h2>
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

          {/* Quantity & Add to cart */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pt-4">
            <div className="flex items-center border-2 border-color-6 rounded-sm">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="p-3 text-color-2 hover:text-color-1 transition-colors duration-150"
                aria-label="Decrease quantity"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="px-4 py-3 text-sm font-medium text-color-1 min-w-[40px] text-center">{quantity}</span>
              <button
                onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                className="p-3 text-color-2 hover:text-color-1 transition-colors duration-150"
                aria-label="Increase quantity"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <Button size="lg" onClick={handleAddToCart} disabled={product.stock === 0}>
              <ShoppingCart className="w-4 h-4" />
              {addedToCart ? 'Added to cart!' : 'Add to cart'}
            </Button>
            <button className="p-3 border-2 border-color-6 rounded-sm text-color-2 hover:text-color-4 hover:border-color-4 transition-all duration-150" aria-label="Add to wishlist">
              <Heart className="w-5 h-5" />
            </button>
          </div>

          {/* Features */}
          <div className="grid grid-cols-3 gap-4 pt-6 border-t border-color-6">
            <div className="text-center">
              <Truck className="w-5 h-5 text-color-3 mx-auto mb-2" aria-hidden="true" />
              <p className="text-xs text-color-2">Free delivery</p>
            </div>
            <div className="text-center">
              <Shield className="w-5 h-5 text-color-3 mx-auto mb-2" aria-hidden="true" />
              <p className="text-xs text-color-2">Authentic product</p>
            </div>
            <div className="text-center">
              <RefreshCw className="w-5 h-5 text-color-3 mx-auto mb-2" aria-hidden="true" />
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
                    <Button size="sm" onClick={() => addToCart(p)} aria-label={`Add ${p.title} to cart`}>
                      Add to cart
                    </Button>
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
