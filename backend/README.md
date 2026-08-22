# GlobeTrotter Backend API ✈️🌍

Robust, scalable, and type-safe REST API server for the **GlobeTrotter** travel planner application, built with Node.js, Express.js, TypeScript, PostgreSQL, and Prisma ORM.

---

## 🛠️ Technology Stack

- **Runtime & Language**: Node.js & TypeScript (Strict Mode)
- **Web Framework**: Express.js
- **Database**: PostgreSQL (Relational Database)
- **ORM**: Prisma ORM
- **Authentication**: JWT (JSON Web Tokens) with `bcryptjs` password hashing
- **Validation**: Zod request schema validation
- **CORS**: Configured for `http://localhost:5173` (Vite / React Frontend)
- **Configuration**: `dotenv` with type-safe environment variables

---

## 🗄️ Relational Database Architecture

The PostgreSQL schema (`prisma/schema.prisma`) models the full travel lifecycle:

```
User (1) ───< Trip (N)
               ├───< TripStop (N) ─── (1) City ───< (N) Activity
               ├───< TripActivity (N) ─── (1) Activity
               └───< Expense (N)
```

### Models:
1. **User**: `id`, `name`, `email` (unique), `passwordHash`, `profileImage`, `createdAt`, `updatedAt`
2. **Trip**: `id`, `userId`, `title`, `description`, `startDate`, `endDate`, `coverImage`, `budgetLimit`, `isPublic`, `shareId` (unique), `createdAt`, `updatedAt`
3. **City**: `id`, `name`, `country`, `description`, `image`, `costIndex` (1-5), `popularity` (0-100), `createdAt`
4. **TripStop**: `id`, `tripId`, `cityId`, `arrivalDate`, `departureDate`, `order`, `createdAt`
5. **Activity**: `id`, `cityId`, `name`, `description`, `category`, `estimatedCost`, `duration`, `image`, `createdAt`
6. **TripActivity**: `id`, `tripStopId`, `activityId`, `date`, `startTime`, `cost`, `createdAt`
7. **Expense**: `id`, `tripId`, `category` (transport, accommodation, activities, food, other), `description`, `amount`, `date`, `createdAt`

---

## 🚀 Quick Start Guide

### 1. Environment Setup

Create `backend/.env` (or copy from `backend/.env.example`):

```env
PORT=5000
DATABASE_URL="postgresql://postgres:postgres@localhost:5433/globetrotter"
JWT_SECRET="globetrotter_super_secret_jwt_key_hackathon_2026"
FRONTEND_URL="http://localhost:5173"
NODE_ENV="development"
```

### 2. Install Dependencies

```bash
cd backend
npm install
```

### 3. Setup Database Schema & Seed Data

```bash
# Push schema to PostgreSQL
npm run prisma:push

# Generate Prisma Client
npm run prisma:generate

# Seed PostgreSQL with 16 cities, 60+ activities, and demo trip
npm run prisma:seed
```

### 4. Start Server

```bash
# Development (with hot-reload)
npm run dev

# Production Build & Start
npm run build
npm run start
```

### 5. Run Automated API Tests

```bash
npm run test:api
```

---

## 🔑 Demo Account Credentials

A demo account with pre-seeded trips and expenses is available out of the box:

- **Email**: `traveler@globetrotter.com`
- **Password**: `Traveler@123`
- **Showcase Public Share ID**: `gt-goldentriangle-2026`

---

## 📡 API Reference & Endpoints Contract

Base URL: `http://localhost:5000/api`

### 1. Health Check
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/api/health` | Public | Live API & PostgreSQL connectivity status |

### 2. Authentication
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/api/auth/register` | Public | Register new user `{ name, email, password, profileImage? }` |
| `POST` | `/api/auth/login` | Public | Login `{ email, password }` -> returns token & safe user |
| `GET` | `/api/auth/me` | Bearer JWT | Returns current authenticated user |

### 3. User Management
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/api/users/me` | Bearer JWT | Retrieve logged-in user profile |
| `PUT` | `/api/users/me` | Bearer JWT | Update `{ name?, profileImage?, currentPassword?, newPassword? }` |
| `DELETE` | `/api/users/me` | Bearer JWT | Delete user account and cascade delete user data |

### 4. Cities & Activities (Dynamic PostgreSQL Search)
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/api/cities` | Public | List cities (query filters: `?search=jaipur&country=India&costIndex=2`) |
| `GET` | `/api/cities/:id` | Public | Get single city with full activity list |
| `GET` | `/api/activities` | Public | List activities (filters: `?cityId=...&search=...&category=...`) |
| `GET` | `/api/activities/:id` | Public | Get activity details with city information |

### 5. Trips Management
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/api/trips` | Bearer JWT | List current user's trips with destinations count & total expenses |
| `POST` | `/api/trips` | Bearer JWT | Create trip `{ title, description?, startDate, endDate, coverImage?, budgetLimit? }` |
| `GET` | `/api/trips/:id` | Bearer JWT | Get full trip itinerary, stops, activities & expenses |
| `PUT` | `/api/trips/:id` | Bearer JWT | Update trip details |
| `DELETE` | `/api/trips/:id` | Bearer JWT | Delete trip (cascades stops, activities, expenses) |

### 6. Itinerary Stops & Planned Activities
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/api/trips/:id/stops` | Bearer JWT | Add city stop `{ cityId, arrivalDate, departureDate, order? }` |
| `PUT` | `/api/trips/:id/stops/:stopId` | Bearer JWT | Update stop dates or reorder |
| `DELETE` | `/api/trips/:id/stops/:stopId` | Bearer JWT | Delete stop and its scheduled activities |
| `POST` | `/api/trips/:id/activities` | Bearer JWT | Add activity to stop `{ tripStopId, activityId, date, startTime?, cost? }` |
| `DELETE` | `/api/trips/:id/activities/:activityId` | Bearer JWT | Remove planned activity from stop |

### 7. Expenses & Budget Calculation
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/api/trips/:id/expenses` | Bearer JWT | List all logged expenses for trip |
| `POST` | `/api/trips/:id/expenses` | Bearer JWT | Log expense `{ category, description, amount, date }` |
| `PUT` | `/api/trips/:id/expenses/:expenseId` | Bearer JWT | Update expense entry |
| `DELETE` | `/api/trips/:id/expenses/:expenseId` | Bearer JWT | Delete expense entry |
| `GET` | `/api/trips/:id/budget` | Bearer JWT | Dynamic budget breakdown (category totals, remaining, isOverBudget) |

### 8. Public Itinerary Sharing
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/api/trips/:id/share` | Bearer JWT | Enable sharing & generate unique `shareId` |
| `GET` | `/api/share/:shareId` | **Public (No Auth)** | Safe read-only itinerary view (No private email or expenses exposed) |

---

## 📦 Consistent JSON Response Formats

### Success Response:
```json
{
  "success": true,
  "data": {
    "id": "c1f72b6b-...",
    "title": "Rajasthan Royal Heritage"
  }
}
```

### Error Response:
```json
{
  "success": false,
  "message": "End date must be on or after start date",
  "errors": [
    {
      "field": "endDate",
      "message": "End date must be on or after start date"
    }
  ]
}
```
