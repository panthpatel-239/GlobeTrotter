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
      <div className="bg-white dark:bg-[#1C1C1E] p-5 rounded-2xl border border-black/[0.08] dark:border-white/[0.10] shadow-card flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Link
              to={`/trips/${selectedTrip.id}`}
              className="text-xs font-medium text-[#007AFF] dark:text-[#0A84FF] hover:underline flex items-center gap-1"
            >
              <ArrowLeft className="w-3 h-3" />
              <span>Back to Trip Workspace</span>
            </Link>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#1D1D1F] dark:text-[#F5F5F7] tracking-tight flex items-center gap-2">
            <Wallet className="w-6 h-6 text-[#007AFF] dark:text-[#0A84FF]" />
            <span>Budget & Financial Health</span>
          </h1>
          <p className="text-xs text-[#6E6E73] dark:text-[#98989D] mt-0.5">
            Financial analytics, expense ledger, and spending forecasts for{' '}
            <strong className="text-[#1D1D1F] dark:text-[#F5F5F7]">{selectedTrip.title}</strong>.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2.5">
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
            className="rounded-lg border border-black/[0.08] dark:border-white/[0.10] bg-black/[0.02] dark:bg-white/[0.04] px-3 py-1.5 text-xs font-semibold text-[#1D1D1F] dark:text-[#F5F5F7] focus:outline-none"
          >
            {allTrips.map((t) => (
              <option key={t.id} value={t.id}>
                {t.title} (Budget: {formatCurrency(t.budget)})
              </option>
            ))}
          </select>

          <Button
            variant="primary"
            size="sm"
            leftIcon={<Plus className="w-3.5 h-3.5" />}
            onClick={() => setShowAddExpenseModal(true)}
            className="bg-[#007AFF] hover:bg-[#0062CC] dark:bg-[#0A84FF] text-white font-medium text-xs shadow-xs"
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
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="bg-white dark:bg-[#1C1C1E] p-4 rounded-xl border border-black/[0.08] dark:border-white/[0.10] shadow-card flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-blue-500/10 text-[#007AFF] dark:text-[#0A84FF]">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-[#8E8E93] dark:text-[#98989D]">
              Avg. Daily Burn Rate
            </span>
            <div className="text-lg font-bold text-[#1D1D1F] dark:text-[#F5F5F7]">
              {formatCurrency(dailyBurnRate)} / day
            </div>
            <p className="text-[11px] text-[#6E6E73] dark:text-[#98989D]">
              Calculated across {totalDays} total expedition days
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-[#1C1C1E] p-4 rounded-xl border border-black/[0.08] dark:border-white/[0.10] shadow-card flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-emerald-500/10 text-[#34C759] dark:text-[#30D158]">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-[#8E8E93] dark:text-[#98989D]">
              Recommended Daily Limit
            </span>
            <div className="text-lg font-bold text-[#34C759] dark:text-[#30D158]">
              {formatCurrency(recommendedDailyAllowance)} / day
            </div>
            <p className="text-[11px] text-[#6E6E73] dark:text-[#98989D]">
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
