import { useState, useEffect } from 'react';
import { Plus, Search, Edit2, Trash2, Eye, Tag, AlertCircle, Loader2 } from 'lucide-react';
import { Product, categories } from '../../data/mockData';
import { Button, Card, Input, Badge, Modal, Select, Textarea } from '../../components/ui';
import { ImageUpload } from '../../components/admin/ImageUpload';
import { isSupabaseConfigured } from '../../lib/supabase';
import * as api from '../../lib/api';

type SectionKey = 'best-deals' | 'k-beauty' | 'your-pick' | 'for-you';

const SECTION_OPTIONS: { key: SectionKey; label: string; description: string }[] = [
  { key: 'best-deals', label: 'Best deals', description: 'Products with discounts' },
  { key: 'k-beauty', label: 'K-Beauty', description: 'Korean beauty products' },
  { key: 'your-pick', label: 'Your pick', description: 'Handpicked by our team' },
  { key: 'for-you', label: 'For you', description: 'Recommended products' },
];

export function ProductsAdminPage() {
  const [productsList, setProductsList] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    title: '', price: '', originalPrice: '', description: '', shortDescription: '',
    category: 'Skincare', stock: '', isFeatured: false,
    seoTitle: '', seoDescription: '',
    images: [''] as string[],
    sections: [] as SectionKey[],
  });

  // Load products from Supabase on mount
  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    setLoading(true);
    setError(null);
    
    if (!isSupabaseConfigured()) {
      console.error('❌ Supabase not configured!');
      setError('Supabase is not configured. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in Vercel environment variables.');
      setProductsList([]);
      setLoading(false);
      return;
    }

    try {
      console.log('🔄 Loading products from Supabase...');
      const products = await api.fetchProducts();
      console.log('✅ Products loaded:', products.length);
      
      // Always use database data, even if empty
      setProductsList(products);
      
      if (products.length === 0) {
        console.log('ℹ️ No products in database yet. You can add some!');
      }
    } catch (err: any) {
      console.error('❌ Failed to load products:', err);
      setError(`Failed to load products: ${err.message || 'Unknown error'}. Check browser console and Supabase logs.`);
      setProductsList([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = productsList.filter(p =>
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const openAddModal = () => {
    setEditingProduct(null);
    setFormData({
      title: '', price: '', originalPrice: '', description: '', shortDescription: '',
      category: 'Skincare', stock: '', isFeatured: false,
      seoTitle: '', seoDescription: '',
      images: [''],
      sections: [],
    });
    setError(null);
    setIsModalOpen(true);
  };

  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      title: product.title, price: product.price.toString(),
      originalPrice: product.originalPrice?.toString() || '',
      description: product.description, shortDescription: product.shortDescription,
      category: product.category, stock: product.stock.toString(), isFeatured: product.isFeatured,
      seoTitle: product.seoTitle, seoDescription: product.seoDescription,
      images: product.images.length > 0 ? product.images : [''],
      sections: product.sections || [],
    });
    setError(null);
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    if (!formData.title || !formData.price) {
      setError('Please fill in required fields: title and price');
      return;
    }

    if (!isSupabaseConfigured()) {
      setError('Supabase is not configured. Cannot save product.');
      return;
    }

    setSaving(true);
    setError(null);
    setSuccessMessage(null);

    const productData: Partial<Product> = {
      title: formData.title,
      slug: formData.title.toLowerCase().replace(/\s+/g, '-'),
      price: Number(formData.price),
      originalPrice: formData.originalPrice ? Number(formData.originalPrice) : undefined,
      description: formData.description,
      shortDescription: formData.shortDescription,
      category: formData.category,
      stock: Number(formData.stock) || 0,
      isFeatured: formData.isFeatured,
      seoTitle: formData.seoTitle,
      seoDescription: formData.seoDescription,
      images: formData.images.filter(img => img.trim() !== ''),
      sections: formData.sections,
    };

    console.log('💾 Saving product:', productData);

    // Save to Supabase
    try {
      let result;
      if (editingProduct) {
        console.log('🔄 Updating product:', editingProduct.id);
        result = await api.updateProduct(editingProduct.id, productData);
      } else {
        console.log('🔄 Creating new product');
        result = await api.createProduct(productData);
      }

      if (result) {
        console.log('✅ Product saved successfully:', result);
        setSuccessMessage(editingProduct ? 'Product updated successfully!' : 'Product added successfully!');
        setIsModalOpen(false);
        // Reload products to get fresh data
        await loadProducts();
      } else {
        console.error('❌ Save returned null/undefined');
        setError('Failed to save product. Check browser console and Supabase logs for details.');
      }
    } catch (err: any) {
      console.error('❌ Save error:', err);
      const errorMessage = err.message || 'Failed to save product';
      
      // Check for common errors
      if (errorMessage.includes('relation') && errorMessage.includes('does not exist')) {
        setError('Database tables not found. Please run the SQL schema in Supabase SQL Editor first.');
      } else if (errorMessage.includes('new row violates row-level security')) {
        setError('Permission denied. Make sure your user has admin role in the profiles table. Run: update public.profiles set role = \'admin\' where email = \'YOUR_EMAIL\';');
      } else if (errorMessage.includes('duplicate key')) {
        setError('A product with this slug already exists. Please use a different title.');
      } else {
        setError(`Failed to save: ${errorMessage}`);
      }
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    if (!isSupabaseConfigured()) {
      setError('Supabase is not configured. Cannot delete product.');
      return;
    }

    try {
      const success = await api.deleteProduct(id);
      if (success) {
        setSuccessMessage('Product deleted successfully!');
        await loadProducts();
      } else {
        setError('Failed to delete product');
      }
    } catch (err: any) {
      console.error('Delete error:', err);
      setError(`Failed to delete: ${err.message}`);
    }
  };

  const toggleSection = (section: SectionKey) => {
    const newSections = formData.sections.includes(section)
      ? formData.sections.filter(s => s !== section)
      : [...formData.sections, section];
    setFormData({ ...formData, sections: newSections });
  };

  // Clear messages after 5 seconds
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 text-color-3 animate-spin" />
        <span className="ml-3 text-color-2">Loading products...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-color-1">Products</h1>
          <p className="text-sm text-color-2 mt-1">
            {productsList.length} products in your store
          </p>
        </div>
        <Button onClick={openAddModal}><Plus className="w-4 h-4" /> Add product</Button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-sm p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm text-red-800">{error}</p>
            <button
              onClick={() => setError(null)}
              className="text-xs text-red-600 hover:text-red-800 mt-2 underline"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {successMessage && (
        <div className="bg-green-50 border border-green-200 rounded-sm p-4 flex items-center gap-3">
          <span className="text-green-600">✓</span>
          <p className="text-sm text-green-800">{successMessage}</p>
        </div>
      )}

      {/* Search */}
      <Card className="p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-color-2" />
          <input
            type="search"
            placeholder="Search products..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm bg-color-7 border border-color-6 rounded-sm focus:border-color-3 focus:ring-2 focus:ring-color-3/20 transition-all duration-150 text-color-1"
          />
        </div>
      </Card>

      {/* Products table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-color-7 border-b border-color-6">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-color-2">Product</th>
                <th className="text-left px-4 py-3 font-medium text-color-2">Category</th>
                <th className="text-left px-4 py-3 font-medium text-color-2">Price</th>
                <th className="text-left px-4 py-3 font-medium text-color-2">Stock</th>
                <th className="text-left px-4 py-3 font-medium text-color-2">Sections</th>
                <th className="text-right px-4 py-3 font-medium text-color-2">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-color-6">
              {filteredProducts.map(product => (
                <tr key={product.id} className="hover:bg-color-7/50 transition-colors duration-150">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <img src={product.images[0]} alt={product.title} className="w-10 h-10 rounded-sm object-cover" />
                      <div>
                        <p className="font-medium text-color-1">{product.title}</p>
                        <p className="text-xs text-color-2">{product.images.length} image{product.images.length !== 1 ? 's' : ''}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-color-2">{product.category}</td>
                  <td className="px-4 py-3">
                    <span className="font-medium text-color-1">৳{product.price}</span>
                    {product.originalPrice && <span className="text-xs text-color-2 line-through ml-2">৳{product.originalPrice}</span>}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`font-medium ${product.stock < 20 ? 'text-red-600' : product.stock < 40 ? 'text-yellow-600' : 'text-green-600'}`}>
                      {product.stock}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {product.sections && product.sections.length > 0 ? product.sections.map(s => (
                        <span key={s} className="text-xs bg-color-6 text-color-1 px-2 py-0.5 rounded-sm">
                          {SECTION_OPTIONS.find(o => o.key === s)?.label}
                        </span>
                      )) : <span className="text-xs text-color-2">—</span>}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-2 text-color-2 hover:text-color-3 transition-colors duration-150" aria-label={`View ${product.title}`}><Eye className="w-4 h-4" /></button>
                      <button onClick={() => openEditModal(product)} className="p-2 text-color-2 hover:text-color-4 transition-colors duration-150" aria-label={`Edit ${product.title}`}><Edit2 className="w-4 h-4" /></button>
                      <button onClick={() => handleDelete(product.id)} className="p-2 text-color-2 hover:text-red-600 transition-colors duration-150" aria-label={`Delete ${product.title}`}><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Add/Edit modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingProduct ? 'Edit product' : 'Add new product'}>
        <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-sm p-3">
              <p className="text-xs text-red-800">{error}</p>
            </div>
          )}
          
          <Input label="Product title *" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} placeholder="e.g. Rose glow serum" />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Price (৳) *" type="number" value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} placeholder="1299" />
            <Input label="Original price (৳)" type="number" value={formData.originalPrice} onChange={e => setFormData({ ...formData, originalPrice: e.target.value })} placeholder="1599 (optional)" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Select label="Category" value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} options={categories.map(c => ({ value: c.name, label: c.name }))} />
            <Input label="Stock quantity" type="number" value={formData.stock} onChange={e => setFormData({ ...formData, stock: e.target.value })} placeholder="50" />
          </div>
          <Input label="Short description" value={formData.shortDescription} onChange={e => setFormData({ ...formData, shortDescription: e.target.value })} placeholder="Brief product description" />
          <Textarea label="Full description" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} placeholder="Detailed product description..." />
          <div className="flex items-center gap-2">
            <input type="checkbox" id="featured" checked={formData.isFeatured} onChange={e => setFormData({ ...formData, isFeatured: e.target.checked })} className="w-4 h-4 accent-color-4" />
            <label htmlFor="featured" className="text-sm text-color-1">Mark as featured product</label>
          </div>

          {/* Images section */}
          <div className="border-t border-color-6 pt-4">
            <ImageUpload
              images={formData.images}
              onChange={(images) => setFormData({ ...formData, images })}
              maxImages={10}
            />
          </div>

          {/* Homepage sections */}
          <div className="border-t border-color-6 pt-4">
            <h3 className="text-sm font-medium text-color-1 flex items-center gap-2 mb-3">
              <Tag className="w-4 h-4" /> Homepage sections
            </h3>
            <p className="text-xs text-color-2 mb-3">Select which homepage sections this product should appear in.</p>
            <div className="grid grid-cols-2 gap-2">
              {SECTION_OPTIONS.map(section => {
                const isSelected = formData.sections.includes(section.key);
                return (
                  <button
                    key={section.key}
                    type="button"
                    onClick={() => toggleSection(section.key)}
                    className={`text-left p-3 rounded-sm border-2 transition-all duration-150 ${
                      isSelected
                        ? 'border-color-4 bg-color-4/10'
                        : 'border-color-6 hover:border-color-4/50 bg-color-8'
                    }`}
                    aria-pressed={isSelected}
                  >
                    <div className="flex items-center gap-2">
                      <div className={`w-4 h-4 rounded-sm border-2 flex items-center justify-center ${isSelected ? 'bg-color-4 border-color-4' : 'border-color-6'}`}>
                        {isSelected && <span className="text-color-8 text-xs">✓</span>}
                      </div>
                      <span className={`text-sm font-medium ${isSelected ? 'text-color-1' : 'text-color-2'}`}>
                        {section.label}
                      </span>
                    </div>
                    <p className="text-xs text-color-2 mt-1 ml-6">{section.description}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* SEO settings */}
          <div className="border-t border-color-6 pt-4">
            <h3 className="text-sm font-medium text-color-1 mb-3">SEO settings</h3>
            <Input label="SEO title" value={formData.seoTitle} onChange={e => setFormData({ ...formData, seoTitle: e.target.value })} placeholder="Page title for search engines" />
            <div className="mt-4">
              <Textarea label="SEO description" value={formData.seoDescription} onChange={e => setFormData({ ...formData, seoDescription: e.target.value })} placeholder="Meta description for search engines" />
            </div>
          </div>

          <div className="flex gap-3 pt-4 sticky bottom-0 bg-color-8 pb-2">
            <Button onClick={handleSave} className="flex-1" loading={saving} disabled={saving}>
              {saving ? 'Saving...' : (editingProduct ? 'Save changes' : 'Add product')}
            </Button>
            <Button variant="ghost" onClick={() => setIsModalOpen(false)} disabled={saving}>Cancel</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
