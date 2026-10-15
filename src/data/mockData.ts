export interface Product {
  id: string;
  title: string;
  slug: string;
  price: number;
  originalPrice?: number;
  description: string;
  shortDescription: string;
  images: string[];
  category: string;
  stock: number;
  rating: number;
  reviewCount: number;
  isFeatured: boolean;
  seoTitle: string;
  seoDescription: string;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  image: string;
  productCount: number;
}

export interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  address: string;
  items: { productId: string; title: string; quantity: number; price: number }[];
  total: number;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentMethod: string;
  createdAt: string;
}

export interface Banner {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  link: string;
  active: boolean;
  order: number;
}

export interface StoreSettings {
  storeName: string;
  logo: string;
  seoTitle: string;
  seoDescription: string;
  phone: string;
  email: string;
  address: string;
  facebook: string;
  instagram: string;
}

export const categories: Category[] = [
  { id: '1', name: 'Skincare', slug: 'skincare', image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=300&h=300&fit=crop', productCount: 24 },
  { id: '2', name: 'Makeup', slug: 'makeup', image: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=300&h=300&fit=crop', productCount: 18 },
  { id: '3', name: 'Haircare', slug: 'haircare', image: 'https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?w=300&h=300&fit=crop', productCount: 15 },
  { id: '4', name: 'Fragrance', slug: 'fragrance', image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=300&h=300&fit=crop', productCount: 12 },
  { id: '5', name: 'Body care', slug: 'body-care', image: 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=300&h=300&fit=crop', productCount: 20 },
  { id: '6', name: 'Tools', slug: 'tools', image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=300&h=300&fit=crop', productCount: 8 },
];

export const products: Product[] = [
  {
    id: '1', title: 'Rose glow serum', slug: 'rose-glow-serum', price: 1299, originalPrice: 1599,
    description: 'A luxurious rose-infused serum that hydrates and brightens your skin. Formulated with natural rose extracts and hyaluronic acid for a radiant, dewy complexion.',
    shortDescription: 'Hydrating rose serum with hyaluronic acid',
    images: ['https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&h=600&fit=crop'],
    category: 'Skincare', stock: 45, rating: 4.8, reviewCount: 124, isFeatured: true,
    seoTitle: 'Rose glow serum - natural skincare | Meili Beauty Shop', seoDescription: 'Shop our bestselling rose glow serum. Hydrates and brightens skin naturally.', createdAt: '2024-01-15'
  },
  {
    id: '2', title: 'Matte lip kit', slug: 'matte-lip-kit', price: 899, originalPrice: 1199,
    description: 'Long-lasting matte lip kit with 4 stunning shades. Creamy formula that stays put all day without drying your lips.',
    shortDescription: '4-shade matte lipstick collection',
    images: ['https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=600&h=600&fit=crop'],
    category: 'Makeup', stock: 78, rating: 4.6, reviewCount: 89, isFeatured: true,
    seoTitle: 'Matte lip kit - long lasting lipstick | Meili Beauty Shop', seoDescription: 'Get the perfect matte lips with our 4-shade lip kit.', createdAt: '2024-02-01'
  },
  {
    id: '3', title: 'Vitamin C brightening cream', slug: 'vitamin-c-brightening-cream', price: 1499,
    description: 'Powerful vitamin C cream that fades dark spots and evens skin tone. Enriched with antioxidants for youthful, glowing skin.',
    shortDescription: 'Brightening cream with vitamin C',
    images: ['https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?w=600&h=600&fit=crop'],
    category: 'Skincare', stock: 32, rating: 4.9, reviewCount: 201, isFeatured: true,
    seoTitle: 'Vitamin C brightening cream | Meili Beauty Shop', seoDescription: 'Fade dark spots and brighten skin with vitamin C cream.', createdAt: '2024-01-20'
  },
  {
    id: '4', title: 'Silk hair mask', slug: 'silk-hair-mask', price: 799, originalPrice: 999,
    description: 'Deep conditioning hair mask that repairs damage and adds silk-like smoothness. Perfect for dry, frizzy hair.',
    shortDescription: 'Deep conditioning repair hair mask',
    images: ['https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=600&h=600&fit=crop'],
    category: 'Haircare', stock: 56, rating: 4.7, reviewCount: 67, isFeatured: false,
    seoTitle: 'Silk hair mask - deep conditioning | Meili Beauty Shop', seoDescription: 'Repair damaged hair with our silk hair mask.', createdAt: '2024-02-10'
  },
  {
    id: '5', title: 'Floral eau de parfum', slug: 'floral-eau-de-parfum', price: 2499, originalPrice: 2999,
    description: 'An enchanting floral fragrance with notes of jasmine, peony, and sandalwood. Long-lasting and sophisticated.',
    shortDescription: 'Elegant floral perfume - jasmine & peony',
    images: ['https://images.unsplash.com/photo-1541643600914-78b084683601?w=600&h=600&fit=crop'],
    category: 'Fragrance', stock: 23, rating: 4.9, reviewCount: 156, isFeatured: true,
    seoTitle: 'Floral eau de parfum | Meili Beauty Shop', seoDescription: 'Discover our enchanting floral perfume.', createdAt: '2024-01-25'
  },
  {
    id: '6', title: 'Hydrating body lotion', slug: 'hydrating-body-lotion', price: 599,
    description: 'Lightweight yet deeply hydrating body lotion with shea butter and aloe vera. Absorbs quickly without greasy residue.',
    shortDescription: 'Lightweight hydrating body lotion',
    images: ['https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=600&h=600&fit=crop'],
    category: 'Body care', stock: 89, rating: 4.5, reviewCount: 43, isFeatured: false,
    seoTitle: 'Hydrating body lotion | Meili Beauty Shop', seoDescription: 'Keep your skin soft with our hydrating body lotion.', createdAt: '2024-02-05'
  },
  {
    id: '7', title: 'Jade face roller', slug: 'jade-face-roller', price: 1199, originalPrice: 1499,
    description: 'Authentic jade face roller for lymphatic drainage and de-puffing. Cools and soothes skin while promoting circulation.',
    shortDescription: 'Authentic jade face roller for skincare',
    images: ['https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=600&h=600&fit=crop'],
    category: 'Tools', stock: 34, rating: 4.4, reviewCount: 78, isFeatured: false,
    seoTitle: 'Jade face roller | Meili Beauty Shop', seoDescription: 'Natural jade face roller for facial massage.', createdAt: '2024-02-15'
  },
  {
    id: '8', title: 'Niacinamide pore minimizer', slug: 'niacinamide-pore-minimizer', price: 1099,
    description: '10% niacinamide serum that minimizes pores, controls oil, and smooths texture. Perfect for oily and combination skin.',
    shortDescription: '10% niacinamide pore control serum',
    images: ['https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&h=600&fit=crop'],
    category: 'Skincare', stock: 67, rating: 4.7, reviewCount: 145, isFeatured: true,
    seoTitle: 'Niacinamide pore minimizer | Meili Beauty Shop', seoDescription: 'Minimize pores with our niacinamide serum.', createdAt: '2024-01-30'
  },
  {
    id: '9', title: 'COSRX snail mucin essence', slug: 'cosrx-snail-mucin-essence', price: 1599, originalPrice: 1899,
    description: '96% snail secretion filtrate essence that hydrates, repairs, and revitalizes dull skin. A K-beauty cult favorite.',
    shortDescription: '96% snail mucin hydrating essence',
    images: ['https://images.unsplash.com/photo-1570194065650-d99fb4bedf0a?w=600&h=600&fit=crop'],
    category: 'K-Beauty', stock: 42, rating: 4.9, reviewCount: 312, isFeatured: true,
    seoTitle: 'COSRX snail mucin essence | Meili Beauty Shop', seoDescription: 'K-beauty favorite snail mucin essence for glowing skin.', createdAt: '2024-02-20'
  },
  {
    id: '10', title: 'Laneige lip sleeping mask', slug: 'laneige-lip-sleeping-mask', price: 1299, originalPrice: 1599,
    description: 'Overnight lip mask with vitamin C and antioxidants. Wake up with soft, supple lips. Bestselling K-beauty lip care.',
    shortDescription: 'Overnight lip mask with vitamin C',
    images: ['https://images.unsplash.com/photo-1599305090598-fe179d501227?w=600&h=600&fit=crop'],
    category: 'K-Beauty', stock: 58, rating: 4.8, reviewCount: 245, isFeatured: true,
    seoTitle: 'Laneige lip sleeping mask | Meili Beauty Shop', seoDescription: 'Wake up with soft lips using Laneige lip sleeping mask.', createdAt: '2024-02-18'
  },
  {
    id: '11', title: 'Beauty of Joseon sunscreen', slug: 'beauty-of-joseon-sunscreen', price: 999, originalPrice: 1299,
    description: 'Lightweight Korean sunscreen with rice extract and probiotics. SPF50+ PA++++ protection without white cast.',
    shortDescription: 'Rice extract SPF50+ Korean sunscreen',
    images: ['https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=600&h=600&fit=crop'],
    category: 'K-Beauty', stock: 73, rating: 4.9, reviewCount: 189, isFeatured: true,
    seoTitle: 'Beauty of Joseon sunscreen | Meili Beauty Shop', seoDescription: 'Lightweight Korean sunscreen with no white cast.', createdAt: '2024-02-22'
  },
  {
    id: '12', title: 'Innisfree green tea serum', slug: 'innisfree-green-tea-serum', price: 1199,
    description: 'Hydrating serum with Jeju green tea extract. Rich in antioxidants to soothe and protect skin from environmental damage.',
    shortDescription: 'Jeju green tea hydrating serum',
    images: ['https://images.unsplash.com/photo-1608248597279-f99d1ecb0cd2?w=600&h=600&fit=crop'],
    category: 'K-Beauty', stock: 36, rating: 4.6, reviewCount: 98, isFeatured: false,
    seoTitle: 'Innisfree green tea serum | Meili Beauty Shop', seoDescription: 'Hydrate with Jeju green tea serum.', createdAt: '2024-02-25'
  },
];

export const banners: Banner[] = [
  { id: '1', title: 'Summer glow collection', subtitle: 'Up to 40% off on selected items', image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=1200&h=400&fit=crop', link: '/products', active: true, order: 1 },
  { id: '2', title: 'New arrivals', subtitle: 'Discover the latest in beauty', image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=1200&h=400&fit=crop', link: '/products', active: true, order: 2 },
];

export const orders: Order[] = [
  { id: 'ORD-001', customerName: 'Ayesha Rahman', customerEmail: 'ayesha@email.com', customerPhone: '+880171234567', address: '123 Green Road, Dhaka', items: [{ productId: '1', title: 'Rose glow serum', quantity: 2, price: 1299 }], total: 2598, status: 'pending', paymentMethod: 'Cash on delivery', createdAt: '2024-03-01' },
  { id: 'ORD-002', customerName: 'Fatima Khan', customerEmail: 'fatima@email.com', customerPhone: '+880171234568', address: '456 Mirpur Road, Dhaka', items: [{ productId: '5', title: 'Floral eau de parfum', quantity: 1, price: 2499 }, { productId: '3', title: 'Vitamin C brightening cream', quantity: 1, price: 1499 }], total: 3998, status: 'confirmed', paymentMethod: 'Cash on delivery', createdAt: '2024-03-02' },
  { id: 'ORD-003', customerName: 'Nadia Islam', customerEmail: 'nadia@email.com', customerPhone: '+880171234569', address: '789 Gulshan Avenue, Dhaka', items: [{ productId: '2', title: 'Matte lip kit', quantity: 3, price: 899 }], total: 2697, status: 'processing', paymentMethod: 'Cash on delivery', createdAt: '2024-03-03' },
  { id: 'ORD-004', customerName: 'Sara Ahmed', customerEmail: 'sara@email.com', customerPhone: '+880171234570', address: '321 Banani, Dhaka', items: [{ productId: '7', title: 'Jade face roller', quantity: 1, price: 1199 }], total: 1199, status: 'shipped', paymentMethod: 'Cash on delivery', createdAt: '2024-03-04' },
  { id: 'ORD-005', customerName: 'Rina Akter', customerEmail: 'rina@email.com', customerPhone: '+880171234571', address: '654 Dhanmondi, Dhaka', items: [{ productId: '4', title: 'Silk hair mask', quantity: 2, price: 799 }], total: 1598, status: 'delivered', paymentMethod: 'Cash on delivery', createdAt: '2024-02-28' },
];

export const storeSettings: StoreSettings = {
  storeName: 'Meili Beauty Shop',
  logo: '✨',
  seoTitle: 'Meili Beauty Shop - Premium beauty & skincare products',
  seoDescription: 'Shop the best beauty and skincare products at Meili Beauty Shop. Free delivery on orders above ৳2000.',
  phone: '+8801965480023',
  email: 'meilibeautybd@gmail.com',
  address: 'Mohammadpur, Dhaka, Bangladesh',
  facebook: 'https://facebook.com/meilibeauty',
  instagram: 'https://instagram.com/meilibeauty',
};
