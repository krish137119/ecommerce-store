import { NavLink } from 'react-router-dom';
import './AccountTabs.css';

export function AccountTabs() {
  return (
    <nav className="account-tabs" aria-label="Account navigation">
      <NavLink to="/account/orders" end>
        My Orders
      </NavLink>
      <NavLink to="/account/profile" end>
        Profile Settings
      </NavLink>
    </nav>
  );
}
