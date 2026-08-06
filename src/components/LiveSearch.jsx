import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProducts } from '../context/ProductsContext';
import { formatCompactCurrency, getStock } from '../utils/catalog';
import './LiveSearch.css';

export function LiveSearch({
  value,
  onChange,
  onSubmit,
  placeholder,
  ariaLabel,
  compact = false
}) {
  const { products } = useProducts();
  const navigate = useNavigate();
  const wrapRef = useRef(null);
  const [suggestions, setSuggestions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  useEffect(() => {
    const query = value.trim().toLowerCase();
    if (!query) {
      setSuggestions([]);
      setCategories([]);
      setOpen(false);
      setActiveIndex(-1);
      return undefined;
    }
    const timer = setTimeout(() => {
      const productMatches = products
        .filter(p =>
          p.name.toLowerCase().includes(query) ||
          (p.description || '').toLowerCase().includes(query) ||
          p.category.toLowerCase().includes(query)
        )
        .slice(0, 6);
      const categoryMatches = [
        ...new Set(
          products.filter(p => p.category.toLowerCase().includes(query)).map(p => p.category)
        )
      ].slice(0, 3);
      setSuggestions(productMatches);
      setCategories(categoryMatches);
      setOpen(productMatches.length > 0 || categoryMatches.length > 0);
      setActiveIndex(-1);
    }, 120);
    return () => clearTimeout(timer);
  }, [value, products]);

  useEffect(() => {
    if (!open) return undefined;
    const onPointerDown = (event) => {
      if (wrapRef.current && !wrapRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', onPointerDown);
    return () => document.removeEventListener('mousedown', onPointerDown);
  }, [open]);

  const items = [
    ...categories.map(label => ({ type: 'category', label })),
    ...suggestions.map(product => ({ type: 'product', product }))
  ];

  const selectItem = (item) => {
    setOpen(false);
    setActiveIndex(-1);
    onChange('');
    if (item.type === 'category') {
      navigate(`/products?category=${encodeURIComponent(item.label)}`);
    } else {
      navigate(`/product/${item.product.id}`);
    }
  };

  const handleKeyDown = (event) => {
    if (!open || items.length === 0) return;
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setActiveIndex(prev => (prev + 1) % items.length);
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setActiveIndex(prev => (prev - 1 + items.length) % items.length);
    } else if (event.key === 'Escape') {
      setOpen(false);
    } else if (event.key === 'Enter' && activeIndex >= 0 && activeIndex < items.length) {
      event.preventDefault();
      selectItem(items[activeIndex]);
    }
  };

  return (
    <div className="live-search" ref={wrapRef}>
      <div className="live-search-input-wrap">
        <input
          type="search"
          className="search-input"
          placeholder={placeholder}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => { if (items.length > 0) setOpen(true); }}
          aria-label={ariaLabel}
          autoComplete="off"
          role="combobox"
          aria-expanded={open}
          aria-controls="live-search-results"
          aria-activedescendant={activeIndex >= 0 ? `ls-item-${activeIndex}` : undefined}
        />
        <button type="submit" className="search-submit" aria-label="Search">
          {compact ? (
            'Go'
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <circle cx="11" cy="11" r="7" />
              <line x1="21" y1="21" x2="16.5" y2="16.5" />
            </svg>
          )}
        </button>
      </div>

      {open && (
        <div id="live-search-results" className="live-search-dropdown" role="listbox">
          {items.length === 0 ? (
            <div className="live-search-empty">No results for &ldquo;{value.trim()}&rdquo;</div>
          ) : (
            <>
              {categories.length > 0 && (
                <div className="live-search-group">
                  <div className="live-search-group-title">Categories</div>
                  {categories.map((label, idx) => (
                    <button
                      key={label}
                      id={`ls-item-${idx}`}
                      type="button"
                      role="option"
                      aria-selected={activeIndex === idx}
                      className={`live-search-item ${activeIndex === idx ? 'is-active' : ''}`}
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => selectItem({ type: 'category', label })}
                      onMouseEnter={() => setActiveIndex(idx)}
                    >
                      <svg className="live-search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M4 6a2 2 0 0 1 2-2h4l2 2h6a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2z" />
                      </svg>
                      <span className="live-search-name">{label}</span>
                    </button>
                  ))}
                </div>
              )}

              {suggestions.length > 0 && (
                <div className="live-search-group">
                  <div className="live-search-group-title">Products</div>
                  {suggestions.map((product, idx) => {
                    const index = categories.length + idx;
                    const stock = getStock(product);
                    return (
                      <button
                        key={product.id}
                        id={`ls-item-${index}`}
                        type="button"
                        role="option"
                        aria-selected={activeIndex === index}
                        className={`live-search-item ${activeIndex === index ? 'is-active' : ''}`}
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => selectItem({ type: 'product', product })}
                        onMouseEnter={() => setActiveIndex(index)}
                      >
                        <img src={product.image} alt="" className="live-search-thumb" loading="lazy" />
                        <span className="live-search-meta">
                          <span className="live-search-name">{product.name}</span>
                          <span className="live-search-sub">
                            {stock === 'out' ? (
                              <span className="live-search-out">Out of stock</span>
                            ) : (
                              <span className="live-search-price">{formatCompactCurrency(product.price)}</span>
                            )}
                            <span className="live-search-cat"> · {product.category}</span>
                          </span>
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}

              <div className="live-search-footer">
                <button
                  type="button"
                  className="live-search-view-all"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => { setOpen(false); onSubmit(); }}
                >
                  View all results for &ldquo;{value.trim()}&rdquo;
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
