import { Link } from 'react-router-dom';
import { Trash2, Minus, Plus, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { Button, Card } from '../components/ui';

export function CartPage() {
  const { items, removeFromCart, updateQuantity, totalPrice, totalItems } = useCart();

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <div className="max-w-md mx-auto">
          <ShoppingBag className="w-16 h-16 text-color-6 mx-auto mb-6" aria-hidden="true" />
          <h1 className="text-2xl font-bold text-color-1 mb-3">Your cart is empty</h1>
          <p className="text-sm text-color-2 mb-6">Looks like you haven't added any products yet. Start shopping to fill your cart!</p>
          <Link to="/products"><Button size="lg">Browse products</Button></Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <nav className="flex items-center gap-2 text-sm text-color-2 mb-6" aria-label="Breadcrumb">
        <Link to="/" className="hover:text-color-4 transition-colors duration-150">Home</Link>
        <span>/</span>
        <span className="text-color-1 font-medium">Cart</span>
      </nav>

      <h1 className="text-2xl font-bold text-color-1 mb-8">Shopping cart ({totalItems} items)</h1>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Cart items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map(({ product, quantity }) => (
            <Card key={product.id} className="p-4">
              <div className="flex gap-4">
                <img src={product.images[0]} alt={product.title} className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-sm shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <Link to={`/products/${product.slug}`} className="text-sm font-semibold text-color-1 hover:text-color-4 transition-colors duration-150">
                        {product.title}
                      </Link>
                      <p className="text-xs text-color-2 mt-1">{product.category}</p>
                    </div>
                    <button
                      onClick={() => removeFromCart(product.id)}
                      className="p-2 text-color-2 hover:text-color-4 transition-colors duration-150 shrink-0"
                      aria-label={`Remove ${product.title} from cart`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center border border-color-6 rounded-sm">
                      <button
                        onClick={() => updateQuantity(product.id, quantity - 1)}
                        className="p-2 text-color-2 hover:text-color-1 transition-colors duration-150"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="px-3 text-sm font-medium text-color-1">{quantity}</span>
                      <button
                        onClick={() => updateQuantity(product.id, quantity + 1)}
                        className="p-2 text-color-2 hover:text-color-1 transition-colors duration-150"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                    <span className="text-base font-bold text-color-1">৳{product.price * quantity}</span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Order summary */}
        <div className="lg:col-span-1">
          <Card className="p-6 sticky top-24">
            <h2 className="text-lg font-bold text-color-1 mb-4">Order summary</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-color-2">
                <span>Subtotal ({totalItems} items)</span>
                <span>৳{totalPrice}</span>
              </div>
              <div className="flex justify-between text-color-2">
                <span>Delivery</span>
                <span>{totalPrice >= 2000 ? 'Free' : '৳120'}</span>
              </div>
              {totalPrice < 2000 && (
                <p className="text-xs text-color-3">Add ৳{2000 - totalPrice} more for free delivery!</p>
              )}
              <div className="border-t border-color-6 pt-3 flex justify-between font-bold text-color-1 text-base">
                <span>Total</span>
                <span>৳{totalPrice + (totalPrice >= 2000 ? 0 : 120)}</span>
              </div>
            </div>
            <Link to="/checkout" className="block mt-6">
              <Button className="w-full" size="lg">
                Proceed to checkout <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link to="/products" className="block mt-3 text-center text-sm text-color-4 hover:text-color-5 transition-colors duration-150">
              Continue shopping
            </Link>
          </Card>
        </div>
      </div>
    </div>
  );
}
