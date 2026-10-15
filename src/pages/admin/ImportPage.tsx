import { useState } from 'react';
import { Link2, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { Button, Card, Input, Textarea } from '../../components/ui';

interface ScrapedProduct {
  title: string;
  price: string;
  description: string;
  images: string[];
}

export function ImportPage() {
  const [url, setUrl] = useState('');
  const [isScraping, setIsScraping] = useState(false);
  const [scrapedData, setScrapedData] = useState<ScrapedProduct | null>(null);
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);

  const handleScrape = async () => {
    if (!url) { setError('Please enter a URL'); return; }
    setIsScraping(true);
    setError('');
    setScrapedData(null);

    // Simulate scraping delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Mock scraped data
    setScrapedData({
      title: 'Imported beauty product',
      price: '1299',
      description: 'This product was imported from the provided URL. The scraper has extracted the product details including title, price, description, and images. You can edit any field before saving to your store.',
      images: ['https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&h=600&fit=crop'],
    });
    setIsScraping(false);
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => { setSaved(false); setScrapedData(null); setUrl(''); }, 2000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-color-1">Product importer</h1>
        <p className="text-sm text-color-2 mt-1">Paste a product URL to automatically extract details and add to your store</p>
      </div>

      <Card className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <Link2 className="w-5 h-5 text-color-3" aria-hidden="true" />
          <h2 className="text-lg font-bold text-color-1">Import from URL</h2>
        </div>

        <div className="flex gap-3">
          <div className="flex-1">
            <Input
              placeholder="https://example.com/product-page"
              value={url}
              onChange={e => setUrl(e.target.value)}
              error={error}
            />
          </div>
          <Button onClick={handleScrape} loading={isScraping} disabled={isScraping}>
            {isScraping ? 'Scraping...' : 'Import'}
          </Button>
        </div>

        <p className="text-xs text-color-2 mt-3">
          Supports product pages from popular e-commerce sites. The scraper will extract title, price, description, and images.
        </p>
      </Card>

      {/* Scraped data preview */}
      {scrapedData && (
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <CheckCircle className="w-5 h-5 text-color-3" aria-hidden="true" />
            <h2 className="text-lg font-bold text-color-1">Imported product details</h2>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            <div>
              <img src={scrapedData.images[0]} alt="Product" className="w-full h-48 object-cover rounded-sm" />
            </div>
            <div className="space-y-4">
              <Input label="Product title" defaultValue={scrapedData.title} />
              <Input label="Price (৳)" type="number" defaultValue={scrapedData.price} />
              <Textarea label="Description" defaultValue={scrapedData.description} />
              <div>
                <p className="text-sm font-medium text-color-1 mb-2">Images found</p>
                <div className="flex gap-2">
                  {scrapedData.images.map((img, i) => (
                    <img key={i} src={img} alt={`Product image ${i + 1}`} className="w-16 h-16 object-cover rounded-sm border-2 border-color-6" />
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-3 mt-6 pt-4 border-t border-color-6">
            <Button onClick={handleSave} disabled={saved}>
              {saved ? '✓ Saved to store!' : 'Save to store'}
            </Button>
            <Button variant="ghost" onClick={() => setScrapedData(null)}>Discard</Button>
          </div>
        </Card>
      )}

      {/* Info card */}
      <Card className="p-6 bg-color-7 border-color-3/30">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-color-3 shrink-0 mt-0.5" aria-hidden="true" />
          <div>
            <h3 className="text-sm font-medium text-color-1 mb-1">How it works</h3>
            <ol className="text-xs text-color-2 space-y-1 list-decimal list-inside">
              <li>Paste the product page URL from any supported website</li>
              <li>Click "Import" to extract product details automatically</li>
              <li>Review and edit the extracted information</li>
              <li>Click "Save to store" to add the product to your catalog</li>
            </ol>
            <p className="text-xs text-color-2 mt-3">
              Note: When connected to Supabase, this will save directly to your database. Currently running with mock data.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
