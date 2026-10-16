import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CheckCircle, ArrowLeft } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { Button, Card, Input } from '../components/ui';

export function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', address: '', city: '', notes: '',
  });

  const deliveryFee = totalPrice >= 2000 ? 0 : 120;
  const grandTotal = totalPrice + deliveryFee;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    clearCart();
  };

  if (items.length === 0 && !isSubmitted) {
    navigate('/cart');
    return null;
  }

  if (isSubmitted) {
    return (
      <div className="max-w-lg mx-auto px-4 py-12 text-center">
        <CheckCircle className="w-16 h-16 text-color-3 mx-auto mb-6" aria-hidden="true" />
        <h1 className="text-2xl font-bold text-color-1 mb-3">Order placed successfully!</h1>
        <p className="text-sm text-color-2 mb-2">Thank you for your order. We'll contact you shortly to confirm.</p>
        <p className="text-sm text-color-2 mb-6">Payment method: Cash on delivery</p>
        <div className="bg-color-7 rounded-sm p-4 mb-6">
          <p className="text-sm font-medium text-color-1">Order ID: #ORD-{Math.random().toString(36).substr(2, 6).toUpperCase()}</p>
          <p className="text-sm text-color-2 mt-1">Total: ৳{grandTotal}</p>
        </div>
        <Link to="/"><Button size="lg">Continue shopping</Button></Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link to="/cart" className="inline-flex items-center gap-2 text-sm text-color-2 hover:text-color-4 transition-colors duration-150 mb-6">
        <ArrowLeft className="w-4 h-4" /> Back to cart
      </Link>

      <h1 className="text-2xl font-bold text-color-1 mb-8">Checkout</h1>

      <form onSubmit={handleSubmit}>
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="p-6">
              <h2 className="text-lg font-bold text-color-1 mb-4">Delivery information</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <Input
                  label="Full name"
                  required
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Your full name"
                />
                <Input
                  label="Email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  placeholder="your@email.com"
                />
                <Input
                  label="Phone number"
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={e => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+880 1XXX XXX XXX"
                />
                <Input
                  label="City"
                  required
                  value={formData.city}
                  onChange={e => setFormData({ ...formData, city: e.target.value })}
                  placeholder="Your city"
                />
                <div className="sm:col-span-2">
                  <Input
                    label="Delivery address"
                    required
                    value={formData.address}
                    onChange={e => setFormData({ ...formData, address: e.target.value })}
                    placeholder="House no, road, area"
                  />
                </div>
                <div className="sm:col-span-2">
                  <Input
                    label="Order notes (optional)"
                    value={formData.notes}
                    onChange={e => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="Any special instructions"
                  />
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="text-lg font-bold text-color-1 mb-4">Payment method</h2>
              <div className="flex items-center gap-3 p-4 bg-color-7 rounded-sm border-2 border-color-3">
                <div className="w-5 h-5 bg-color-3 rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-color-8 rounded-full" />
                </div>
                <div>
                  <p className="text-sm font-medium text-color-1">Cash on delivery</p>
                  <p className="text-xs text-color-2">Pay when you receive your order</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-24">
              <h2 className="text-lg font-bold text-color-1 mb-4">Order summary</h2>
              <div className="space-y-3 mb-4">
                {items.map(({ product, quantity }) => (
                  <div key={product.id} className="flex justify-between text-sm">
                    <span className="text-color-2">{product.title} × {quantity}</span>
                    <span className="text-color-1 font-medium">৳{product.price * quantity}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-color-6 pt-3 space-y-2 text-sm">
                <div className="flex justify-between text-color-2">
                  <span>Subtotal</span>
                  <span>৳{totalPrice}</span>
                </div>
                <div className="flex justify-between text-color-2">
                  <span>Delivery</span>
                  <span>{deliveryFee === 0 ? 'Free' : `৳${deliveryFee}`}</span>
                </div>
                <div className="flex justify-between font-bold text-color-1 text-base pt-2 border-t border-color-6">
                  <span>Total</span>
                  <span>৳{grandTotal}</span>
                </div>
              </div>
              <Button type="submit" className="w-full mt-6" size="lg">
                Place order
              </Button>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
}
