import { supabase, isSupabaseConfigured } from './supabase';
import type { Product, Category, Order, Banner, StoreSettings } from '../data/mockData';

// Check if Supabase is configured
const checkConfig = () => {
  if (!isSupabaseConfigured()) {
    console.warn('⚠️ Supabase not configured. Using mock data.');
    return false;
  }
  return true;
};

// ============ PRODUCTS ============

export async function fetchProducts(): Promise<Product[]> {
  if (!checkConfig()) return [];

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
    return [];
  }

  // Transform to match our Product type
  return data.map((p: any) => ({
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
    sections: p.product_sections?.map((ps: any) => ps.sections.name) || [],
    seoTitle: p.seo_title,
    seoDescription: p.seo_description,
    createdAt: p.created_at,
  }));
}

export async function createProduct(product: Partial<Product>): Promise<Product | null> {
  if (!checkConfig()) return null;

  const { data, error } = await supabase
    .from('products')
    .insert({
      title: product.title,
      slug: product.slug,
      price: product.price,
      original_price: product.originalPrice,
      description: product.description,
      short_description: product.shortDescription,
      category: product.category,
      stock: product.stock,
      is_featured: product.isFeatured,
      seo_title: product.seoTitle,
      seo_description: product.seoDescription,
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating product:', error);
    return null;
  }

  // Insert images
  if (product.images && product.images.length > 0) {
    await supabase.from('product_images').insert(
      product.images.map((url, index) => ({
        product_id: data.id,
        image_url: url,
        sort_order: index,
      }))
    );
  }

  // Insert sections
  if (product.sections && product.sections.length > 0) {
    const sectionIds = await getSectionIds(product.sections);
    await supabase.from('product_sections').insert(
      sectionIds.map(sectionId => ({
        product_id: data.id,
        section_id: sectionId,
      }))
    );
  }

  return data;
}

export async function updateProduct(id: string, product: Partial<Product>): Promise<boolean> {
  if (!checkConfig()) return false;

  const { error } = await supabase
    .from('products')
    .update({
      title: product.title,
      slug: product.slug,
      price: product.price,
      original_price: product.originalPrice,
      description: product.description,
      short_description: product.shortDescription,
      category: product.category,
      stock: product.stock,
      is_featured: product.isFeatured,
      seo_title: product.seoTitle,
      seo_description: product.seoDescription,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id);

  if (error) {
    console.error('Error updating product:', error);
    return false;
  }

  // Update images (delete old, insert new)
  if (product.images) {
    await supabase.from('product_images').delete().eq('product_id', id);
    if (product.images.length > 0) {
      await supabase.from('product_images').insert(
        product.images.map((url, index) => ({
          product_id: id,
          image_url: url,
          sort_order: index,
        }))
      );
    }
  }

  // Update sections
  if (product.sections) {
    await supabase.from('product_sections').delete().eq('product_id', id);
    const sectionIds = await getSectionIds(product.sections);
    if (sectionIds.length > 0) {
      await supabase.from('product_sections').insert(
        sectionIds.map(sectionId => ({
          product_id: id,
          section_id: sectionId,
        }))
      );
    }
  }

  return true;
}

export async function deleteProduct(id: string): Promise<boolean> {
  if (!checkConfig()) return false;

  const { error } = await supabase.from('products').delete().eq('id', id);

  if (error) {
    console.error('Error deleting product:', error);
    return false;
  }

  return true;
}

// ============ CATEGORIES ============

export async function fetchCategories(): Promise<Category[]> {
  if (!checkConfig()) return [];

  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('sort_order');

  if (error) {
    console.error('Error fetching categories:', error);
    return [];
  }

  return data;
}

export async function createCategory(category: Partial<Category>): Promise<Category | null> {
  if (!checkConfig()) return null;

  const { data, error } = await supabase
    .from('categories')
    .insert({
      name: category.name,
      slug: category.slug,
      image: category.image,
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating category:', error);
    return null;
  }

  return data;
}

export async function updateCategory(id: string, category: Partial<Category>): Promise<boolean> {
  if (!checkConfig()) return false;

  const { error } = await supabase
    .from('categories')
    .update({
      name: category.name,
      slug: category.slug,
      image: category.image,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id);

  if (error) {
    console.error('Error updating category:', error);
    return false;
  }

  return true;
}

export async function deleteCategory(id: string): Promise<boolean> {
  if (!checkConfig()) return false;

  const { error } = await supabase.from('categories').delete().eq('id', id);

  if (error) {
    console.error('Error deleting category:', error);
    return false;
  }

  return true;
}

// ============ ORDERS ============

export async function fetchOrders(): Promise<Order[]> {
  if (!checkConfig()) return [];

  const { data, error } = await supabase
    .from('orders')
    .select(`
      *,
      order_items(*)
    `)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching orders:', error);
    return [];
  }

  return data.map((o: any) => ({
    id: o.id,
    customerName: o.customer_name,
    customerEmail: o.customer_email,
    customerPhone: o.customer_phone,
    address: o.address,
    items: o.order_items || [],
    total: o.total,
    status: o.status,
    paymentMethod: o.payment_method,
    createdAt: o.created_at,
  }));
}

export async function createOrder(order: Partial<Order>): Promise<Order | null> {
  if (!checkConfig()) return null;

  const { data, error } = await supabase
    .from('orders')
    .insert({
      customer_name: order.customerName,
      customer_email: order.customerEmail,
      customer_phone: order.customerPhone,
      address: order.address,
      total: order.total,
      status: 'pending',
      payment_method: order.paymentMethod || 'Cash on delivery',
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating order:', error);
    return null;
  }

  // Insert order items
  if (order.items && order.items.length > 0) {
    await supabase.from('order_items').insert(
      order.items.map(item => ({
        order_id: data.id,
        product_id: item.productId,
        title: item.title,
        quantity: item.quantity,
        price: item.price,
      }))
    );
  }

  return data;
}

export async function updateOrderStatus(id: string, status: string): Promise<boolean> {
  if (!checkConfig()) return false;

  const { error } = await supabase
    .from('orders')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', id);

  if (error) {
    console.error('Error updating order status:', error);
    return false;
  }

  return true;
}

// ============ BANNERS ============

export async function fetchBanners(): Promise<Banner[]> {
  if (!checkConfig()) return [];

  const { data, error } = await supabase
    .from('banners')
    .select('*')
    .order('sort_order');

  if (error) {
    console.error('Error fetching banners:', error);
    return [];
  }

  return data;
}

export async function createBanner(banner: Partial<Banner>): Promise<Banner | null> {
  if (!checkConfig()) return null;

  const { data, error } = await supabase
    .from('banners')
    .insert({
      title: banner.title,
      subtitle: banner.subtitle,
      image: banner.image,
      link: banner.link,
      active: banner.active ?? true,
      sort_order: banner.order,
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating banner:', error);
    return null;
  }

  return data;
}

export async function updateBanner(id: string, banner: Partial<Banner>): Promise<boolean> {
  if (!checkConfig()) return false;

  const { error } = await supabase
    .from('banners')
    .update({
      title: banner.title,
      subtitle: banner.subtitle,
      image: banner.image,
      link: banner.link,
      active: banner.active,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id);

  if (error) {
    console.error('Error updating banner:', error);
    return false;
  }

  return true;
}

export async function deleteBanner(id: string): Promise<boolean> {
  if (!checkConfig()) return false;

  const { error } = await supabase.from('banners').delete().eq('id', id);

  if (error) {
    console.error('Error deleting banner:', error);
    return false;
  }

  return true;
}

// ============ STORE SETTINGS ============

export async function fetchStoreSettings(): Promise<StoreSettings | null> {
  if (!checkConfig()) return null;

  const { data, error } = await supabase
    .from('store_settings')
    .select('*')
    .single();

  if (error) {
    console.error('Error fetching store settings:', error);
    return null;
  }

  return data;
}

export async function updateStoreSettings(settings: Partial<StoreSettings>): Promise<boolean> {
  if (!checkConfig()) return false;

  const { error } = await supabase
    .from('store_settings')
    .update({
      store_name: settings.storeName,
      logo: settings.logo,
      seo_title: settings.seoTitle,
      seo_description: settings.seoDescription,
      phone: settings.phone,
      email: settings.email,
      address: settings.address,
      facebook: settings.facebook,
      instagram: settings.instagram,
      updated_at: new Date().toISOString(),
    })
    .eq('id', 1); // Assuming single row with id=1

  if (error) {
    console.error('Error updating store settings:', error);
    return false;
  }

  return true;
}

// ============ HELPERS ============

async function getSectionIds(sectionNames: string[]): Promise<string[]> {
  const { data, error } = await supabase
    .from('sections')
    .select('id, name')
    .in('name', sectionNames);

  if (error) {
    console.error('Error fetching section IDs:', error);
    return [];
  }

  return data.map((s: any) => s.id);
}

// ============ AUTH ============

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    console.error('Sign in error:', error);
    return { success: false, error: error.message };
  }

  return { success: true, data };
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) {
    console.error('Sign out error:', error);
    return { success: false, error: error.message };
  }
  return { success: true };
}

export async function getCurrentUser() {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}
