import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, X } from 'lucide-react';
import { products } from '../../data/mockData';

export function LiveSearch() {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const results = query.length >= 2
    ? products.filter(p =>
        p.title.toLowerCase().includes(query.toLowerCase()) ||
        p.category.toLowerCase().includes(query.toLowerCase()) ||
        p.shortDescription.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 6)
    : [];

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => Math.min(prev + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => Math.max(prev - 1, -1));
    } else if (e.key === 'Enter' && selectedIndex >= 0) {
      e.preventDefault();
      setIsOpen(false);
      setQuery('');
    } else if (e.key === 'Escape') {
      setIsOpen(false);
      inputRef.current?.blur();
    }
  };

  const clearSearch = () => {
    setQuery('');
    setIsOpen(false);
    inputRef.current?.focus();
  };

  return (
    <div ref={containerRef} className="relative w-full">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-color-2 pointer-events-none" aria-hidden="true" />
        <input
          ref={inputRef}
          type="search"
          placeholder="Search products..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
            setSelectedIndex(-1);
          }}
          onFocus={() => query.length >= 2 && setIsOpen(true)}
          onKeyDown={handleKeyDown}
          className="w-full pl-10 pr-10 py-2 text-sm bg-color-7 border border-color-6 rounded-md focus:border-color-3 focus:ring-2 focus:ring-color-3/20 transition-all duration-150 text-color-1 placeholder:text-color-2/50"
          aria-label="Search products"
          aria-expanded={isOpen && results.length > 0}
          aria-controls="search-results"
          aria-activedescendant={selectedIndex >= 0 ? `search-result-${selectedIndex}` : undefined}
          role="combobox"
          aria-autocomplete="list"
        />
        {query && (
          <button
            onClick={clearSearch}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-color-2 hover:text-color-1 transition-colors duration-150"
            aria-label="Clear search"
          >
            <X className="w-3 h-3" />
          </button>
        )}
      </div>

      {/* Results dropdown */}
      {isOpen && results.length > 0 && (
        <div
          id="search-results"
          role="listbox"
          className="absolute top-full left-0 right-0 mt-2 bg-color-8 border border-color-6 rounded-sm shadow-sm overflow-hidden z-50"
        >
          <div className="p-2 border-b border-color-6">
            <p className="text-xs text-color-2 px-2">{results.length} result{results.length !== 1 ? 's' : ''} found</p>
          </div>
          {results.map((product, index) => (
            <Link
              key={product.id}
              to={`/products/${product.slug}`}
              id={`search-result-${index}`}
              role="option"
              aria-selected={index === selectedIndex}
              onClick={() => { setIsOpen(false); setQuery(''); }}
              className={`flex items-center gap-3 p-3 hover:bg-color-7 transition-colors duration-150 ${
                index === selectedIndex ? 'bg-color-7' : ''
              }`}
            >
              <img
                src={product.images[0]}
                alt={product.title}
                className="w-10 h-10 object-cover rounded-sm shrink-0"
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-color-1 truncate">{product.title}</p>
                <p className="text-xs text-color-2">{product.category}</p>
              </div>
              <span className="text-sm font-bold text-color-1 shrink-0">৳{product.price}</span>
            </Link>
          ))}
          <div className="p-2 border-t border-color-6 bg-color-7">
            <Link
              to={`/products?search=${encodeURIComponent(query)}`}
              onClick={() => { setIsOpen(false); }}
              className="block text-center text-xs font-medium text-color-4 hover:text-color-5 py-1 transition-colors duration-150"
            >
              View all results for "{query}"
            </Link>
          </div>
        </div>
      )}

      {/* No results */}
      {isOpen && query.length >= 2 && results.length === 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-color-8 border border-color-6 rounded-sm shadow-sm p-4 z-50">
          <p className="text-sm text-color-2 text-center">No products found for "{query}"</p>
        </div>
      )}
    </div>
  );
}
