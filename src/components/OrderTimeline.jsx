import './OrderTimeline.css';

const ORDER_STEPS = ['Pending', 'Processing', 'Shipped', 'Delivered'];

export function OrderTimeline({ status, compact = false }) {
  const cancelled = status === 'Cancelled';
  const currentIndex = ORDER_STEPS.indexOf(status);

  if (cancelled) {
    return (
      <div className="order-timeline order-timeline--cancelled">
        <span className="ot-cancelled-icon" aria-hidden="true">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="15" y1="9" x2="9" y2="15" />
            <line x1="9" y1="9" x2="15" y2="15" />
          </svg>
        </span>
        <span>This order was cancelled.</span>
      </div>
    );
  }

  return (
    <div className={`order-timeline ${compact ? 'order-timeline--compact' : ''}`}>
      <ol className="order-timeline-steps">
        {ORDER_STEPS.map((step, index) => {
          const reached = index <= currentIndex;
          const isCurrent = index === currentIndex;
          return (
            <li
              key={step}
              className={`ot-step ${reached ? 'is-reached' : ''} ${isCurrent ? 'is-current' : ''}`}
              aria-current={isCurrent ? 'step' : undefined}
            >
              <span className="ot-dot" aria-hidden="true">
                {reached && (
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                )}
              </span>
              <span className="ot-label">{step}</span>
            </li>
          );
        })}
      </ol>
      {currentIndex >= 0 && (
        <p className="ot-hint">
          {currentIndex === 0 && 'Your order has been placed and is awaiting confirmation.'}
          {currentIndex === 1 && 'We are preparing your order for shipment.'}
          {currentIndex === 2 && 'Your order is on the way! Track it below.'}
          {currentIndex === 3 && 'Your order has been delivered. Enjoy!'}
        </p>
      )}
    </div>
  );
}
