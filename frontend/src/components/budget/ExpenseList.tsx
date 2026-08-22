import React, { useState } from 'react';
import { Trash2, Plus, Receipt, Calendar, Tag } from 'lucide-react';
import { Expense, ExpenseCategory } from '../../types';
import { EXPENSE_CATEGORIES } from '../../constants';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { Button } from '../common/Button';
import { ConfirmDialog } from '../common/ConfirmDialog';

export interface ExpenseListProps {
  expenses: Expense[];
  onAddExpense: () => void;
  onDeleteExpense: (expenseId: string) => void;
  readOnly?: boolean;
}

export const ExpenseList: React.FC<ExpenseListProps> = ({
  expenses,
  onAddExpense,
  onDeleteExpense,
  readOnly = false,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [expenseToDelete, setExpenseToDelete] = useState<string | null>(null);

  const getCategoryDetails = (category: ExpenseCategory) => {
    return EXPENSE_CATEGORIES.find((c) => c.id === category) || {
      id: category,
      label: category,
      color: '#8E8E93',
    };
  };

  const filteredExpenses = expenses.filter((e) => {
    if (selectedCategory === 'all') return true;
    return e.category === selectedCategory;
  });

  return (
    <>
      <div className="bg-white dark:bg-[#1C1C1E] rounded-2xl border border-black/[0.08] dark:border-white/[0.10] shadow-card overflow-hidden">
        {/* Header with Title, Category Filter & Add CTA */}
        <div className="p-4 sm:p-5 border-b border-black/[0.06] dark:border-white/[0.08] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-[#1D1D1F] dark:text-[#F5F5F7]">Expenses Ledger</h3>
            <p className="text-xs text-[#6E6E73] dark:text-[#98989D]">Track and manage individual travel payments</p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="text-xs rounded-lg border border-black/[0.08] dark:border-white/[0.10] bg-black/[0.02] dark:bg-white/[0.04] px-2.5 py-1.5 font-medium text-[#1D1D1F] dark:text-[#F5F5F7] focus:outline-none"
            >
              <option value="all">All Categories</option>
              {EXPENSE_CATEGORIES.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.label}
                </option>
              ))}
            </select>

            {!readOnly && (
              <Button
                size="sm"
                variant="primary"
                leftIcon={<Plus className="w-3.5 h-3.5" />}
                onClick={onAddExpense}
                className="bg-[#007AFF] hover:bg-[#0062CC] dark:bg-[#0A84FF] text-white text-xs font-medium"
              >
                Log Expense
              </Button>
            )}
          </div>
        </div>

        {/* Expense List Table/Rows */}
        {filteredExpenses.length > 0 ? (
          <div className="divide-y divide-black/[0.04] dark:divide-white/[0.06]">
            {filteredExpenses.map((expense) => {
              const catDetails = getCategoryDetails(expense.category);

              return (
                <div
                  key={expense.id}
                  className="p-3.5 sm:px-5 flex items-center justify-between hover:bg-black/[0.02] dark:hover:bg-white/[0.03] transition-colors group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className="h-8 w-8 rounded-lg flex items-center justify-center text-white flex-shrink-0"
                      style={{ backgroundColor: catDetails.color }}
                    >
                      <Receipt className="h-4 w-4" />
                    </div>

                    <div className="min-w-0 space-y-0.5">
                      <div className="flex items-center gap-2">
                        <p className="text-xs font-bold text-[#1D1D1F] dark:text-[#F5F5F7] truncate">{expense.title}</p>
                        <span
                          className="text-[10px] font-semibold px-2 py-0.5 rounded-md text-white"
                          style={{ backgroundColor: catDetails.color }}
                        >
                          {catDetails.label}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-[11px] text-[#8E8E93] dark:text-[#98989D]">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {formatDate(expense.date)}
                        </span>
                        {expense.notes && (
                          <span className="truncate max-w-[200px] text-[#6E6E73] dark:text-[#98989D] italic">
                            • {expense.notes}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 flex-shrink-0 ml-3">
                    <span className="text-xs sm:text-sm font-bold text-[#1D1D1F] dark:text-[#F5F5F7]">
                      {formatCurrency(expense.amount, expense.currency)}
                    </span>

                    {!readOnly && (
                      <button
                        onClick={() => setExpenseToDelete(expense.id)}
                        className="opacity-0 group-hover:opacity-100 p-1.5 rounded-md text-[#8E8E93] hover:text-[#FF3B30] hover:bg-red-500/10 transition-all cursor-pointer"
                        title="Delete expense"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-8 text-center">
            <p className="text-xs text-[#6E6E73] dark:text-[#98989D]">No expenses found for the selected category.</p>
          </div>
        )}
      </div>

      {/* Delete Expense Modal */}
      <ConfirmDialog
        isOpen={!!expenseToDelete}
        onClose={() => setExpenseToDelete(null)}
        onConfirm={() => {
          if (expenseToDelete) {
            onDeleteExpense(expenseToDelete);
            setExpenseToDelete(null);
          }
        }}
        title="Delete Expense?"
        message="Are you sure you want to remove this expense entry from your budget records?"
        confirmText="Delete"
      />
    </>
  );
};
