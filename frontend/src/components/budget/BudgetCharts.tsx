import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts';
import { Expense } from '../../types';
import { EXPENSE_CATEGORIES } from '../../constants';
import { formatCurrency } from '../../utils/formatters';

export interface BudgetChartsProps {
  expenses: Expense[];
  activityCostsTotal?: number;
}

export const BudgetCharts: React.FC<BudgetChartsProps> = ({ expenses, activityCostsTotal = 0 }) => {
  // Aggregate expenses by category
  const categoryTotals: Record<string, number> = {
    transport: 0,
    accommodation: 0,
    activities: activityCostsTotal,
    food: 0,
    shopping: 0,
    other: 0,
  };

  expenses.forEach((e) => {
    const cat = e.category || 'other';
    categoryTotals[cat] = (categoryTotals[cat] || 0) + Number(e.amount || 0);
  });

  const appleCategoryColors: Record<string, string> = {
    transport: '#007AFF',
    accommodation: '#5856D6',
    activities: '#FF9F0A',
    food: '#FF3B30',
    shopping: '#AF52DE',
    other: '#8E8E93',
  };

  const chartData = EXPENSE_CATEGORIES.map((cat) => ({
    name: cat.label,
    key: cat.id,
    value: categoryTotals[cat.id] || 0,
    color: appleCategoryColors[cat.id] || cat.color,
  })).filter((item) => item.value > 0);

  const hasData = chartData.length > 0;

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <div className="bg-[#1C1C1E] text-white p-2.5 rounded-xl shadow-xl border border-white/10 text-xs">
          <p className="font-semibold">{data.name}</p>
          <p className="text-[#0A84FF] font-bold mt-0.5">{formatCurrency(data.value)}</p>
        </div>
      );
    }
    return null;
  };

  if (!hasData) {
    return (
      <div className="bg-white dark:bg-[#1C1C1E] p-8 rounded-2xl border border-black/[0.08] dark:border-white/[0.10] shadow-card text-center mb-4">
        <p className="text-xs text-[#6E6E73] dark:text-[#98989D] font-medium">
          No expenses recorded yet. Log your expenses below to see interactive breakdown charts.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
      {/* Category Pie Chart */}
      <div className="bg-white dark:bg-[#1C1C1E] p-5 rounded-2xl border border-black/[0.08] dark:border-white/[0.10] shadow-card flex flex-col justify-between">
        <div className="mb-3">
          <h3 className="text-sm font-bold text-[#1D1D1F] dark:text-[#F5F5F7]">Spending Breakdown</h3>
          <p className="text-xs text-[#6E6E73] dark:text-[#98989D]">Expenses distributed across travel categories</p>
        </div>

        <div className="h-60 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={85}
                paddingAngle={3}
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 pt-3 border-t border-black/[0.06] dark:border-white/[0.08]">
          {chartData.map((item) => (
            <div key={item.name} className="flex items-center gap-1.5 text-xs text-[#6E6E73] dark:text-[#98989D]">
              <span className="h-2 w-2 rounded-full" style={{ backgroundColor: item.color }} />
              <span className="font-medium">{item.name}:</span>
              <span className="font-bold text-[#1D1D1F] dark:text-[#F5F5F7]">{formatCurrency(item.value)}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Category Bar Comparison */}
      <div className="bg-white dark:bg-[#1C1C1E] p-5 rounded-2xl border border-black/[0.08] dark:border-white/[0.10] shadow-card flex flex-col justify-between">
        <div className="mb-3">
          <h3 className="text-sm font-bold text-[#1D1D1F] dark:text-[#F5F5F7]">Cost Comparison</h3>
          <p className="text-xs text-[#6E6E73] dark:text-[#98989D]">Comparative breakdown per category</p>
        </div>

        <div className="h-60 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(128,128,128,0.1)" />
              <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#8E8E93' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: '#8E8E93' }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v}`} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell key={`bar-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="pt-3 border-t border-black/[0.06] dark:border-white/[0.08] text-center text-[11px] text-[#8E8E93]">
          Dynamic calculation based on logged trip expenses
        </div>
      </div>
    </div>
  );
};
