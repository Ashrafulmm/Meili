import { useState } from 'react';
import { Save } from 'lucide-react';
import { storeSettings as initialSettings } from '../../data/mockData';
import { Button, Card, Input, Textarea } from '../../components/ui';

export function SettingsPage() {
  const [settings, setSettings] = useState(initialSettings);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-color-1">Store settings</h1>
          <p className="text-sm text-color-2 mt-1">Manage your store's global settings</p>
        </div>
        <Button onClick={handleSave}>
          <Save className="w-4 h-4" />
          {saved ? 'Saved!' : 'Save changes'}
        </Button>
      </div>

      {/* General settings */}
      <Card className="p-6">
        <h2 className="text-lg font-bold text-color-1 mb-4">General</h2>
        <div className="space-y-4">
          <Input
            label="Store name"
            value={settings.storeName}
            onChange={e => setSettings({ ...settings, storeName: e.target.value })}
          />
          <Input
            label="Store logo (emoji or text)"
            value={settings.logo}
            onChange={e => setSettings({ ...settings, logo: e.target.value })}
            helperText="This appears next to your store name"
          />
          <div className="grid sm:grid-cols-2 gap-4">
            <Input
              label="Phone number"
              value={settings.phone}
              onChange={e => setSettings({ ...settings, phone: e.target.value })}
            />
            <Input
              label="Email address"
              value={settings.email}
              onChange={e => setSettings({ ...settings, email: e.target.value })}
            />
          </div>
          <Input
            label="Store address"
            value={settings.address}
            onChange={e => setSettings({ ...settings, address: e.target.value })}
          />
        </div>
      </Card>

      {/* SEO settings */}
      <Card className="p-6">
        <h2 className="text-lg font-bold text-color-1 mb-4">SEO settings</h2>
        <div className="space-y-4">
          <Input
            label="SEO title"
            value={settings.seoTitle}
            onChange={e => setSettings({ ...settings, seoTitle: e.target.value })}
            helperText="This appears in browser tabs and search results"
          />
          <Textarea
            label="SEO description"
            value={settings.seoDescription}
            onChange={e => setSettings({ ...settings, seoDescription: e.target.value })}
          />
          <div className="bg-color-7 rounded-sm p-4">
            <p className="text-xs text-color-2 mb-1">Preview how your store appears in Google:</p>
            <p className="text-sm font-medium text-blue-700">{settings.seoTitle}</p>
            <p className="text-xs text-green-700">meilibeauty.com</p>
            <p className="text-xs text-color-2 mt-1">{settings.seoDescription}</p>
          </div>
        </div>
      </Card>

      {/* Social links */}
      <Card className="p-6">
        <h2 className="text-lg font-bold text-color-1 mb-4">Social media</h2>
        <div className="space-y-4">
          <Input
            label="Facebook URL"
            value={settings.facebook}
            onChange={e => setSettings({ ...settings, facebook: e.target.value })}
            placeholder="https://facebook.com/yourstore"
          />
          <Input
            label="Instagram URL"
            value={settings.instagram}
            onChange={e => setSettings({ ...settings, instagram: e.target.value })}
            placeholder="https://instagram.com/yourstore"
          />
        </div>
      </Card>

      {/* Danger zone */}
      <Card className="p-6 border-red-200">
        <h2 className="text-lg font-bold text-red-600 mb-2">Danger zone</h2>
        <p className="text-sm text-color-2 mb-4">These actions are irreversible. Please be careful.</p>
        <div className="flex gap-3">
          <Button variant="danger" size="sm">Reset all settings</Button>
          <Button variant="outline" size="sm" className="border-red-300 text-red-600 hover:bg-red-50">Delete store data</Button>
        </div>
      </Card>
    </div>
  );
}
