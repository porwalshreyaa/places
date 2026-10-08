# 🌍 Places — Interactive Travel Scrapbook & Map

> **"Capture memories where they happened."**  
> *Places* is a full-stack digital travel scrapbook and interactive map application. It lets travelers pin destinations, draw hand-crafted doodles and routes on an interactive map canvas, record travel memories, customize visual themes, and share their journey with the world via a personalized public link.

---

## ✨ Features

- 🗺️ **Interactive Cartography**: Drop pins, search places, and view your travel journey on an interactive map powered by Leaflet & OpenStreetMap.
- 🎨 **Canvas Doodles & Route Marker**: Draw custom vector lines, arrows, stickers, and doodles directly on top of your interactive map.
- 📖 **Aesthetic Scrapbook Cards**: Log travel memories with photo uploads, dates, location tags, and private notes.
- 🎭 **Theme Store & Customization**: Change your diary's aesthetic, typography, header title, and subtitle using built-in themes.
- 🔗 **Public Memory Sharing**: Share your curated travel diary with friends and family using your unique public profile link (`/share/:username`).
- 🔒 **Authentication & Private Notes**: Secure user registration and login with JWT and encrypted password storage. Includes private "Notes to Self".
- 📊 **Admin Telemetry Dashboard**: Real-time system telemetry and platform statistics (total registered users, total destinations pinned, available themes).
- 📸 **Cloud Image Hosting**: Seamless integration with Catbox API for storing memory photos and scrapbook media.

---

## 🛠️ Monorepo Architecture

Ghoomi is structured as a clean, modular TypeScript monorepo using npm workspaces:

```
places/
├── packages/
│   ├── backend/               # Node.js + Express + TypeScript API Server
│   │   ├── src/
│   │   │   ├── config/        # Environment & server config
│   │   │   ├── controllers/   # Auth, Destinations, Themes, Admin controllers
│   │   │   ├── crud/          # Database query operations (Drizzle ORM)
│   │   │   ├── db/            # Database client & migrations
│   │   │   ├── middleware/    # Auth & error handling middleware
│   │   │   ├── routes/        # Express API route declarations
│   │   │   └── schema/        # Drizzle PostgreSQL table schemas
│   │   ├── drizzle.config.ts  # Drizzle ORM configuration
│   │   └── package.json
│   │
│   └── frontend/              # React 19 + Vite + Tailwind CSS v4 Single Page App
│       ├── src/
│       │   ├── atoms/         # Reusable UI components (Input, Button, etc.)
│       │   ├── components/    # Modals & feature components (ThemeStore, ShareModal, etc.)
│       │   ├── context/       # Auth state management (AuthContext)
│       │   ├── modules/       # Key feature domains (Admin, Auth, Map, Scrapbook)
│       │   ├── pages/         # Page views (LandingPage, LoginPage, AdminPage, PublicPage)
│       │   └── types/         # TypeScript interfaces & data contracts
│       ├── vite.config.ts     # Vite bundler & API proxy configuration
│       └── package.json
│
├── package.json               # Root workspace configuration & scripts
├── README.md                  # Project documentation
└── .env.example               # Root environment variable template
```

---

## 🚀 Quick Start & Local Setup

### Prerequisites
- **Node.js**: v20.x or higher
- **npm**: v10.x or higher
- **PostgreSQL**: Local instance or remote database (e.g., Supabase, Neon, Railway)

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/porwalshreyaa/places.git
cd places
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` into a new `.env` file at the root or within `packages/backend`:

```bash
# Backend Environment (.env or packages/backend/.env)
PORT=3000
DATABASE_URL="postgres://username:password@localhost:5432/ghoomi?sslmode=require"
JWT_SECRET="your-super-secret-jwt-key"
CATBOX_API_URL="https://catbox.moe/user/api.php"

# Frontend Environment (packages/frontend/.env)
VITE_API_URL="http://localhost:3000"
```

### 3. Run Database Migrations
Generate and push the database schema using Drizzle Kit:

```bash
cd packages/backend
npx drizzle-kit push
```

### 4. Run Development Servers
Run both backend and frontend concurrently from the root directory:

```bash
npm run dev
```

- **Frontend Application**: `http://localhost:5173` (or Vite dev port)
- **Backend API Server**: `http://localhost:3000`

---

## 🛠️ Build & Verification Commands

To verify TypeScript types and build both packages for production:

```bash
# Build all packages in the monorepo
npm run build

# Build frontend specifically
npm run build -w @ghoomi/frontend

# Build backend specifically
npm run build -w @ghoomi/backend
```

---

## ☁️ Deployment Guide (Render)

### Deploying Frontend on Render

1. Create a new **Web Service** or **Static Site** on Render connected to your repository.
2. Configure the following build settings:
   - **Root Directory**: `packages/frontend/`
   - **Build Command**: `npm install; npm run build`
   - **Publish Directory**: `packages/frontend/dist`
3. Add Environment Variables:
   - `VITE_API_URL`: `https://your-backend-api.onrender.com`

### Deploying Backend on Render

1. Create a new **Web Service** on Render.
2. Configure build settings:
   - **Root Directory**: `packages/backend/`
   - **Build Command**: `npm install; npm run build`
   - **Start Command**: `node dist/server.js`
3. Add Environment Variables:
   - `DATABASE_URL`: Your PostgreSQL connection string
   - `JWT_SECRET`: Secret key for JWT signing
   - `PORT`: `10000` (or Render's default port)

---

## 📐 Type System & Data Schemas

Places enforces strict TypeScript typing across all packages with **zero `any` or `unknown` type usages**. All payloads, domain records, and sanitizer inputs are governed by explicit interfaces:

### 1. Raw Destination Input (`RawDestinationInput`)
Complex incoming payload object (`d`) representing destination details sent from client requests or external API calls before database sanitization:

```typescript
/**
 * Complete raw destination record payload ("d") sent from client requests.
 */
export interface RawDestinationInput {
  id?: string | null;                  // Unique string identifier or null for auto-generated IDs
  name?: string | null;                // Name of destination
  country?: string | null;             // Country name
  coordinates?: RawCoordinatesInput | null; // Geographic coordinates
  description?: string | null;         // Brief tagline or summary
  image?: string | null;               // Image URL or base64 data URI
  notes?: string | null;               // Detailed scrapbook travel notes
  checklist?: RawChecklistItemInput[] | null; // Array of bucket list checklist items
  stickers?: RawStickerInput[] | null; // Array of draggable scrapbook stickers
}
```

### 2. Nested Sub-Payload Interfaces
- **`RawCoordinatesInput`**: `{ lat?: number | string | null; lng?: number | string | null; }`
- **`RawChecklistItemInput`**: `{ text?: string | null; checked?: boolean | null; }`
- **`RawStickerInput`**: `{ id?: string; type?: string; emoji?: string; label?: string; x?: number; y?: number; rotate?: number; scale?: number; }`
- **`RawMapDrawingInput`**: `{ id?: string; type?: string; color?: string; strokeWidth?: number; points?: Array<{ lat?: number; lng?: number }>; }`

### 4. Zod Schema Validation Layer
All API request bodies, queries, and parameters are validated using Zod schemas in [validators/index.ts](file:///home/shreya/Desktop/places/packages/backend/src/validators/index.ts):
- **`rawDestinationsListSchema`**: Validates destination array payloads in `POST /api/destinations`.
- **`userSettingsSchema`**: Validates user preferences, theme titles, and map drawings in `PUT /api/user-settings`.
- **`registerSchema` & `authSchema`**: Validates username, email, and password during auth requests in `POST /api/auth/register` and `POST /api/auth/login`.
- **`uploadPayloadSchema`**: Validates base64 image string & filename in `POST /api/upload`.
- **`createThemeSchema`**: Validates theme name, base color, and hex color map in `POST /api/themes`.
- **`checkAvailabilityQuerySchema`**: Validates query parameters for username/email availability checks in `GET /api/auth/check`.

---

## 📜 License

Distributed under the MIT License. See `LICENSE` for more details.
