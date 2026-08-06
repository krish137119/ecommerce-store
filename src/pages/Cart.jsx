import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { discountPercent } from '../utils/format';
import { formatCompactCurrency, getBrand } from '../utils/catalog';
import { pricing } from '../config/site';
import './Cart.css';

export function Cart() {
  const navigate = useNavigate();
  const {
    cartItems,
    cartTotal,
    cartCount,
    updateQuantity,
    removeFromCart,
    clearCart
  } = useCart();

  const shipping =
    cartItems.length > 0 && cartTotal < pricing.freeShippingThreshold
      ? pricing.shippingFee
      : 0;
  const total = cartTotal + shipping;
  const totalMrp = cartItems.reduce(
    (sum, item) => sum + (Number(item.mrp || item.price) || 0) * item.quantity,
    0
  );
  const discount = Math.max(0, totalMrp - cartTotal);
  const savings = discount + shipping;
  const freeDeliveryRemaining = Math.max(
    0,
    pricing.freeShippingThreshold - cartTotal
  );
  const deliveryProgress = Math.min(
    100,
    Math.round((cartTotal / pricing.freeShippingThreshold) * 100)
  );

  return (
    <section className="cp-page">
      <div className="cp-container">
        <h1 className="cp-title">
          My Cart <span className="cp-title-count">({cartCount} items)</span>
        </h1>

        {cartItems.length === 0 ? (
          <div className="cp-empty">
            <svg width="72" height="72" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 0 1 0 8" />
            </svg>
            <h2>Your cart is empty!</h2>
            <p>Looks like you haven't added anything to your cart yet.</p>
            <div className="cp-empty-actions">
              <Link to="/products" className="cp-btn-primary">Shop Now</Link>
              <Link to="/" className="cp-btn-ghost">Back to Home</Link>
            </div>
          </div>
        ) : (
          <div className="cp-layout">
            <div className="cp-main">
              <div className="cp-card cp-delivery-card">
                {freeDeliveryRemaining > 0 ? (
                  <p className="cp-delivery-text">
                    Add <strong>{formatCompactCurrency(freeDeliveryRemaining)}</strong> more for
                    <span className="cp-delivery-free"> FREE delivery</span>
                  </p>
                ) : (
                  <p className="cp-delivery-text">
                    Yay! You've unlocked <span className="cp-delivery-free">FREE delivery</span>
                  </p>
                )}
                <div className="cp-progress">
                  <span className="cp-progress-fill" style={{ width: `${deliveryProgress}%` }} />
                </div>
              </div>

              <div className="cp-card">
                <ul className="cp-list">
                  {cartItems.map(item => {
                    const off = discountPercent(item.price, item.mrp);
                    return (
                      <li key={item.id} className="cp-item">
                        <Link to={`/product/${item.id}`} className="cp-item-img">
                          <img src={item.image} alt={item.name} loading="lazy" />
                        </Link>
                        <div className="cp-item-info">
                          <Link to={`/product/${item.id}`} className="cp-item-name">
                            {item.name}
                          </Link>
                          <span className="cp-item-brand">{getBrand(item)}</span>
                          <div className="cp-item-price-row">
                            <span className="cp-item-price">{formatCompactCurrency(item.price)}</span>
                            {item.mrp > item.price && (
                              <span className="cp-item-mrp">{formatCompactCurrency(item.mrp)}</span>
                            )}
                            {off > 0 && <span className="cp-item-off">{off}% off</span>}
                          </div>
                          <span className="cp-item-delivery">Free Delivery</span>
                          <div className="cp-item-controls">
                            <div className="cp-qty">
                              <button
                                className="cp-qty-btn"
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                aria-label="Decrease quantity"
                              >−</button>
                              <span className="cp-qty-value">{item.quantity}</span>
                              <button
                                className="cp-qty-btn"
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                aria-label="Increase quantity"
                              >+</button>
                            </div>
                            <button
                              className="cp-remove"
                              onClick={() => removeFromCart(item.id)}
                            >Remove</button>
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>

              <div className="cp-card cp-note">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  <polyline points="9 12 11 14 15 10" />
                </svg>
                <p>Safe and secure payments. Easy returns. 100% Authentic products.</p>
              </div>
            </div>

            <aside className="cp-card cp-summary-card">
              <h3 className="cp-summary-heading">PRICE DETAILS</h3>
              <div className="cp-summary-rows">
                <div className="cp-summary-row">
                  <span>Price ({cartCount} items)</span>
                  <span>{formatCompactCurrency(totalMrp)}</span>
                </div>
                <div className="cp-summary-row">
                  <span>Discount</span>
                  <span className="cp-green">− {formatCompactCurrency(discount)}</span>
                </div>
                <div className="cp-summary-row">
                  <span>Delivery Charges</span>
                  {shipping === 0 ? (
                    <span className="cp-green">FREE</span>
                  ) : (
                    <span>{formatCompactCurrency(shipping)}</span>
                  )}
                </div>
                <div className="cp-summary-row cp-total">
                  <span>Total Amount</span>
                  <span>{formatCompactCurrency(total)}</span>
                </div>
              </div>
              <p className="cp-savings">
                You will save {formatCompactCurrency(savings)} on this order
              </p>
              <button className="cp-checkout" onClick={() => navigate('/checkout')}>
                Place Order
              </button>
              <button className="cp-clear" onClick={clearCart}>
                Clear Cart
              </button>
            </aside>
          </div>
        )}
      </div>
    </section>
  );
}

export default Cart;
