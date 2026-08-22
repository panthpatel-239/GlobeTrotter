import React from 'react';
import { DollarSign, TrendingUp, AlertTriangle, Wallet, PiggyBank, Calculator } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

export interface BudgetSummaryCardsProps {
  totalBudget: number;
  totalSpent: number;
  remainingBudget: number;
  forecast?: number;
  isOverBudget: boolean;
}

export const BudgetSummaryCards: React.FC<BudgetSummaryCardsProps> = ({
  totalBudget,
  totalSpent,
  remainingBudget,
  forecast,
  isOverBudget,
}) => {
  const percentSpent = totalBudget > 0 ? Math.min(Math.round((totalSpent / totalBudget) * 100), 999) : 0;
  const calculatedForecast = forecast || totalSpent + (remainingBudget > 0 ? remainingBudget * 0.8 : 0);

  return (
    <div className="space-y-4 mb-4">
      {/* Over-budget warning alert */}
      {isOverBudget && (
        <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/60 text-rose-800 dark:text-rose-200 flex items-start gap-3 shadow-2xs">
          <AlertTriangle className="w-5 h-5 text-rose-600 dark:text-rose-400 flex-shrink-0 mt-0.5" />
          <div className="text-xs">
            <h4 className="font-bold">Budget Exceeded Warning</h4>
            <p className="opacity-90 mt-0.5 leading-relaxed">
              Tracked expenses exceed target budget by{' '}
              <strong>{formatCurrency(Math.abs(remainingBudget))}</strong>. Consider adjusting activities or dining.
            </p>
          </div>
        </div>
      )}

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Budget */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center gap-4 hover:shadow-md transition-all">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400 flex-shrink-0 border border-blue-100 dark:border-blue-900/40">
            <Wallet className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">
              Total Budget
            </span>
            <span className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
              {formatCurrency(totalBudget)}
            </span>
          </div>
        </div>

        {/* Total Spent */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center gap-4 hover:shadow-md transition-all">
          <div
            className={`flex h-11 w-11 items-center justify-center rounded-xl flex-shrink-0 border ${
              isOverBudget
                ? 'bg-rose-50 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400 border-rose-100 dark:border-rose-900/40'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
            }`}
          >
            <TrendingUp className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">
              Spent to Date
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
                {formatCurrency(totalSpent)}
              </span>
              <span
                className={`text-[11px] font-bold ${
                  isOverBudget ? 'text-rose-600 dark:text-rose-400' : 'text-slate-400 dark:text-slate-500'
                }`}
              >
                ({percentSpent}%)
              </span>
            </div>
          </div>
        </div>

        {/* Remaining Budget */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center gap-4 hover:shadow-md transition-all">
          <div
            className={`flex h-11 w-11 items-center justify-center rounded-xl flex-shrink-0 border ${
              isOverBudget
                ? 'bg-rose-50 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400 border-rose-100 dark:border-rose-900/40'
                : 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400 border-emerald-100 dark:border-emerald-900/40'
            }`}
          >
            <PiggyBank className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">
              {isOverBudget ? 'Over Budget' : 'Remaining'}
            </span>
            <span
              className={`text-lg sm:text-xl font-extrabold tracking-tight ${
                isOverBudget ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'
              }`}
            >
              {formatCurrency(Math.abs(remainingBudget))}
            </span>
          </div>
        </div>

        {/* Forecast */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center gap-4 hover:shadow-md transition-all">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400 flex-shrink-0 border border-indigo-100 dark:border-indigo-900/40">
            <Calculator className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">
              Forecast Total
            </span>
            <span className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
              {formatCurrency(calculatedForecast)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
