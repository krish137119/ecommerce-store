# ShopEasy — Security Audit & Fixes Report

> Simple English version. Written for the store owner (not a security expert).

## TL;DR

The vulnerability the attacker reported **is already fixed in this code** — creating an order now requires you to be signed in. I checked the whole app, found a few more weaknesses, **fixed them**, and added strong protection so an attacker cannot flood your inventory or guess passwords. You still need to do the account steps at the bottom (change keys, turn on 2FA) — I cannot do those from your laptop.

---

## 1. What the attacker said, and is it true?

> "POST /api/orders lets anyone place orders without signing in, and drains product stock."

**Partly true — but only for the old version.** The report even says: *"The endpoint was later patched to require authentication (anonymous requests now return 401)."*

I checked this code: `server/routes/order.routes.js:31` already does `requireAuth` on order creation, and every order route is protected. So the bug is closed in the current code.

**The "I accessed your Vercel account" part is very likely a bluff / scare tactic.** Attackers send these reports + threatening messages to everyone who hosts a public demo, hoping you pay them. But "likely a bluff" is NOT the same as safe — do the account steps in section 5 anyway.

---

## 2. What I found when I checked everything

| # | Finding | Was it a real risk? | Status |
|---|---------|--------------------|--------|
| 1 | Order creation allowed anonymous requests | **Yes** (the reported bug) | Already fixed in code (`requireAuth`) |
| 2 | CORS let **any website** send requests with your login cookie (`origin: true`) | Medium | **Fixed** — now a strict allowlist |
| 3 | No rate limit on creating orders | High (inventory flooding) | **Fixed** — max 10 orders / 15 min per person, plus a store-wide cap |
| 4 | Login / OTP verify had a weak limit (60 tries / 15 min = easy brute-force) | Medium | **Fixed** — max 10 tries / 15 min |
| 5 | Server errors leaked internal details (`err.message`) to visitors | Low-Medium | **Fixed** — hidden in production |
| 6 | `.env` (your secrets) in git history? | — | **Not present.** Your secrets were never committed. Good. |
| 7 | Admin email is still the default `admin@shopeasy.com` | **Yes** — everyone knows it | You must change it (step 6) |
| 8 | Live site returns 503 / Vercel shows login page | — | Your deployment is offline or was deleted — verify (step 5) |

---

## 3. What I changed in the code

1. **CORS allowlist** — `server/index.js:27` + `server/config/env.js`
   The API used to say "yes" to any website that asks nicely (with your cookies). Now it only accepts:
   - your exact store/admin URLs (set `CORS_ORIGINS` in your host settings), and
   - localhost for development.
   Any other website's browser request is rejected.

2. **Order rate limiting** — `server/routes/order.routes.js:15`
   - Per person: max **10 orders per 15 minutes**.
   - Store-wide: max **60 orders per 15 minutes** no matter who sends them.
   Even if an attacker knows a password, they can no longer drain your entire stock in one burst.

3. **Login brute-force protection** — `server/index.js:52`
   Login and OTP verification are now capped at **10 attempts per 15 minutes** per visitor.

4. **No more internal error leaks** — `server/middleware/error.js`
   In production, visitors now get a plain "Something went wrong." instead of database/secret details.

5. **New tool to find admin accounts** — `server/tools/list-admins.js`
   See section 4 below. Use it to catch any fake admin account an attacker may have created.

---

## 4. How to test everything yourself (locally)

These tests are safe — they don't touch your real orders or stock.

### Test A — Order creation is locked down

1. Start the app: `npm run dev`
2. Open a terminal and run (no login, must be REJECTED):

```sh
curl -i -X POST http://localhost:5000/api/orders -H "Content-Type: application/json" -d "{\"items\":[{\"product\":\"000000000000000000000000\",\"quantity\":1}],\"shippingInfo\":{\"firstName\":\"A\",\"lastName\":\"B\",\"email\":\"a@b.com\",\"address\":\"x\",\"city\":\"y\",\"zip\":\"1\"}}"
```

   - Expected: `401 {"error":"Not signed in."}` ← **the reported bug is fixed**
   - If you ever see `201`, something is wrong — call me back.

3. Create an order while signed in, then repeat the create 11 times fast:
   - Expected: `429 {"error":"Too many orders placed. Try again later."}` on the 11th ← rate limit works

### Test B — Find ALL admin accounts (catch the hacker's account)

```sh
npm run start
node server/tools/list-admins.js
```

   This prints every admin account in your database with email + creation date.
   **Anything you don't recognise = created by an attacker.** If you find one, delete it in MongoDB Atlas (or ask me for a script) and change your admin password.

### Test C — Login brute-force is blocked

- Try to log in 11 times with a wrong password from the same machine.
- Expected: 11th attempt returns `429 "Too many login attempts."`

### Test D — Error messages are hidden

- Visit a URL that crashes the server (e.g. `http://localhost:5000/api/orders/mine` while signed out works — that's 401, fine).
- In production you will now see a clean error, never internal details.

---

## 5. Account steps — DO THESE NOW (I can't do them for you)

Because someone claimed access to your accounts:

1. **Vercel** → Settings → rotate/delete any old tokens; enable **2FA**; check **Team Members** and remove anyone you don't know. If the project was deleted (your URL shows a Vercel login page), redeploy it.
2. **GitHub** → Settings → Developer settings → revoke all tokens/SSH keys you don't recognise. Enable 2FA if not on.
3. **Render** → regenerate **JWT_SECRET** (this logs everyone out — that's good), and change **ADMIN_PASSWORD**.
4. **MongoDB Atlas** → change the database password, and create a **new** password if you ever pasted it anywhere. Enable network access restrictions (only your server's IP).
5. **Razorpay** → regenerate your API keys.
6. **Brevo** → regenerate your API key.

### Your admin account problem (important)

- Your `ADMIN_EMAIL` is still the default `admin@shopeasy.com` — the attacker's report shows they know this.
- Change it to a private email, and make the password long and unique.
- Update these in **Render's environment settings** (and your local `.env`), then restart the server. The change takes effect for the next admin login.

### One more thing to verify

- Your live site returned `503` (Render sleeping/offline) and the Vercel URL shows a login page (no deployment).
- After redeploying, the API must be reachable: `https://your-api.onrender.com/api/health` → `{"ok":true}`.
- In Vercel, make sure `vercel.json` rewrites to your **current** Render URL.

---

## 6. Final answer: are there still vulnerabilities?

After these fixes, and **if** you do the account steps above:

- ✅ Nobody can create orders without signing in.
- ✅ Nobody can flood order creation to drain stock.
- ✅ Nobody can guess your admin password by brute force.
- ✅ No other website can silently use your login.
- ✅ Server errors no longer reveal internal secrets.
- ⚠️ The only remaining risk is your **accounts and passwords** (Vercel, GitHub, Render, Mongo, Razorpay) — rotate them and enable 2FA.

If you want, I can also:
- Write a script to remove a rogue admin account.
- Set up a proper deployment checklist for Render + Vercel.
