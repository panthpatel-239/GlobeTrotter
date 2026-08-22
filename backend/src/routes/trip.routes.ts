import { Router } from 'express';
import { TripController } from '../controllers/trip.controller';
import { ItineraryController } from '../controllers/itinerary.controller';
import { ExpenseController } from '../controllers/expense.controller';
import { BudgetController } from '../controllers/budget.controller';
import { ShareController } from '../controllers/share.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { validateRequest } from '../middleware/validate.middleware';
import { createTripSchema, updateTripSchema } from '../validators/trip.validator';
import { createStopSchema, updateStopSchema, createTripActivitySchema } from '../validators/itinerary.validator';
import { createExpenseSchema, updateExpenseSchema } from '../validators/expense.validator';

const router = Router();

// All trip routes require authentication
router.use(authMiddleware);

// --- TRIPS CRUD ---
// GET /api/trips
router.get('/', TripController.getTrips);

// POST /api/trips
router.post('/', validateRequest(createTripSchema), TripController.createTrip);

// GET /api/trips/:id
router.get('/:id', TripController.getTripById);

// PUT /api/trips/:id
router.put('/:id', validateRequest(updateTripSchema), TripController.updateTrip);

// DELETE /api/trips/:id
router.delete('/:id', TripController.deleteTrip);

// --- ITINERARY STOPS ---
// POST /api/trips/:id/stops
router.post('/:id/stops', validateRequest(createStopSchema), ItineraryController.addStop);

// PUT /api/trips/:id/stops/:stopId
router.put('/:id/stops/:stopId', validateRequest(updateStopSchema), ItineraryController.updateStop);

// DELETE /api/trips/:id/stops/:stopId
router.delete('/:id/stops/:stopId', ItineraryController.deleteStop);

// --- TRIP ACTIVITIES ---
// POST /api/trips/:id/activities
router.post('/:id/activities', validateRequest(createTripActivitySchema), ItineraryController.addTripActivity);

// DELETE /api/trips/:id/activities/:activityId
router.delete('/:id/activities/:activityId', ItineraryController.deleteTripActivity);

// --- EXPENSES ---
// GET /api/trips/:id/expenses
router.get('/:id/expenses', ExpenseController.getExpenses);

// POST /api/trips/:id/expenses
router.post('/:id/expenses', validateRequest(createExpenseSchema), ExpenseController.addExpense);

// PUT /api/trips/:id/expenses/:expenseId
router.put('/:id/expenses/:expenseId', validateRequest(updateExpenseSchema), ExpenseController.updateExpense);

// DELETE /api/trips/:id/expenses/:expenseId
router.delete('/:id/expenses/:expenseId', ExpenseController.deleteExpense);

// --- BUDGET ---
// GET /api/trips/:id/budget
router.get('/:id/budget', BudgetController.getBudget);

// --- SHARE ---
// POST /api/trips/:id/share
router.post('/:id/share', ShareController.enableShare);

export default router;
