import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { formatCurrency, discountPercent } from '../utils/format';
import {
  formatCompactCurrency,
  getBrand,
  getRating,
  getReviewCount,
  getStock,
  getStockCount,
  getSpecs,
  getOffer,
  getDelivery,
  getDeliveryDate
} from '../utils/catalog';
import './ProductCard.css';

export function ProductCard({ product, variant = 'classic' }) {
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const discount = discountPercent(product.price, product.mrp);
  const images = product.images && product.images.length ? product.images : [product.image];
  const [activeImage, setActiveImage] = useState(0);

  const prevImage = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setActiveImage(prev => (prev - 1 + images.length) % images.length);
  };

  const nextImage = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setActiveImage(prev => (prev + 1) % images.length);
  };

  const selectImage = (index) => (event) => {
    event.preventDefault();
    event.stopPropagation();
    setActiveImage(index);
  };

  const handleAdd = (event) => {
    event.preventDefault();
    event.stopPropagation();
    addToCart(product);
  };

  const handleBuyNow = (event) => {
    event.preventDefault();
    event.stopPropagation();
    navigate('/checkout', { state: { buyNowProduct: product } });
  };

  if (variant === 'flipkart') {
    const stock = getStock(product);
    const outOfStock = stock === 'out';
    const rating = getRating(product);
    const reviews = getReviewCount(product);
    const delivery = getDelivery(product);

    return (
      <article className={`product-card product-card--flipkart ${outOfStock ? 'is-out-of-stock' : ''}`}>
        <Link to={`/product/${product.id}`} className="fk-img-link" aria-label={`View ${product.name} details`}>
          <div className="product-image">
            {images.map((src, index) => (
              <img
                key={src}
                src={src}
                alt={`${product.name} view ${index + 1}`}
                loading="lazy"
                className={index === activeImage ? 'product-image-item product-image-item--active' : 'product-image-item'}
                onError={(event) => { event.currentTarget.src = images[0]; }}
              />
            ))}
            {images.length > 1 && (
              <div className="product-image-controls">
                <button className="image-nav-btn image-nav-btn--prev" onClick={prevImage} aria-label="Previous image">‹</button>
                <button className="image-nav-btn image-nav-btn--next" onClick={nextImage} aria-label="Next image">›</button>
              </div>
            )}
            {images.length > 1 && (
              <div className="image-dots">
                {images.map((src, index) => (
                  <button
                    key={src}
                    className={`image-dot ${index === activeImage ? 'image-dot--active' : ''}`}
                    onClick={selectImage(index)}
                    aria-label={`Go to image ${index + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
        </Link>

        <div className="fk-details">
          <Link to={`/product/${product.id}`} className="fk-title-link">
            <div className="fk-brand-row">
              <span className="product-category">{getBrand(product)}</span>
              {stock === 'low' && <span className="fk-stock fk-stock--low">Only {getStockCount(product)} left!</span>}
              {outOfStock && <span className="fk-stock fk-stock--out">Currently Unavailable</span>}
            </div>
            <h3 className="product-name">{product.name}</h3>
            <div className="fk-meta">
              <span className="fk-rating-badge">
                {rating}
                <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M12 2l2.9 6.26L21 9.27l-4.5 4.38L17.8 20 12 16.77 6.2 20l1.3-6.35L3 9.27l6.1-1.01z" />
                </svg>
              </span>
              <span className="fk-reviews">({reviews.toLocaleString('en-IN')})</span>
            </div>
          </Link>

          <div className="fk-price-row">
            <span className="fk-price">{formatCompactCurrency(product.price)}</span>
            {product.mrp > product.price && (
              <span className="fk-mrp">{formatCompactCurrency(product.mrp)}</span>
            )}
            {discount > 0 && <span className="fk-discount">{discount}% off</span>}
          </div>

          <ul className="fk-specs">
            {getSpecs(product).map(spec => (
              <li key={spec}>{spec}</li>
            ))}
          </ul>

          {!outOfStock && (
            <>
              <div className="fk-offer">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
                  <path d="M12 9v4" />
                  <path d="M12 17h.01" />
                  <path d="M10.3 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.7 3.86a2 2 0 0 0-3.4 0z" />
                </svg>
                {getOffer(product)}
              </div>
              <div className="fk-delivery">
                <span className={`fk-delivery-text ${delivery.free ? 'fk-delivery-text--free' : ''}`}>{delivery.text}</span>
                <span className="fk-delivery-date">By {getDeliveryDate()}</span>
              </div>
            </>
          )}

          <div className="fk-footer">
            <button
              className="fk-add-btn"
              onClick={handleAdd}
              disabled={outOfStock}
              aria-label={`Add ${product.name} to cart`}
            >
              Add to Cart
            </button>
            <button
              className="fk-buy-btn"
              onClick={handleBuyNow}
              disabled={outOfStock}
              aria-label={`Buy ${product.name} now`}
            >
              Buy Now
            </button>
          </div>
        </div>
      </article>
    );
  }

  return (
    <article className="product-card">
      <Link to={`/product/${product.id}`} className="product-link" aria-label={`View ${product.name} details`}>
        <div className="product-image">
          {images.map((src, index) => (
            <img
              key={src}
              src={src}
              alt={`${product.name} view ${index + 1}`}
              loading="lazy"
              className={index === activeImage ? 'product-image-item product-image-item--active' : 'product-image-item'}
              onError={(event) => { event.currentTarget.src = images[0]; }}
            />
          ))}
          {discount > 0 && <span className="product-discount-badge">{discount}% OFF</span>}
          {images.length > 1 && (
            <div className="product-image-controls">
              <button className="image-nav-btn image-nav-btn--prev" onClick={prevImage} aria-label="Previous image">‹</button>
              <button className="image-nav-btn image-nav-btn--next" onClick={nextImage} aria-label="Next image">›</button>
            </div>
          )}
          {images.length > 1 && (
            <div className="image-dots">
              {images.map((src, index) => (
                <button
                  key={src}
                  className={`image-dot ${index === activeImage ? 'image-dot--active' : ''}`}
                  onClick={selectImage(index)}
                  aria-label={`Go to image ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>
        <div className="product-info">
          <span className="product-category">{product.category}</span>
          <h3 className="product-name">{product.name}</h3>
        </div>
      </Link>
      <div className="product-info">
        <p className="product-description">{product.description}</p>
        <div className="product-footer">
          <span className="product-price">
            {formatCurrency(product.price)}
            {product.mrp > product.price && (
              <span className="product-mrp">{formatCurrency(product.mrp)}</span>
            )}
          </span>
          <button className="add-to-cart-btn" onClick={handleAdd} aria-label={`Add ${product.name} to cart`}>
            Add to Cart
          </button>
        </div>
      </div>
    </article>
  );
}
