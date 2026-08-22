import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { DollarSign, PieChart, Plus, ArrowLeft, Wallet, AlertCircle, TrendingUp, Calendar } from 'lucide-react';
import { tripService } from '../../services/tripService';
import { expenseService } from '../../services/expenseService';
import { Trip, Expense } from '../../types';
import { BudgetSummaryCards } from '../../components/budget/BudgetSummaryCards';
import { BudgetCharts } from '../../components/budget/BudgetCharts';
import { ExpenseList } from '../../components/budget/ExpenseList';
import { AddExpenseModal } from '../../components/budget/AddExpenseModal';
import { Button } from '../../components/common/Button';
import { Skeleton } from '../../components/common/Skeleton';
import { ErrorState } from '../../components/common/ErrorState';
import { formatCurrency, formatDateRange, calculateDaysBetween } from '../../utils/formatters';
import { useToast } from '../../context/ToastContext';

export const TripBudgetPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { success, error: toastError } = useToast();

  const [allTrips, setAllTrips] = useState<Trip[]>([]);
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [showAddExpenseModal, setShowAddExpenseModal] = useState(false);

  const fetchBudgetData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const trips = await tripService.getTrips();
      setAllTrips(trips);

      let current: Trip | undefined;
      if (id) {
        current = trips.find((t) => t.id === id);
      } else {
        current = trips.find((t) => t.status === 'planned' || t.status === 'ongoing') || trips[0];
      }

      if (current) {
        setSelectedTrip(current);
        const expensesData = await expenseService.getExpenses(current.id);
        setExpenses(expensesData || []);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load budget and expense records.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBudgetData();
  }, [id]);

  const handleAddExpense = async (data: any) => {
    if (!selectedTrip) return;
    try {
      await expenseService.addExpense(selectedTrip.id, data);
      success('Expense Logged', `"${data.title}" added to budget.`);
      await fetchBudgetData();
    } catch (err: any) {
      toastError('Failed to add expense', err.message);
    }
  };

  const handleDeleteExpense = async (expenseId: string) => {
    if (!selectedTrip) return;
    try {
      await expenseService.deleteExpense(selectedTrip.id, expenseId);
      success('Expense Removed', 'Expense was deleted from records.');
      await fetchBudgetData();
    } catch (err: any) {
      toastError('Failed to delete expense', err.message);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton height={100} className="rounded-2xl" />
        <Skeleton height={200} className="rounded-2xl" />
      </div>
    );
  }

  if (error || !selectedTrip) {
    return <ErrorState message={error || 'Trip not found'} onRetry={fetchBudgetData} />;
  }

  // Calculate totals
  const totalBudget = selectedTrip.budget || 0;
  
  // Calculate activity costs from stops
  const activityCostsTotal = (selectedTrip.stops || []).reduce(
    (acc, stop) => acc + (stop.activities || []).reduce((actAcc, a) => actAcc + (a.cost || 0), 0),
    0
  );

  const expensesTotal = expenses.reduce((sum, e) => sum + Number(e.amount || 0), 0);
  const totalSpent = expensesTotal + activityCostsTotal;
  const remainingBudget = totalBudget - totalSpent;
  const isOverBudget = remainingBudget < 0;

  const totalDays = Math.max(1, calculateDaysBetween(selectedTrip.startDate, selectedTrip.endDate));
  const dailyBurnRate = totalDays > 0 ? Math.round(totalSpent / totalDays) : 0;
  const recommendedDailyAllowance = totalDays > 0 && remainingBudget > 0 ? Math.round(remainingBudget / totalDays) : 0;

  return (
    <div className="space-y-6">
      {/* Top Header & Trip Selector */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <Link
              to={`/trips/${selectedTrip.id}`}
              className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Trip Workspace</span>
            </Link>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-2.5">
            <Wallet className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            <span>Budget & Financial Health</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Financial analytics, expense ledger, and spending forecasts for{' '}
            <strong className="text-slate-900 dark:text-slate-100 font-semibold">{selectedTrip.title}</strong>.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          {/* Trip Selector */}
          <select
            value={selectedTrip.id}
            onChange={(e) => {
              const chosen = allTrips.find((t) => t.id === e.target.value);
              if (chosen) {
                setSelectedTrip(chosen);
                expenseService.getExpenses(chosen.id).then((exp) => setExpenses(exp || []));
              }
            }}
            className="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/60 px-3.5 py-2 text-xs font-semibold text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-500 shadow-2xs cursor-pointer"
          >
            {allTrips.map((t) => (
              <option key={t.id} value={t.id} className="bg-white dark:bg-slate-900">
                {t.title} (Budget: {formatCurrency(t.budget)})
              </option>
            ))}
          </select>

          <Button
            variant="primary"
            size="sm"
            leftIcon={<Plus className="w-3.5 h-3.5" />}
            onClick={() => setShowAddExpenseModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-2xs rounded-xl px-4 py-2"
          >
            Log Expense
          </Button>
        </div>
      </div>

      {/* Summary Cards with Forecast */}
      <BudgetSummaryCards
        totalBudget={totalBudget}
        totalSpent={totalSpent}
        remainingBudget={remainingBudget}
        isOverBudget={isOverBudget}
      />

      {/* Burn Rate & Daily Allowance Metrics Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center gap-4 hover:shadow-md transition-all">
          <div className="p-3 rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400 border border-blue-100 dark:border-blue-900/40 flex-shrink-0">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 block">
              Avg. Daily Burn Rate
            </span>
            <div className="text-lg font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
              {formatCurrency(dailyBurnRate)} / day
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
              Calculated across {totalDays} total expedition days
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center gap-4 hover:shadow-md transition-all">
          <div className="p-3 rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/40 flex-shrink-0">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 block">
              Recommended Daily Limit
            </span>
            <div className="text-lg font-extrabold text-emerald-600 dark:text-emerald-400 tracking-tight">
              {formatCurrency(recommendedDailyAllowance)} / day
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
              Target daily pace for remaining {formatCurrency(Math.max(0, remainingBudget))}
            </p>
          </div>
        </div>
      </div>

      {/* Recharts Analytics */}
      <BudgetCharts expenses={expenses} activityCostsTotal={activityCostsTotal} />

      {/* Expenses Ledger */}
      <ExpenseList
        expenses={expenses}
        onAddExpense={() => setShowAddExpenseModal(true)}
        onDeleteExpense={handleDeleteExpense}
      />

      {/* Add Expense Modal */}
      <AddExpenseModal
        isOpen={showAddExpenseModal}
        onClose={() => setShowAddExpenseModal(false)}
        onAddExpense={handleAddExpense}
      />
    </div>
  );
};
