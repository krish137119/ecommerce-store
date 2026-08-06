# ShopEasy — Complete Project Documentation

Full-stack, production-style e-commerce application you can reuse as a **white-label template for any client**. It includes a customer-facing storefront, an admin dashboard, authentication, cart + checkout with online payments, and order management.

- **Frontend:** React 19, Vite 8, React Router 7
- **Backend:** Node.js, Express 5, Mongoose 9 (MongoDB)
- **Payments:** Razorpay (optional — works without it, falls back to "place order" flow)
- **Auth:** JWT access + rotating refresh tokens in httpOnly cookies, bcrypt password hashing, email OTP sign-in (Brevo, with an in-memory dev fallback)

---

## 1. What the app does (feature overview)

| Area | Capabilities |
| --- | --- |
| Storefront | Home page (ambassador banner, hero, categories, deals, new arrivals, bestsellers, newsletter, about/contact/legal), product listing with search + filters + sorting, product detail with gallery + recommendations |
| Catalog | 108 seeded demo products across 9 categories (Mobiles, Electronics, Fashion, Footwear, Home & Kitchen, Appliances, Beauty & Grooming, Sports & Fitness, Toys & Books) |
| Cart | A full `/cart` page (line items, qty stepper, remove, MRP/discount/savings breakdown, free-delivery progress, sticky price-details card). Dual-mode: server cart when signed in, `localStorage` for guests. |
| Auth | Register, login, logout, email OTP sign-in, refresh-token rotation, profile update, password change. Roles: `user` and `admin`. |
| Checkout | Shipping form → creates order on server → Razorpay popup (if configured) → verification → order confirmation |
| Orders | Customer order history, order detail + pay-now for pending payments, admin order status management |
| Admin | Product CRUD (add/edit/delete), order management, customer enable/disable |
| Search | Header search + listing-page search; filters: category, price range, brand, rating, discount, availability; sort by popularity/price/newest/rating |
| Theming | Everything driven by CSS variables; brand name/tagline/colors/pricing configurable in one file |

---

## 2. Tech stack (exact versions)

From `package.json`:

| Dependency | Version | Purpose |
| --- | --- | --- |
| `react` / `react-dom` | 19.x | UI |
| `react-router-dom` | 7.x | Routing |
| `vite` | 8.x | Build / dev server |
| `express` | 5.x | API server |
| `mongoose` | 9.x | MongoDB ODM |
| `jsonwebtoken` | 9.x | JWT signing |
| `bcryptjs` | 3.x | Password hashing |
| `cookie-parser` | 1.x | Cookie handling |
| `helmet` | 8.x | Security headers |
| `cors` | 2.x | Cross-origin (dev) |
| `express-rate-limit` | 8.x | Auth endpoint throttling |
| `razorpay` | 2.x | Payment gateway SDK |
| `concurrently` | 10.x | Run web + API together |
| `oxlint` | 1.x | Linting |

---

## 3. Architecture

```
┌─────────────────────────────┐         ┌──────────────────────────────┐
│  Browser (React SPA)        │  fetch  │  Express API  (localhost:5000)│
│  Vite dev @ :5173           │ ──────► │  /api/...                     │
│  (prod: served by Express)  │  cookies│  └── MongoDB (127.0.0.1:27017)│
└─────────────────────────────┘         └──────────────────────────────┘
```

- In **development**: Vite serves the SPA on `:5173` and proxies `/api` → `:5000` (see `vite.config.js`).
- In **production** (`npm run start`): Express serves the built `dist/` folder itself and falls back to `index.html` for non-API GET routes (SPA history fallback).
- The cart is **dual-mode**: signed-in users use a **server-side cart** (`/api/cart`, survives across devices); guests use a `localStorage` cart that's merged in on sign-in. Orders are always **server-side** (prices recomputed on the server — the client never sends its own prices for checkout).

---

## 4. Complete folder structure

```
ecommerce-store/
├── index.html                  # Vite entry HTML (root div, favicon, title)
├── package.json                # Scripts + dependencies
├── vite.config.js              # Vite config + /api proxy to :5000
├── .env.example                # Template for environment variables
├── .env                        # Your actual secrets (never commit)
├── .oxlintrc.json              # Lint rules (react hooks, export rules)
├── public/
│   ├── favicon.svg             # Browser tab icon
│   └── icons.svg
│
├── server/                     # ══ BACKEND (Express + Mongoose) ══
│   ├── index.js                # App bootstrap: middleware, routes, SPA serving, startup
│   ├── seeds.js                # First-boot seeding: admin account + demo products
│   ├── config/
│   │   ├── env.js              # Reads + validates .env into `env` object
│   │   └── db.js               # connectDB / disconnectDB (Mongoose)
│   ├── models/
│   │   ├── User.js             # name/email/phone/passwordHash/role/...  + toSafeJSON()
│   │   ├── Product.js          # name/price/mrp/images/popularity/...     + toSafeJSON()
│   │   └── Order.js            # items/shippingInfo/payment/status/...    + toSafeJSON()
│   ├── routes/
│   │   ├── auth.routes.js      # /api/auth/*     (public + rate-limited)
│   │   ├── product.routes.js   # /api/products/* (admin guarded writes)
│   │   ├── order.routes.js     # /api/orders/*   (signed-in; admin guarded)
│   │   ├── user.routes.js      # /api/users/*    (profile + admin customer mgmt)
│   │   └── cart.routes.js      # /api/cart/*     (signed-in; server-side cart)
│   ├── controllers/
│   │   ├── authController.js   # register/login/logout/me/refresh/otp
│   │   ├── productController.js# list/get/create/update/delete
│   │   ├── orderController.js  # create/verify-payment/mine/all/get/status
│   │   ├── userController.js   # updateProfile/changePassword/customers
│   │   └── cartController.js   # get/add/update/remove/clear/merge (enriched from Product)
│   ├── middleware/
│   │   ├── auth.js             # requireAuth (JWT), requireAdmin (role)
│   │   └── error.js            # notFound + centralized errorHandler
│   └── utils/
│       ├── tokens.js           # signAccess/RefreshToken, hashToken, cookieOptions
│       ├── otp.js              # dev-fallback in-memory OTP store (create/verify, 5-min TTL)
│       ├── brevo.js            # Brevo API: sendOtpEmail (OTP), sendOrderConfirmationEmail (receipt)
│       ├── validators.js       # email/name/phone/password/product/order validation
│       └── razorpay.js         # SDK init, signature verification (timing-safe)
│
└── src/                        # ══ FRONTEND (React SPA) ══
    ├── main.jsx                # Entry: injects theme CSS vars + renders <App/>
    ├── App.jsx                 # Provider nesting + all routes + layout shell
    ├── App.css                 # Global layout (footer etc.)
    ├── index.css               # Design tokens (:root CSS variables), resets
    ├── api/
    │   └── client.js           # fetch wrapper: /api base, credentials, auto token refresh
    ├── config/
    │   └── site.js             # ★ THE config file: site name/tagline, theme vars,
    │                           #   layout flags, pricing, navigation
    ├── context/
    │   ├── AuthContext.jsx     # user state, login/register/otp/profile/password
    │   ├── CartContext.jsx     # dual-mode cart: server (/api/cart) when signed in, localStorage for guests
    │   ├── ProductsContext.jsx # products state, add/update/delete
    │   └── OrdersContext.jsx   # orders state (mine or all by role), place/verify/status
    ├── data/
    │   └── products.js         # ★ 108 seed products (name/price/mrp/image/desc/category)
    ├── hooks/
    │   └── useInView.js        # IntersectionObserver hook (scroll-reveal animations)
    ├── utils/
    │   ├── format.js           # formatCurrency (₹1,234.00), discountPercent
    │   ├── catalog.js          # formatCompactCurrency, deterministic getBrand/Rating/
    │   │                       #   ReviewCount/Stock/Specs/Offer/Delivery/Date
    │   ├── validation.js       # client-side email/name/phone/password checks
    │   └── razorpay.js         # loads checkout.js, opens Razorpay popup
    ├── components/
    │   ├── Header.jsx/.css     # logo, search, nav, account menu, cart link, mobile menu
    │   ├── ProductCard.jsx/.css# product card, variants: 'classic' and 'flipkart'
    │   ├── Ambassadors.jsx/.css# sponsored ambassador carousel (auto-rotate 5s)
    │   ├── AccountTabs.jsx/.css# My Orders / Profile Settings tabs
    │   ├── UserRoute.jsx       # guard: redirect to /login if signed out
    │   ├── AdminRoute.jsx      # guard: admin role only
    │   ├── Reveal.jsx          # scroll-reveal wrapper
    │   └── ScrollToSection.jsx # hash-scroll + scroll-to-top on route change
    └── pages/
        ├── Home.jsx/.css       # Ambassadors → hero → categories → deals → arrivals →
        │                       #   bestsellers → newsletter → about → contact → legal
        ├── ProductListing.jsx/.css  # search, filters, sort, grid/list views
        ├── ProductDetail.jsx/.css   # gallery, price block, offers, specs, recommendations
        ├── Cart.jsx/.css       # full /cart page (dark theme, price-details card)
        ├── Checkout.jsx/.css   # shipping form + Razorpay + order placement
        ├── OrderConfirmation.jsx/.css  # order result + Pay Now if pending
        ├── OrderHistory.jsx/.css        # list of user orders
        ├── Profile.jsx/.css             # edit profile / change password
        ├── AdminDashboard.jsx/.css      # products/orders/customers tabs
        ├── Login.jsx, Register.jsx, OtpLogin.jsx + auth.css
```

---

## 5. Environment variables (`.env`)

| Variable | Default | Notes |
| --- | --- | --- |
| `NODE_ENV` | `development` | `production` enables static `dist/` serving + hides demo OTP code |
| `PORT` | `5000` | API port |
| `MONGO_URI` | `mongodb://127.0.0.1:27017/shopEasy` | Local MongoDB |
| `JWT_SECRET` | — (required) | Long random string (see command below) |
| `JWT_ACCESS_TTL` | `15m` | Access token lifetime |
| `JWT_REFRESH_TTL` | `7d` | Refresh token lifetime |
| `ADMIN_NAME` | `Admin` | Seeded admin name |
| `ADMIN_EMAIL` | — (required) | Seeded admin email |
| `ADMIN_PASSWORD` | — (required) | Seeded admin password |
| `COOKIE_SECURE` | `false` | Set `true` only over HTTPS |
| `SEED_PRODUCTS` | `true` | Seed demo products while collection is empty |
| `CURRENCY` | `INR` | Payment currency |
| `SHIPPING_FEE` | `49` | Flat shipping below threshold |
| `FREE_SHIPPING_THRESHOLD` | `999` | Orders ≥ this ship free |
| `RAZORPAY_KEY_ID` / `RAZORPAY_KEY_SECRET` | empty | Both empty = payments disabled (orders placed directly) |
| `BREVO_API_KEY` | empty | Email delivery (OTP codes **and** order confirmations) via Brevo API (free = 300/day, **no domain needed**) — verify your own email at Senders → Create a Sender |
| `BREVO_FROM_EMAIL` | empty | The verified Brevo sender email (required when using Brevo) |
| `BREVO_FROM_NAME` | `ShopEasy` | Sender name for Brevo emails |

Generate a JWT secret:

```sh
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

---

## 6. Setup from scratch (first run)

**Prerequisites:** Node.js 18+, MongoDB running locally (`mongodb://127.0.0.1:27017`).

```sh
# 1. Install dependencies
npm install

# 2. Create env file and fill it in
cp .env.example .env

# 3. Run web + API together
npm run dev
```

- Web app → http://localhost:5173
- API → http://localhost:5000 (`/api/health` for a ping)

**First boot** (automatic in `server/index.js` + `server/seeds.js`):
1. Connects to MongoDB, syncs indexes.
2. Seeds the **admin** account from `ADMIN_EMAIL`/`ADMIN_PASSWORD` (only if no admin exists).
3. Seeds the **108 demo products** (only if the products collection is empty; disable with `SEED_PRODUCTS=false`).

Sign in at `/login` with the admin credentials to reach `/admin`.

> **Email — provider precedence:**
>
> 1. **Brevo API** (`BREVO_API_KEY` + `BREVO_FROM_EMAIL` set) — the server generates a 6-digit OTP (hashed in memory, 5-min TTL), emails it via Brevo (`POST /v3/smtp/email`), and verifies it against the in-memory store. Order confirmations are also emailed through Brevo automatically when an order is created. Free = 300 emails/day to **any** recipient; **no domain needed**.
> 2. **Simulated** (not configured) — OTP codes are generated in-memory and logged to the **server console** in dev (`[otp] dev code for ...`). Dev only.
>
> In both paths the verified email is **upserted** into MongoDB (existing account → logs in; new email → creates a passwordless `user`) and the normal JWT cookie session is issued. Password sign-in stays independent.
>
> **Brevo setup:** add `BREVO_API_KEY` (https://brevo.com → Settings → API Keys → "SMTP API key") and set `BREVO_FROM_EMAIL` to an email you can receive a confirmation link at (Brevo → Senders → Create a Sender → verify). Once verified, any recipient can receive codes/receipts — no domain purchase required.

---

## 7. Data models

### User (`server/models/User.js`)
| Field | Type | Notes |
| --- | --- | --- |
| `name` | String (2–60) | required |
| `email` | String | unique (partial index, only when present), lowercased |
| `phone` | String | unique (partial index), 10-digit |
| `passwordHash` | String | bcrypt (12 rounds) |
| `role` | `'user' \| 'admin'` | default `user` |
| `passwordless` | Boolean | true when account was created via OTP |
| `isActive` | Boolean | disabled accounts can't sign in |
| `refreshTokenHash` | String | sha256 of current refresh token (rotation) |
| `cart[]` | { product (ObjectId ref Product), quantity (1–99) } | server-side cart; enriched with live product data when read |

Methods: `setPassword(plain)`, `verifyPassword(plain)`, `toSafeJSON()` (never exposes hash).

### Product (`server/models/Product.js`)
| Field | Type | Notes |
| --- | --- | --- |
| `name` | String (≤200) | required |
| `price` | Number | required, ≥ 0 |
| `mrp` | Number | optional; must be ≥ price |
| `description` | String (≤2000) | |
| `category` | String (≤100) | required |
| `image` | String (URL) | required |
| `images` | [String] | gallery (falls back to `[image]`) |
| `popularity` | Number (0–100) | used for ranking "popular" |
| `stock` | Number (0–9999) | live inventory; decremented on order, edited via admin |
| `dateAdded` | String (YYYY-MM-DD) | used for "newest" sorting |

### Order (`server/models/Order.js`)
| Field | Type | Notes |
| --- | --- | --- |
| `user` | ObjectId ref User | null for guest-placed (future) |
| `orderNumber` | String | unique, e.g. `ORD-xxxx` |
| `items[]` | { product, name, price, quantity (1–99), image } | snapshot at purchase time |
| `subtotal` / `shipping` / `total` | Number | server-computed |
| `status` | `Pending / Processing / Shipped / Delivered / Cancelled` | |
| `shippingInfo` | { firstName, lastName, email, phone, address, city, zip } | |
| `payment` | { method, razorpayOrderId, razorpayPaymentId, razorpaySignature, paid, paidAt } | |

---

## 8. Authentication & security

**Flow:**
1. Login/register/OTP → server signs an **access token** (15 min) and a **refresh token** (7 days).
2. Both are set as **httpOnly, SameSite=Strict** cookies (`secure` in production).
3. The refresh token is stored on the user as a **sha256 hash**; each `POST /auth/refresh` **rotates** it (new pair, old hash replaced) — stolen refresh tokens die on reuse.
4. `requireAuth` middleware verifies the access token and loads the user; disabled users are rejected.
5. Frontend `api/client.js` auto-retries once with `/auth/refresh` on a `401` (except for auth paths), via a shared single-flight promise.

**OTP sub-flow:** `/otp/request` emails a 6-digit code via Brevo (or logs it to the server console when Brevo isn't configured) → `/otp/verify` checks it against the in-memory store → the user is upserted in MongoDB by that email and a normal JWT session is issued. Brevo never issues the app's session.

**Other security:**
- `helmet` security headers, CORS with credentials, rate limiting on `/api/auth` (60 req / 15 min).
- bcrypt password hashing; passwords limited to ≤72 chars.
- Order prices are **recomputed server-side** from the database — the client can't alter totals.
- Payment signature verification uses `crypto.timingSafeEqual`.
- `errorHandler` normalizes errors (CastError, ValidationError, duplicate keys → friendly messages).

---

## 9. API reference

Base URL: `/api` (proxied to `:5000` in dev; same origin in prod).

### Auth (`/api/auth`)
| Method | Route | Access | Body | Returns |
| --- | --- | --- | --- | --- |
| POST | `/register` | public | `{ name, email, password }` | `{ user }` |
| POST | `/login` | public | `{ email, password }` | `{ user }` |
| POST | `/logout` | signed in | — | `{ ok: true }` |
| GET | `/me` | public | — | `{ user \| null }` |
| POST | `/refresh` | public | — | `{ user }` (rotates tokens) |
| POST | `/otp/request` | public | `{ email }` | `{ ok: true }` (code is emailed; in dev it's also logged to the server console when no email provider is configured) |
| POST | `/otp/verify` | public | `{ email, code }` | `{ user }` |

### Products (`/api/products`)
| Method | Route | Access | Notes |
| --- | --- | --- | --- |
| GET | `/` | public | list, sorted newest first |
| GET | `/:id` | public | single product |
| POST | `/` | admin | create |
| PUT | `/:id` | admin | update |
| DELETE | `/:id` | admin | delete |

Product body: `{ name, price, mrp?, description?, category, image, images?, popularity?, stock? }`.

### Orders (`/api/orders`)
| Method | Route | Access | Notes |
| --- | --- | --- | --- |
| POST | `/` | signed in | create order + Razorpay order; `{ order, payment }` |
| POST | `/:id/verify-payment` | owner/admin | verify Razorpay signature |
| GET | `/mine` | signed in | current user's orders |
| GET | `/all` | admin | all orders |
| GET | `/:id` | owner/admin | order detail |
| PATCH | `/:id/status` | admin | `{ status }` |

Create-order body: `{ items: [{ product, quantity }], shippingInfo: { firstName, lastName, email, phone?, address, city, zip } }`. The server re-fetches products, validates **stock** (rejects over-stock/out-of-stock line items with a clear error), computes `subtotal`/`shipping`/`total` itself, **atomically decrements stock**, creates the order (+ a Razorpay order only when keys are configured), and emails a confirmation receipt via Brevo.

### Users (`/api/users`)
| Method | Route | Access | Notes |
| --- | --- | --- | --- |
| PATCH | `/me` | signed in | `{ name, email?, phone? }` |
| PATCH | `/me/password` | signed in | `{ currentPassword, newPassword }` |
| GET | `/customers` | admin | list customers |
| PATCH | `/customers/:id` | admin | `{ isActive: boolean }` |

### Cart (`/api/cart`) — signed-in, server-side
| Method | Route | Body | Response |
| --- | --- | --- | --- |
| GET | `/` | — | `{ items: [{ id, name, price, mrp, image, category, stock, quantity }] }` (live product data) |
| POST | `/items` | `{ product, quantity }` | `{ items }` (increments quantity if already present) |
| POST | `/merge` | `{ items: [{ product, quantity }] }` | `{ items }` (bulk add, used to merge the guest's localStorage cart on sign-in) |
| PATCH | `/items/:productId` | `{ quantity }` | `{ items }` (`quantity ≤ 0` removes the item) |
| DELETE | `/items/:productId` | — | `{ items }` |
| DELETE | `/` | — | `{ ok: true }` (clears the cart) |

---

## 10. Frontend architecture

### Config-driven app (`src/config/site.js`)
This is the single place to rebrand for a client. It exports:

- `site` — `name`, `tagline`, `logo` (shown in the header/title).
- `theme` — every CSS variable (colors, gradients, radii, shadows). `main.jsx` copies these onto `:root` at startup, so they also appear in `index.css` and drive all component styles via `var(--...)`.
- `layout` — feature toggles: sticky header, max width, show search/cart/account/hamburger, search placeholder.
- `pricing` — currency, free-shipping threshold, shipping fee.
- `nav` — main links, guest actions, and the role-based account menu.

### Global state (Context)
Providers are nested in `App.jsx`:

```
AuthProvider → CartProvider → OrdersProvider → ProductsProvider → Router
```

| Context | State | Key actions |
| --- | --- | --- |
| Auth | `user`, `loading` | register, login, logout, requestOtp, verifyOtp, updateProfile, changePassword, `isAdmin` |
| Cart | `cartItems`, `isCartOpen` | addToCart, removeFromCart, updateQuantity, clearCart, `cartTotal`, `cartCount`, toggleCart |
| Products | `products`, `loading`, `error` | loadProducts, addProduct, updateProduct, deleteProduct |
| Orders | `orders` (mine or all by role), `loading` | addOrder, verifyOrderPayment, updateOrderStatus, getOrder |

Cart items are full product snapshots + `quantity`. **Signed in** → state is kept in sync with `/api/cart` (write-through mutations, merge of the guest cart on sign-in). **Signed out** → persisted to `localStorage` (key `shopeasy-cart`).

### Routing (`src/App.jsx`)
| Route | Page | Guard |
| --- | --- | --- |
| `/` | Home | — |
| `/products` | ProductListing | — |
| `/product/:id` | ProductDetail | — |
| `/cart` | Cart | — |
| `/login` `/register` `/otp` | auth pages | redirect if signed in |
| `/checkout` | Checkout | `UserRoute` |
| `/order/:id` | OrderConfirmation | `UserRoute` |
| `/account/orders` | OrderHistory | `UserRoute` |
| `/account/profile` | Profile | `UserRoute` |
| `/admin` | AdminDashboard | `AdminRoute` |

Guards (`UserRoute`/`AdminRoute`) render `null` while auth is loading, then `Navigate` to `/login` (remembering the origin via `location.state.from`) when unauthorized.

### Deterministic product extras
Real products store name/price/mrp/description/category/images/popularity/**stock**. Everything else "storefront-flavored" is derived deterministically from the product id via `src/utils/catalog.js`:
- `getBrand()` — pick from a category-based brand pool.
- `getRating()` / `getReviewCount()` — stable pseudo-random values.
- `getStock()` / `getStockCount()` — reads the **real `product.stock` field** (legacy products without one fall back to a deterministic pseudo-random value). `'out'` = 0, `'low'` = 1–2, else `'in'`.
- `getSpecs()`, `getOffer()`, `getDelivery()`, `getDeliveryDate()`.

This means you only manage a catalog of real fields (plus live stock); the card/detail UI always has data. Stock gates add-to-cart on the card, the detail page, and the cart, and the server enforces it at order time.

### Theming / design system
- Dark "neo-glass" palette: page `#0B1020`, surfaces `#141B34` / `#1A2340`, purple gradient `#7C3AED → #A855F7`, blue gradient `#2563EB → #06B6D4`, green accents `#22C55E`.
- All component CSS uses `var(--color-*)`, `var(--gradient-*)`, `var(--radius-*)`, etc. Rebranding = editing `theme` in `site.js` (or `index.css`).
- Reusable bits: `Reveal` scroll animations (`useInView`), `.btn-primary/.btn-secondary` button classes, scroll-to-section on hash links.

---

## 11. Cart & checkout flow (end-to-end)

1. **Add to cart** (any `ProductCard`, or ProductDetail) → `addToCart(product)` → count badge updates. **Signed in:** written to `/api/cart` (server). **Signed out:** persisted to `localStorage`.
2. **`/cart` page** → qty steppers (`updateQuantity`), remove, clear, MRP/discount/savings math, free-delivery progress bar. "Place Order" → `/checkout` (redirects to `/login` if signed out).
3. **Checkout** (`UserRoute`) → shipping form validates → `addOrder()` POSTs items + shipping info.
   - Server recomputes prices, creates the order, and (if Razorpay keys exist) creates a Razorpay order.
   - Cart is cleared immediately.
4. **Payment** → Razorpay popup opens (loaded lazily). On success, `verifyOrderPayment` verifies the signature server-side and marks the order paid → status `Processing`. If payment is dismissed/fails, the order stays `Pending` with a **Pay Now** button on the confirmation page.
5. **Order confirmation** → `/order/:id` shows success state, order summary, shipping address, and Pay Now when pending.

---

## 12. Admin dashboard (`/admin`)

Three tabs:

1. **Products** — table of all products (with live stock column); "Add Product" form + inline Edit/Delete. Fields: name, price, MRP, category, popularity (0–100), **stock (units)**, description, image URL.
2. **Orders** — expandable order cards: customer info, items, totals, and a status dropdown (`Pending → Processing → Shipped → Delivered → Cancelled`).
3. **Customers** — list of users with Enable/Disable. Disabling a user also clears their refresh token (kills their session).

---

## 13. Rebranding for a client (checklist)

1. **Brand identity** → `src/config/site.js`: `site.name`, `tagline`, `logo`; `theme` colors/gradients/fonts; `layout` toggles.
2. **Index metadata** → `index.html`: `<title>`, meta description, favicon (`public/favicon.svg`).
3. **Contact info** → `src/pages/Home.jsx` contact section (email/phone/hours) + footer links in `App.css`/`Home.jsx` legal copy.
4. **Currency & shipping** → `pricing` in `site.js` **and** `SHIPPING_FEE`/`FREE_SHIPPING_THRESHOLD`/`CURRENCY` in `.env` (server uses the env values).
5. **Catalog** → replace `src/data/products.js` (or add products via the admin dashboard) — seeds only run when the collection is empty.
6. **Payments** → set Razorpay keys in `.env`. Without keys, checkout works in "place order" mode.
7. **OTP email** → set `BREVO_API_KEY` + `BREVO_FROM_EMAIL` in `.env` (free 300 emails/day to any recipient, no domain needed — just verify your own email as sender at Brevo → Senders). Without keys, the dev fallback logs the code to the server console.
8. **Ambassador banner** → edit `AMBASSADORS` in `src/components/Ambassadors.jsx` (name, role, tagline, quote, image, collection, gradient colors) — or remove `<Ambassadors />` from `Home.jsx`.
9. **Footer/legal** → static sections in `src/pages/Home.jsx`.

---

## 14. Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Runs Vite + API together |
| `npm run dev:web` | Vite dev server only |
| `npm run dev:api` | Express API with `--watch` |
| `npm run build` | Production build into `dist/` |
| `npm run start` | API in production (serves `dist/`) |
| `npm run lint` | oxlint |
| `npm run preview` | Preview the built app |

---

## 15. Deployment

```sh
npm install
npm run build     # produces dist/
NODE_ENV=production npm run start   # Express serves dist/ + API on PORT
```

- Express serves the SPA with history fallback, so `/products`, `/cart`, etc. work on refresh.
- Set `COOKIE_SECURE=true` when behind HTTPS.
- Use a process manager (PM2 / systemd / Docker) to keep the server alive.
- **MongoDB:** use MongoDB Atlas (set `MONGO_URI` accordingly).
- **Razorpay:** switch from test keys to live keys.

---

## 16. Known limitations & notes

- **Cart is dual-mode** — signed-in users get a **server-side cart** (`/api/cart`, stored on the user, enriched with live product data, survives across devices). Guests get a `localStorage` cart that is **merged into the server cart on sign-in** and cleared. A signed-out user's cart won't persist across browsers.
- **OTP email delivery** — uses the **Brevo API** when `BREVO_API_KEY` + `BREVO_FROM_EMAIL` are set (free 300/day, no domain needed); otherwise a **simulated in-memory code** logged to the server console (dev only; the code is never returned to the browser). The in-memory verification store resets on server restart. OTP users who never set a password remain passwordless.
- **Real inventory tracking** — every product has a `stock` field (backfilled automatically on boot for legacy products). Adding to cart rejects out-of-stock and over-stock quantities (client- and server-side); placing an order **atomically decrements** stock (`$inc` with a `stock: { $gte: quantity }` guard; if any line fails mid-way the earlier lines are rolled back). Set stock from the admin Products tab.
- **Order confirmation emails** — when `BREVO_API_KEY` is configured, an order receipt (items, totals, status) is emailed to the shipping email on order creation (fire-and-forget, so a failed email never blocks checkout).
- **Products seed only when the collection is empty** — to reseed after manual changes, drop the collection or disable seeding first.
- The checkout flow uses Razorpay for INR; for other currencies/regions swap the gateway in `src/utils/razorpay.js` + `server/controllers/orderController.js`.
- `react-router` has a pre-existing npm audit advisory (RSC-mode CSRF) that does not affect this app's `BrowserRouter` usage.
- Lint baseline: 4 informational `react(only-export-components)` warnings from context files exporting `useX()` hooks — intentional.

---

## 17. Troubleshooting

| Symptom | Fix |
| --- | --- |
| `Missing required env var: JWT_SECRET` | Copy `.env.example` → `.env` and set `JWT_SECRET` |
| API won't start / Mongo error | Ensure MongoDB is running on `127.0.0.1:27017` |
| Admin can't sign in | Check `ADMIN_EMAIL`/`ADMIN_PASSWORD`; the account is created only once |
| Products show default images only | Images come from Unsplash URLs — they require internet |
| Cart empty on another device | Expected for guests — the server cart is only used once signed in; guest carts live in `localStorage` |
| "Payment verification failed" | Razorpay test mode: order must be paid in the same test key context |
| 401 loops in the browser | Clear cookies, or check `COOKIE_SECURE` is not `true` on HTTP |
| Frontend can't reach API | Dev: run `npm run dev` (Vite proxies `/api`); check `:5000` is up |
