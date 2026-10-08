# Architecture Decisions, Technical Choices, and Rationale

This document records all architectural decisions, design choices, technical trade-offs, and underlying rationale implemented across the **Places (Ghoomi)** monorepo.

---

## 1. Monorepo Architecture & Workspaces

### Decision
Structured the project as npm workspaces containing three distinct packages:
- `@ghoomi/shared` (`packages/shared`): Data models, TypeScript interfaces, and Zod validation schemas.
- `@ghoomi/backend` (`packages/backend`): Express REST API, Drizzle ORM database layer, error middleware, and domain services.
- `@ghoomi/frontend` (`packages/frontend`): Vite + React single-page application with Leaflet map, scrapbook UI, and responsive modal controllers.

### Rationale
- **Single Source of Truth**: Sharing types (`Destination`, `MapDrawing`, `User`) and Zod schemas (`authSchema`, `destinationsListSchema`) between frontend and backend prevents data contract drift.
- **Strict Separation of Concerns**: Isolates backend business logic from frontend component rendering while maintaining full TypeScript type safety across package boundaries.

---

## 2. Map Engine, Tile Provider & Zoom Range

### Decision
1. **100% Free Open-Source OpenStreetMap (OSM) Tiles**:
   - Tile URL: `https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png`
   - Attribution: `&copy; OpenStreetMap contributors`
2. **Unlocked Zoom Range (Zoom 2 to 19)**:
   - Configured `<MapContainer minZoom={2} maxZoom={19}>` and `<TileLayer maxZoom={19}>`.
3. **Dynamic Leaflet View Controller (`MapViewController`)**:
   - Executes `map.invalidateSize()` 150ms post-mount.
   - Triggers `map.flyTo()` when selecting pins and `map.fitBounds()` when displaying the full map.

### Rationale
- **Zero Cost & Zero API Keys**: Commercial tile providers (e.g. Mapbox, Google Maps, CartoDB paid tiers) impose usage caps, billing risks, or key requirements. Standard OSM is 100% free, open-source, and keyless.
- **Street-Level Precision**: Capping zoom at 8 (1 pixel ≈ 600m) previously made precise pins (e.g. Dwarka at `22.2442, 68.9685`) appear misplaced or off-coast. Zoom 19 allows zooming directly down to city streets and coastlines.
- **DOM Container Invalidation**: Leaflet calculates tile canvas bounds upon mounting. In responsive flex/grid layouts, executing `map.invalidateSize()` ensures marker pixel positions accurately align with map coordinates.

---

## 3. Real-World Geocoding & Coordinate Editing

### Decision
1. **OpenStreetMap Nominatim Geocoding**:
   - Integrated live place search (`https://nominatim.openstreetmap.org/search?format=json&q=...`) into `NewDestinationModal`, `DestinationDetail`, and `EditCoordinatesModal`.
2. **Interactive Map Pin Dragging**:
   - Set Leaflet `Marker` `draggable={isEditable}` and attached `dragend` event handlers to update coordinates upon mouse release.
3. **Standalone `EditCoordinatesModal`**:
   - Accessible via an "Edit Pin" button (`Edit3`) on each polaroid card in the Wishlist Photo Journal list.

### Rationale
- **Flexibility**: Users can set or correct pin locations via three distinct pathways:
  1. Searching location names (e.g., `"Dwarika, Gujarat"`).
  2. Dragging map markers visually to exact spots.
  3. Entering explicit numeric Latitude/Longitude values.
- **Precision Guard**: Clamps coordinates to valid geographic bounds (`[-90, 90]` for latitude, `[-180, 180]` for longitude) and rounds to 4 decimal places (~11-meter precision), eliminating floating-point rounding noise.

---

## 4. UX & Non-Intrusive Auto-Save

### Decision
1. **Dual-Layer Debouncing**:
   - 300ms debouncing on local text inputs (`name`, `description`, `notes`).
   - 800ms debouncing on network sync API requests (`POST /api/destinations`).
2. **Silent Status Indicator Badge**:
   - Replaced browser `alert()` popups with a subtle status badge (`Saved` / `Saving...` / `Syncing...`) in `ScrapbookHeader`.

### Rationale
- **User Experience**: Disruptive `alert()` dialogs while typing interrupted user input focus. Debouncing reduces unnecessary network requests while keeping UI state smooth and non-blocking.
- **Data Safety**: Pending debounced changes are automatically flushed on component unmount or tab close.

---

## 5. Backend Layered Architecture & Error Handling

### Decision
1. **Custom Exception Hierarchy (`packages/backend/src/utils/errors.ts`)**:
   - `AppError` base class extending `Error`.
   - Specialized subclasses: `BadRequestError` (400), `UnauthorizedError` (401), `ForbiddenError` (403), `NotFoundError` (404), `ConflictError` (409), `InternalServerError` (500).
2. **Central Error Handling Middleware (`errorMiddleware.ts`)**:
   - Intercepts all unhandled controller exceptions and formats standard JSON error responses: `{ error: string, statusCode: number }`.
3. **Decoupled Service Layer**:
   - Extracted database queries into `user.service.ts`, `destinations.service.ts`, and `admin.service.ts`.

### Rationale
- **Maintainability**: Controller functions remain lean and focused solely on request parsing and response delivery, delegating business rules to services and error formatting to middleware.
- **Robust Security**: Prevents raw database stack traces from leaking to the client during runtime errors.

---

## 6. Build & Compilation Assurance

### Decision
- Enforced strict import verification across all frontend files (e.g., importing `sanitizeCoordinate` in `DestinationDetail.tsx`).
- Guaranteed clean TypeScript compilation (`tsc -b && vite build`) across all npm workspaces.

### Rationale
- Fixes Render deployment build failures (`TS2304`) and ensures zero production build regressions.
