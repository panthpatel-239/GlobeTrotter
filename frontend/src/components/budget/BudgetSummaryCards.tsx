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
    <div className="space-y-3 mb-4">
      {/* Over-budget warning alert */}
      {isOverBudget && (
        <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-[#FF3B30] dark:text-[#FF453A] flex items-start gap-2.5 shadow-xs">
          <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <div className="text-xs">
            <h4 className="font-semibold">Budget Exceeded Warning</h4>
            <p className="opacity-90 mt-0.5 leading-relaxed">
              Tracked expenses exceed target budget by{' '}
              <strong>{formatCurrency(Math.abs(remainingBudget))}</strong>. Consider adjusting activities or dining.
            </p>
          </div>
        </div>
      )}

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Total Budget */}
        <div className="bg-white dark:bg-[#1C1C1E] p-4 rounded-xl border border-black/[0.08] dark:border-white/[0.10] shadow-card flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10 text-[#007AFF] dark:text-[#0A84FF] flex-shrink-0">
            <Wallet className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[10px] font-semibold text-[#8E8E93] dark:text-[#98989D] uppercase tracking-wider block">
              Total Budget
            </span>
            <span className="text-lg sm:text-xl font-bold text-[#1D1D1F] dark:text-[#F5F5F7]">
              {formatCurrency(totalBudget)}
            </span>
          </div>
        </div>

        {/* Total Spent */}
        <div className="bg-white dark:bg-[#1C1C1E] p-4 rounded-xl border border-black/[0.08] dark:border-white/[0.10] shadow-card flex items-center gap-3">
          <div
            className={`flex h-10 w-10 items-center justify-center rounded-lg flex-shrink-0 ${
              isOverBudget
                ? 'bg-red-500/10 text-[#FF3B30] dark:text-[#FF453A]'
                : 'bg-black/[0.04] dark:bg-white/[0.06] text-[#1D1D1F] dark:text-[#F5F5F7]'
            }`}
          >
            <TrendingUp className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[10px] font-semibold text-[#8E8E93] dark:text-[#98989D] uppercase tracking-wider block">
              Spent to Date
            </span>
            <div className="flex items-baseline gap-1">
              <span className="text-lg sm:text-xl font-bold text-[#1D1D1F] dark:text-[#F5F5F7]">
                {formatCurrency(totalSpent)}
              </span>
              <span
                className={`text-[11px] font-semibold ${
                  isOverBudget ? 'text-[#FF3B30] dark:text-[#FF453A]' : 'text-[#8E8E93] dark:text-[#98989D]'
                }`}
              >
                ({percentSpent}%)
              </span>
            </div>
          </div>
        </div>

        {/* Remaining Budget */}
        <div className="bg-white dark:bg-[#1C1C1E] p-4 rounded-xl border border-black/[0.08] dark:border-white/[0.10] shadow-card flex items-center gap-3">
          <div
            className={`flex h-10 w-10 items-center justify-center rounded-lg flex-shrink-0 ${
              isOverBudget
                ? 'bg-red-500/10 text-[#FF3B30] dark:text-[#FF453A]'
                : 'bg-emerald-500/10 text-[#34C759] dark:text-[#30D158]'
            }`}
          >
            <PiggyBank className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[10px] font-semibold text-[#8E8E93] dark:text-[#98989D] uppercase tracking-wider block">
              {isOverBudget ? 'Over Budget' : 'Remaining'}
            </span>
            <span
              className={`text-lg sm:text-xl font-bold ${
                isOverBudget ? 'text-[#FF3B30] dark:text-[#FF453A]' : 'text-[#34C759] dark:text-[#30D158]'
              }`}
            >
              {formatCurrency(Math.abs(remainingBudget))}
            </span>
          </div>
        </div>

        {/* Forecast */}
        <div className="bg-white dark:bg-[#1C1C1E] p-4 rounded-xl border border-black/[0.08] dark:border-white/[0.10] shadow-card flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-black/[0.04] dark:bg-white/[0.06] text-[#007AFF] dark:text-[#0A84FF] flex-shrink-0">
            <Calculator className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[10px] font-semibold text-[#8E8E93] dark:text-[#98989D] uppercase tracking-wider block">
              Forecast Total
            </span>
            <span className="text-lg sm:text-xl font-bold text-[#1D1D1F] dark:text-[#F5F5F7]">
              {formatCurrency(calculatedForecast)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
