# 🌍 GlobeTrotter Frontend

> **"Plan. Explore. Experience."**
> A modern, personalized smart travel planning platform built with React, TypeScript, Vite, and Tailwind CSS.

---

## ✨ Features

- **Personalized Dashboard**: Visual trip cards, summary metrics (Active Trips, Destinations, Days Planned, Total Budget), trending destinations discovery.
- **Trip Management**: Create, edit, search, filter (Planned, Ongoing, Completed, Drafts), and delete travel journeys with confirmation dialogs.
- **Interactive Itinerary Builder**: Day-by-day destination stop timelines, schedule activities with time slots, categories, costs, notes, and completion toggles.
- **Global City Discovery**: Explore popular cities, filter by budget (Budget, Moderate, Luxury) and regions (Asia, Europe, etc.), view cost index and top attractions, and add destinations directly to trips.
- **Activity Exploration**: Discover things to do, filter by category (Sightseeing, Food & Dining, Adventure, Culture & History, etc.) and max price, and schedule directly into itinerary stops.
- **Budget & Cost Breakdown**: Real-time spending analytics with **Recharts** (Category Pie Chart and Cost Comparison Bar Chart), expense logging ledger, and over-budget warning alerts.
- **Travel Calendar & Schedule**: Interactive day carousel and visual timeline agenda for comprehensive schedule planning at a glance.
- **Public Itinerary Sharing**: Shareable `/shared/:shareId` read-only page accessible without login, complete with social sharing (WhatsApp, Twitter/X) and one-click copy links.
- **User Profile & Settings**: Custom display name, travel bio, preferred currency selector, and travel style preferences.

---

## 🛠️ Technology Stack

- **Framework**: React 19 + TypeScript
- **Bundler**: Vite
- **Styling**: Tailwind CSS v4
- **Routing**: React Router DOM (v7)
- **Icons**: Lucide React
- **Data Visualization**: Recharts
- **Forms & Validation**: React Hook Form + Zod
- **API Client**: Centralized Axios with Bearer token authentication & offline-resilient fallback layer

---

## 🚀 Quick Start

### 1. Install Dependencies

```bash
cd frontend
npm install
```

### 2. Environment Configuration

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Default contents:
```env
VITE_API_URL=http://localhost:5000/api
```

### 3. Start Development Server

```bash
npm run dev
```

The application will start on `http://localhost:5173`.

### 4. Build for Production

```bash
npm run build
```

---

## 📂 Project Architecture

```
frontend/
├── public/
├── src/
│   ├── components/
│   │   ├── common/       # Button, Input, Select, Modal, ConfirmDialog, Badge, Card, Skeleton, EmptyState, ErrorState
│   │   ├── layout/       # AppLayout, Sidebar, Topbar, Breadcrumbs, ProtectedRoute
│   │   ├── trips/        # TripCard, TripForm, TripFilter, TripStatusBadge
│   │   ├── itinerary/    # StopCard, ActivityItem, AddStopModal, AddActivityModal
│   │   ├── budget/       # BudgetSummaryCards, BudgetCharts, ExpenseList, AddExpenseModal
│   │   ├── cities/       # CityCard, CityFilter
│   │   └── activities/   # ActivityCard, ActivityFilter, AddToTripModal
│   ├── pages/
│   │   ├── auth/         # LoginPage, SignupPage
│   │   ├── dashboard/    # DashboardPage
│   │   ├── trips/        # TripsListPage, CreateTripPage, TripDetailPage, EditTripPage
│   │   ├── itinerary/    # ItineraryBuilderPage
│   │   ├── explore/      # ExploreCitiesPage, ExploreActivitiesPage
│   │   ├── budget/       # TripBudgetPage
│   │   ├── calendar/     # TripCalendarPage
│   │   ├── shared/       # SharedItineraryPage
│   │   └── profile/      # ProfilePage
│   ├── services/
│   │   ├── api.ts              # Centralized Axios client with JWT interceptor
│   │   ├── authService.ts      # Authentication endpoints
│   │   ├── tripService.ts      # Trip CRUD endpoints
│   │   ├── cityService.ts      # City exploration endpoints
│   │   ├── activityService.ts  # Activity discovery endpoints
│   │   ├── itineraryService.ts # Stop & activity management
│   │   ├── expenseService.ts   # Trip budget & expense tracking
│   │   ├── shareService.ts     # Public sharing endpoints
│   │   └── mockStorage.ts      # Offline dynamic fallback store
│   ├── context/
│   │   ├── AuthContext.tsx     # Authentication state & actions
│   │   └── ToastContext.tsx    # Toast notification system
│   ├── types/
│   │   └── index.ts            # Shared TypeScript type definitions
│   ├── utils/
│   │   ├── formatters.ts       # Date, currency, duration helpers
│   │   ├── validators.ts       # Zod validation schemas
│   │   └── mockData.ts         # Initial fallback seed data
│   ├── constants/
│   │   └── index.ts            # Categories, currencies, options
│   ├── App.tsx                 # Route definitions
│   ├── main.tsx                # React root mount
│   └── index.css               # Theme directives & scrollbars
├── .env.example
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

---

## 🔗 Backend REST API Contracts

All services communicate through `services/api.ts` using `VITE_API_URL`:

| Group | Method | Endpoint | Description |
|---|---|---|---|
| **Auth** | `POST` | `/api/auth/register` | Register new user |
| | `POST` | `/api/auth/login` | Log in user with credentials |
| | `GET` | `/api/auth/me` | Fetch authenticated user profile |
| **Trips** | `GET` | `/api/trips` | List all user trips |
| | `POST` | `/api/trips` | Create a new trip |
| | `GET` | `/api/trips/:id` | Fetch specific trip details |
| | `PUT` | `/api/trips/:id` | Update trip details |
| | `DELETE` | `/api/trips/:id` | Delete trip |
| **Cities** | `GET` | `/api/cities` | Search and list cities |
| | `GET` | `/api/cities/:id` | Fetch city details |
| **Activities** | `GET` | `/api/activities` | Search and filter activities |
| | `GET` | `/api/activities/:id` | Fetch activity details |
| **Trip Stops** | `POST` | `/api/trips/:id/stops` | Add destination stop |
| | `PUT` | `/api/trips/:id/stops/:stopId` | Update destination stop |
| | `DELETE` | `/api/trips/:id/stops/:stopId` | Remove destination stop |
| **Trip Activities** | `POST` | `/api/trips/:id/activities` | Add scheduled activity |
| | `DELETE` | `/api/trips/:id/activities/:activityId` | Remove scheduled activity |
| **Expenses** | `GET` | `/api/trips/:id/expenses` | List trip expenses |
| | `POST` | `/api/trips/:id/expenses` | Add expense entry |
| | `PUT` | `/api/trips/:id/expenses/:expenseId` | Update expense entry |
| | `DELETE` | `/api/trips/:id/expenses/:expenseId` | Delete expense entry |
| **Share** | `POST` | `/api/trips/:id/share` | Generate public share link |
| | `GET` | `/api/share/:shareId` | Get public shared itinerary |
