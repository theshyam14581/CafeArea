# The Good Cup · Cafe Management

A React/Vite customer site and owner dashboard with an Express/Mongoose API. The sample menu and cafe branding are demo data. Customer cart/preferences use browser storage; orders and owner records are stored in MongoDB when the backend is configured.

## Architecture and flow

- **Frontend:** React, Vite, Tailwind CSS v4, React Router, Lucide icons. Public routes are `/`, `/menu`, `/item/:id`, `/cart`, `/checkout`, and `/order-confirmation`. `/admin` has owner login and the protected owner workspace.
- **Backend:** Express API under `/api`, with CORS, Helmet, rate limits, Zod input validation, Mongoose models, bcrypt owner passwords, and JWT-protected business endpoints.
- **Database:** `Owner` stores the hashed owner password; `Category` and `MenuItem` hold editable menu data; `Order` embeds an immutable item/price snapshot and invoice number; `CafeSettings` stores tax and cafe configuration.
- **Order flow:** Checkout posts item IDs and quantities. The API loads current available menu items, calculates totals, and saves an order. The confirmation page offers a print action and a WhatsApp click-to-chat link. WhatsApp opens a prefilled message; the customer must tap Send. Automated outbound notifications need separately configured WhatsApp Business Cloud API credentials and templates.

## Run locally

1. Install Node.js 20 or newer and MongoDB Atlas (or a local MongoDB instance).
2. Install packages: `npm install`.
3. Copy `.env.example` to `.env`. Fill in the Atlas URI, a long random `JWT_SECRET`, and unique owner email/password. Configure the database network allowlist in Atlas.
4. Create the owner login: `npm run seed-owner`.
5. Seed the demo menu once: `npm run seed-menu`.
6. Start the API in one terminal: `npm run server`.
7. Start the frontend in another terminal: `npm run dev`.
8. Open the Vite URL. Owner login is available from the header at `/admin`.

The public menu page uses the curated sample menu in `src/data/menu.js`; `npm run seed-menu` puts matching IDs and trusted prices into MongoDB for orders. Never place Atlas credentials, JWT secrets, or WhatsApp API tokens in frontend variables.

## Deploy to Render

The repo includes `render.yaml` for a single Render web service. Express serves both the built Vite site and the `/api` routes, so the customer app and backend share one origin.

1. Create a MongoDB Atlas cluster and database user. In Atlas **Network Access**, temporarily allow your current IP so you can seed the database. Keep `MONGODB_URI` private.
2. On your computer, set the Atlas URI and owner credentials in `.env`, then run `npm run seed-owner` and `npm run seed-menu` once.
3. In Render, choose **New → Blueprint**, connect `theshyam14581/CafeArea`, and select the `main` branch. Render reads `render.yaml`; enter the prompted `MONGODB_URI`, `OWNER_EMAIL`, `OWNER_PASSWORD`, and `CAFE_WHATSAPP` values. Keep the generated `JWT_SECRET` private.
4. After the first deploy, open the service’s **Connect → Outbound** details and add the listed Render IP ranges to the Atlas IP access list. Atlas accepts trusted addresses and CIDR ranges; avoid `0.0.0.0/0` because it allows connection attempts from anywhere.
5. Wait for the `/api/health` deploy check to pass, then open the `onrender.com` URL. Sign in at `/admin`.

Render can redeploy from the connected GitHub branch after future pushes. The free web service may sleep while idle, so its first request after inactivity can take longer. See [Render’s Express deployment guide](https://render.com/docs/deploy-node-express-app), [Render environment variables](https://render.com/docs/configure-environment-variables), and [Atlas IP access lists](https://www.mongodb.com/docs/atlas/security/add-ip-address-to-list/).

## API routes

| Route | Access | Purpose |
| --- | --- | --- |
| `POST /api/auth/login`, `GET /api/auth/me` | Public / owner | Owner JWT session |
| `GET /api/menu`, `GET /api/menu/categories` | Public | Available menu and categories |
| `POST /api/menu`, `PATCH /api/menu/:id`, `DELETE /api/menu/:id` | Owner | Create, edit, deactivate items |
| `POST /api/orders` | Public | Validate and create an order using database prices |
| `GET /api/orders`, `GET /api/orders/:id`, `PATCH /api/orders/:id/status`, `PATCH /api/orders/:id/payment` | Owner | Order desk, status and payment updates |
| `GET /api/billing`, `GET /api/billing/:id` | Owner | Invoice snapshots and billing history |
| `GET /api/customers`, `GET /api/reports/summary` | Owner | Customer rollup and sales summary |
| `GET /api/settings`, `PATCH /api/settings` | Owner | Cafe configuration |
| `POST /api/whatsapp/order/:id` | Owner | Create a click-to-chat URL for an order |
| `GET /api/health` | Public | API health |

## Production notes

Set `CLIENT_ORIGIN` to the deployed frontend origin, use HTTPS, rotate all credentials, and provision MongoDB least-privilege access. Seed menu/category records before switching off the demo menu. WhatsApp click-to-chat needs a real cafe WhatsApp number; use `VITE_CAFE_WHATSAPP` only for that public phone number. Do not use it for API credentials. The admin menu screen currently demonstrates local editing; wire it to the protected menu routes to persist edits. Online payment processing and automatic WhatsApp notifications require provider accounts and webhook verification and are not represented as active integrations here.
