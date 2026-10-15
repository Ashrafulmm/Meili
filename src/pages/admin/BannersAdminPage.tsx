import { useState } from 'react';
import { Plus, Edit2, Trash2, Eye, EyeOff } from 'lucide-react';
import { banners as initialBanners, Banner } from '../../data/mockData';
import { Button, Card, Input, Modal } from '../../components/ui';

export function BannersAdminPage() {
  const [bannersList, setBannersList] = useState<Banner[]>(initialBanners);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
  const [formData, setFormData] = useState({ title: '', subtitle: '', image: '', link: '' });

  const openAddModal = () => {
    setEditingBanner(null);
    setFormData({ title: '', subtitle: '', image: '', link: '' });
    setIsModalOpen(true);
  };

  const openEditModal = (banner: Banner) => {
    setEditingBanner(banner);
    setFormData({ title: banner.title, subtitle: banner.subtitle, image: banner.image, link: banner.link });
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (editingBanner) {
      setBannersList(prev => prev.map(b => b.id === editingBanner.id ? { ...b, ...formData } : b));
    } else {
      const newBanner: Banner = {
        id: Date.now().toString(), ...formData, active: true, order: bannersList.length + 1,
      };
      setBannersList(prev => [...prev, newBanner]);
    }
    setIsModalOpen(false);
  };

  const toggleActive = (id: string) => {
    setBannersList(prev => prev.map(b => b.id === id ? { ...b, active: !b.active } : b));
  };

  const handleDelete = (id: string) => {
    if (confirm('Delete this banner?')) setBannersList(prev => prev.filter(b => b.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-color-1">Banners</h1>
          <p className="text-sm text-color-2 mt-1">Manage homepage banners and promotions</p>
        </div>
        <Button onClick={openAddModal}><Plus className="w-4 h-4" /> Add banner</Button>
      </div>

      <div className="space-y-4">
        {bannersList.map(banner => (
          <Card key={banner.id} className="p-4 flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <img src={banner.image} alt={banner.title} className="w-full sm:w-32 h-20 object-cover rounded-sm" />
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium text-color-1">{banner.title}</p>
                {!banner.active && <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-sm">Hidden</span>}
              </div>
              <p className="text-xs text-color-2 mt-1">{banner.subtitle}</p>
              <p className="text-xs text-color-2 mt-1">Link: {banner.link}</p>
            </div>
            <div className="flex items-center gap-1">
              <button onClick={() => toggleActive(banner.id)} className="p-2 text-color-2 hover:text-color-3 transition-colors duration-150" aria-label={banner.active ? 'Hide banner' : 'Show banner'}>
                {banner.active ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              </button>
              <button onClick={() => openEditModal(banner)} className="p-2 text-color-2 hover:text-color-4 transition-colors duration-150" aria-label="Edit banner"><Edit2 className="w-4 h-4" /></button>
              <button onClick={() => handleDelete(banner.id)} className="p-2 text-color-2 hover:text-red-600 transition-colors duration-150" aria-label="Delete banner"><Trash2 className="w-4 h-4" /></button>
            </div>
          </Card>
        ))}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingBanner ? 'Edit banner' : 'Add banner'}>
        <div className="space-y-4">
          <Input label="Title" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} placeholder="Banner title" />
          <Input label="Subtitle" value={formData.subtitle} onChange={e => setFormData({ ...formData, subtitle: e.target.value })} placeholder="Banner subtitle" />
          <Input label="Image URL" value={formData.image} onChange={e => setFormData({ ...formData, image: e.target.value })} placeholder="https://..." />
          <Input label="Link URL" value={formData.link} onChange={e => setFormData({ ...formData, link: e.target.value })} placeholder="/products or https://..." />
          <div className="flex gap-3 pt-4">
            <Button onClick={handleSave} className="flex-1">{editingBanner ? 'Save changes' : 'Add banner'}</Button>
            <Button variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
