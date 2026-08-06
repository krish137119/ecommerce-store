# ShopEasy — E-commerce Store

Full-stack e-commerce app: React (Vite) frontend + Node/Express API + MongoDB.

## Stack

- **Frontend**: React 19, Vite 8, React Router 7, oxlint
- **Backend**: Node.js, Express, Mongoose, JSON Web Tokens (httpOnly cookies)
- **Database**: MongoDB
- **Security**: bcrypt password hashing, short-lived access tokens + rotating refresh tokens, httpOnly + SameSite=Strict cookies, helmet, rate-limited auth endpoints, server-side price recomputation for orders, role-based access control (admin/customer)

## Setup

1. MongoDB must be running locally (default: `mongodb://127.0.0.1:27017`).
2. Install dependencies:

   ```sh
   npm install
   ```

3. Create the environment file from the example and fill it in:

   ```sh
   cp .env.example .env
   ```

   `JWT_SECRET` must be set to a long random string:
   `node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"`

4. Run both the API and the web app:

   ```sh
   npm run dev
   ```

   - Web app: http://localhost:5173
   - API: http://localhost:5000 (`/api` is proxied by Vite)

## First boot

On first start the server seeds into MongoDB:

- An **admin** account from `ADMIN_EMAIL` / `ADMIN_PASSWORD` in `.env`
- The demo **products** (only while the products collection is empty; set `SEED_PRODUCTS=false` to disable)

Sign in as admin at `/login` to reach the **Admin Dashboard** (`/admin`), where admins manage products, order statuses, and customer accounts. Customers sign in with email/password or a mobile OTP at `/otp`.

## Scripts

| Command           | What it does                              |
| ----------------- | ----------------------------------------- |
| `npm run dev`     | Runs Vite + API together (concurrently)   |
| `npm run dev:web` | Vite dev server only                      |
| `npm run dev:api` | Express API with `--watch`                |
| `npm run start`   | Run the API in production (serves `dist`) |
| `npm run build`   | Build the frontend into `dist/`           |
| `npm run lint`    | Run oxlint                                |

## API overview

| Method   | Route                     | Access           | Purpose                    |
| -------- | ------------------------- | ---------------- | -------------------------- |
| POST     | `/api/auth/register`      | public           | Create customer account    |
| POST     | `/api/auth/login`         | public           | Email + password sign-in   |
| POST     | `/api/auth/logout`        | signed in        | Clear session              |
| GET      | `/api/auth/me`            | public           | Current session user       |
| POST     | `/api/auth/refresh`       | public           | Rotate tokens              |
| POST     | `/api/auth/otp/request`   | public           | Request mobile OTP         |
| POST     | `/api/auth/otp/verify`    | public           | Verify OTP + sign in       |
| GET      | `/api/products`           | public           | List products              |
| GET      | `/api/products/:id`       | public           | Single product             |
| POST     | `/api/products`           | admin            | Create product             |
| PUT      | `/api/products/:id`       | admin            | Update product             |
| DELETE   | `/api/products/:id`       | admin            | Delete product             |
| POST     | `/api/orders`             | signed in        | Place order                |
| GET      | `/api/orders/mine`        | signed in        | My orders                  |
| GET      | `/api/orders/all`         | admin            | All orders                 |
| GET      | `/api/orders/:id`         | owner or admin   | Order details              |
| PATCH    | `/api/orders/:id/status`  | admin            | Update order status        |
| PATCH    | `/api/users/me`           | signed in        | Update profile             |
| PATCH    | `/api/users/me/password`  | signed in        | Change password            |
| GET      | `/api/users/customers`    | admin            | List customers             |
| PATCH    | `/api/users/customers/:id`| admin            | Enable/disable customer    |

## Notes

- OTP is simulated (no SMS provider): in development the code is returned in the API response and shown on the `/otp` page. Wire a real SMS service into `server/controllers/authController.js` (`requestOtp`) for production.
- `react-router` has a pre-existing npm audit advisory (RSC-mode CSRF bypass) that does not affect this app's BrowserRouter usage.
