import { useState, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Star, Filter, Grid3X3, List } from 'lucide-react';
import { products, categories } from '../data/mockData';
import { Card, Button, Badge, Select } from '../components/ui';
import { useCart } from '../context/CartContext';

export function ProductsPage() {
  const [searchParams] = useSearchParams();
  const categoryFilter = searchParams.get('category') || '';
  const [selectedCategory, setSelectedCategory] = useState(categoryFilter);
  const [sortBy, setSortBy] = useState('featured');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [priceRange, setPriceRange] = useState('all');
  const { addToCart } = useCart();

  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (selectedCategory) {
      result = result.filter(p => p.category.toLowerCase().replace(/\s+/g, '-') === selectedCategory);
    }

    if (priceRange !== 'all') {
      const [min, max] = priceRange.split('-').map(Number);
      result = result.filter(p => p.price >= min && (max ? p.price <= max : true));
    }

    switch (sortBy) {
      case 'price-low': result.sort((a, b) => a.price - b.price); break;
      case 'price-high': result.sort((a, b) => b.price - a.price); break;
      case 'rating': result.sort((a, b) => b.rating - a.rating); break;
      case 'newest': result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()); break;
      default: result.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
    }

    return result;
  }, [selectedCategory, sortBy, priceRange]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-color-2 mb-6" aria-label="Breadcrumb">
        <Link to="/" className="hover:text-color-4 transition-colors duration-150">Home</Link>
        <span>/</span>
        <span className="text-color-1 font-medium">Products</span>
      </nav>

      <h1 className="text-2xl font-bold text-color-1 mb-6">All products</h1>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters sidebar */}
        <aside className="lg:w-64 shrink-0" aria-label="Product filters">
          <Card className="p-5 space-y-6">
            <div className="flex items-center gap-2 text-color-1 font-semibold">
              <Filter className="w-4 h-4" aria-hidden="true" />
              <span>Filters</span>
            </div>

            {/* Category filter */}
            <div>
              <h3 className="text-sm font-medium text-color-1 mb-3">Category</h3>
              <div className="space-y-2">
                <button
                  onClick={() => setSelectedCategory('')}
                  className={`block w-full text-left px-3 py-2 text-sm rounded-sm transition-colors duration-150 ${!selectedCategory ? 'bg-color-4 text-color-8 font-medium' : 'text-color-2 hover:bg-color-6'}`}
                >
                  All categories
                </button>
                {categories.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.slug)}
                    className={`block w-full text-left px-3 py-2 text-sm rounded-sm transition-colors duration-150 ${selectedCategory === cat.slug ? 'bg-color-4 text-color-8 font-medium' : 'text-color-2 hover:bg-color-6'}`}
                  >
                    {cat.name} ({cat.productCount})
                  </button>
                ))}
              </div>
            </div>

            {/* Price filter */}
            <div>
              <h3 className="text-sm font-medium text-color-1 mb-3">Price range</h3>
              <Select
                value={priceRange}
                onChange={(e) => setPriceRange(e.target.value)}
                options={[
                  { value: 'all', label: 'All prices' },
                  { value: '0-500', label: 'Under ৳500' },
                  { value: '500-1000', label: '৳500 - ৳1000' },
                  { value: '1000-2000', label: '৳1000 - ৳2000' },
                  { value: '2000-99999', label: 'Above ৳2000' },
                ]}
              />
            </div>
          </Card>
        </aside>

        {/* Products grid */}
        <div className="flex-1">
          {/* Toolbar */}
          <div className="flex items-center justify-between mb-6">
            <p className="text-sm text-color-2">{filteredProducts.length} products found</p>
            <div className="flex items-center gap-3">
              <Select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                options={[
                  { value: 'featured', label: 'Featured' },
                  { value: 'newest', label: 'Newest' },
                  { value: 'price-low', label: 'Price: low to high' },
                  { value: 'price-high', label: 'Price: high to low' },
                  { value: 'rating', label: 'Top rated' },
                ]}
              />
              <div className="hidden sm:flex items-center gap-1 border border-color-6 rounded-sm p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-sm transition-colors duration-150 ${viewMode === 'grid' ? 'bg-color-4 text-color-8' : 'text-color-2 hover:text-color-1'}`}
                  aria-label="Grid view"
                  aria-pressed={viewMode === 'grid'}
                >
                  <Grid3X3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-sm transition-colors duration-150 ${viewMode === 'list' ? 'bg-color-4 text-color-8' : 'text-color-2 hover:text-color-1'}`}
                  aria-label="List view"
                  aria-pressed={viewMode === 'list'}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Products */}
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
              {filteredProducts.map(product => (
                <Card key={product.id} hover className="overflow-hidden group flex flex-col">
                  <Link to={`/products/${product.slug}`} className="block">
                    <div className="relative overflow-hidden">
                      <img src={product.images[0]} alt={product.title} className="w-full aspect-square object-cover group-hover:scale-105 transition-transform duration-300" />
                      {product.originalPrice && (
                        <Badge className="absolute top-3 left-3" variant="danger">
                          -{Math.round((1 - product.price / product.originalPrice) * 100)}%
                        </Badge>
                      )}
                      {product.stock < 10 && (
                        <Badge className="absolute top-3 right-3" variant="warning">Low stock</Badge>
                      )}
                    </div>
                  </Link>
                  <div className="p-4 flex flex-col flex-1">
                    <div className="flex-1">
                      <p className="text-xs text-color-2 mb-1">{product.category}</p>
                      <Link to={`/products/${product.slug}`}>
                        <h3 className="text-sm font-semibold text-color-1 hover:text-color-4 transition-colors duration-150 line-clamp-2">{product.title}</h3>
                      </Link>
                      <p className="text-xs text-color-2 mt-1 line-clamp-2">{product.shortDescription}</p>
                      <div className="flex items-center gap-1 mt-2">
                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                        <span className="text-xs text-color-2">{product.rating} ({product.reviewCount})</span>
                      </div>
                      <div className="flex items-baseline gap-2 mt-2">
                        <span className="text-base font-bold text-color-1">৳{product.price}</span>
                        {product.originalPrice && <span className="text-xs text-color-2 line-through">৳{product.originalPrice}</span>}
                      </div>
                    </div>
                    <div className="mt-3 flex justify-center">
                      <button
                        onClick={() => addToCart(product)}
                        style={{ borderRadius: '5px', padding: '8px 16px', fontSize: '13px' }}
                        className="inline-flex items-center justify-center font-semibold bg-color-4 text-color-8 hover:bg-color-5 active:bg-color-1 shadow-md hover:shadow-sm transition-all duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-color-3"
                        aria-label={`Add ${product.title} to cart`}
                      >
                        Add to cart
                      </button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredProducts.map(product => (
                <Card key={product.id} hover className="flex flex-col sm:flex-row overflow-hidden">
                  <div className="sm:w-48 shrink-0">
                    <img src={product.images[0]} alt={product.title} className="w-full h-40 sm:h-full object-cover" />
                  </div>
                  <div className="flex-1 p-4 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-xs text-color-2 mb-1">{product.category}</p>
                          <Link to={`/products/${product.slug}`}>
                            <h3 className="text-sm font-semibold text-color-1 hover:text-color-4 transition-colors duration-150">{product.title}</h3>
                          </Link>
                        </div>
                        {product.originalPrice && <Badge variant="danger">-{Math.round((1 - product.price / product.originalPrice) * 100)}%</Badge>}
                      </div>
                      <p className="text-xs text-color-2 mt-2">{product.shortDescription}</p>
                    </div>
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center gap-4">
                        <span className="text-lg font-bold text-color-1">৳{product.price}</span>
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                          <span className="text-xs text-color-2">{product.rating}</span>
                        </div>
                      </div>
                      <Button size="sm" onClick={() => addToCart(product)}>Add to cart</Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {filteredProducts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-lg text-color-2">No products found</p>
              <p className="text-sm text-color-2 mt-2">Try adjusting your filters</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
