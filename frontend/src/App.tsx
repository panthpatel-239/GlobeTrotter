import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { ThemeProvider } from './context/ThemeContext';

// Layout & Route Guards
import { AppLayout } from './components/layout/AppLayout';
import { ProtectedRoute } from './components/layout/ProtectedRoute';

// Auth Pages
import { LoginPage } from './pages/auth/LoginPage';
import { SignupPage } from './pages/auth/SignupPage';

// Main Protected Pages
import { DashboardPage } from './pages/dashboard/DashboardPage';
import { TripsListPage } from './pages/trips/TripsListPage';
import { CreateTripPage } from './pages/trips/CreateTripPage';
import { TripDetailPage } from './pages/trips/TripDetailPage';
import { EditTripPage } from './pages/trips/EditTripPage';
import { ItineraryBuilderPage } from './pages/itinerary/ItineraryBuilderPage';
import { TripBudgetPage } from './pages/budget/TripBudgetPage';
import { TripCalendarPage } from './pages/calendar/TripCalendarPage';
import { ExploreCitiesPage } from './pages/explore/ExploreCitiesPage';
import { ExploreActivitiesPage } from './pages/explore/ExploreActivitiesPage';
import { ReservationsPage } from './pages/reservations/ReservationsPage';
import { DocumentsPage } from './pages/documents/DocumentsPage';
import { ChecklistPage } from './pages/checklist/ChecklistPage';
import { SavedItemsPage } from './pages/saved/SavedItemsPage';
import { ProfilePage } from './pages/profile/ProfilePage';

// Public Sharing Page
import { SharedItineraryPage } from './pages/shared/SharedItineraryPage';

export function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <ToastProvider>
          <AuthProvider>
            <Routes>
              {/* Public Auth Routes */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />

              {/* Public Shared Itinerary Route */}
              <Route path="/shared/:shareId" element={<SharedItineraryPage />} />

              {/* Protected Routes inside AppLayout */}
              <Route element={<ProtectedRoute />}>
                <Route element={<AppLayout />}>
                  <Route path="/" element={<Navigate to="/dashboard" replace />} />
                  <Route path="/dashboard" element={<DashboardPage />} />
                  
                  {/* Trips */}
                  <Route path="/trips" element={<TripsListPage />} />
                  <Route path="/trips/create" element={<CreateTripPage />} />
                  <Route path="/trips/new" element={<CreateTripPage />} />
                  <Route path="/trips/:id" element={<TripDetailPage />} />
                  <Route path="/trips/:id/edit" element={<EditTripPage />} />
                  <Route path="/trips/:id/itinerary" element={<ItineraryBuilderPage />} />
                  <Route path="/trips/:id/budget" element={<TripBudgetPage />} />
                  <Route path="/trips/:id/calendar" element={<TripCalendarPage />} />

                  {/* Direct Planning & Management Views */}
                  <Route path="/calendar" element={<TripCalendarPage />} />
                  <Route path="/budget" element={<TripBudgetPage />} />
                  <Route path="/reservations" element={<ReservationsPage />} />
                  <Route path="/documents" element={<DocumentsPage />} />
                  <Route path="/checklist" element={<ChecklistPage />} />
                  <Route path="/saved" element={<SavedItemsPage />} />

                  {/* Explore */}
                  <Route path="/explore/cities" element={<ExploreCitiesPage />} />
                  <Route path="/explore/activities" element={<ExploreActivitiesPage />} />

                  {/* Profile */}
                  <Route path="/profile" element={<ProfilePage />} />
                </Route>
              </Route>

              {/* Fallback Catch-all Route */}
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </AuthProvider>
        </ToastProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
