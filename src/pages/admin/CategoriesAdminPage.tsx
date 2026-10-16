import { useState } from 'react';
import { Plus, Edit2, Trash2, GripVertical } from 'lucide-react';
import { categories as initialCategories, Category } from '../../data/mockData';
import { Button, Card, Input, Modal } from '../../components/ui';

export function CategoriesAdminPage() {
  const [categoriesList, setCategoriesList] = useState<Category[]>(initialCategories);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState({ name: '', image: '' });

  const openAddModal = () => {
    setEditingCategory(null);
    setFormData({ name: '', image: '' });
    setIsModalOpen(true);
  };

  const openEditModal = (cat: Category) => {
    setEditingCategory(cat);
    setFormData({ name: cat.name, image: cat.image });
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (editingCategory) {
      setCategoriesList(prev => prev.map(c => c.id === editingCategory.id ? { ...c, name: formData.name, slug: formData.name.toLowerCase().replace(/\s+/g, '-'), image: formData.image || c.image } : c));
    } else {
      const newCat: Category = {
        id: Date.now().toString(), name: formData.name, slug: formData.name.toLowerCase().replace(/\s+/g, '-'),
        image: formData.image || 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=300&h=300&fit=crop', productCount: 0,
      };
      setCategoriesList(prev => [...prev, newCat]);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('Delete this category?')) setCategoriesList(prev => prev.filter(c => c.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-color-1">Categories</h1>
          <p className="text-sm text-color-2 mt-1">Organize your products into categories</p>
        </div>
        <Button onClick={openAddModal}><Plus className="w-4 h-4" /> Add category</Button>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {categoriesList.map(cat => (
          <Card key={cat.id} className="p-4 flex items-center gap-4">
            <GripVertical className="w-4 h-4 text-color-6 cursor-grab" aria-hidden="true" />
            <img src={cat.image} alt={cat.name} className="w-12 h-12 rounded-full object-cover" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-color-1 truncate">{cat.name}</p>
              <p className="text-xs text-color-2">{cat.productCount} products</p>
            </div>
            <div className="flex items-center gap-1">
              <button onClick={() => openEditModal(cat)} className="p-2 text-color-2 hover:text-color-4 transition-colors duration-150" aria-label={`Edit ${cat.name}`}><Edit2 className="w-4 h-4" /></button>
              <button onClick={() => handleDelete(cat.id)} className="p-2 text-color-2 hover:text-red-600 transition-colors duration-150" aria-label={`Delete ${cat.name}`}><Trash2 className="w-4 h-4" /></button>
            </div>
          </Card>
        ))}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingCategory ? 'Edit category' : 'Add category'}>
        <div className="space-y-4">
          <Input label="Category name" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} placeholder="e.g. Skincare" />
          <Input label="Image URL" value={formData.image} onChange={e => setFormData({ ...formData, image: e.target.value })} placeholder="https://..." />
          <div className="flex gap-3 pt-4">
            <Button onClick={handleSave} className="flex-1">{editingCategory ? 'Save changes' : 'Add category'}</Button>
            <Button variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
