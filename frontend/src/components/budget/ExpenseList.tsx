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
      color: '#64748B',
    };
  };

  const filteredExpenses = expenses.filter((e) => {
    if (selectedCategory === 'all') return true;
    return e.category === selectedCategory;
  });

  return (
    <>
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden">
        {/* Header with Title, Category Filter & Add CTA */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">Expenses Ledger</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Track and manage individual travel payments</p>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/60 px-3 py-1.5 font-semibold text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-500 cursor-pointer shadow-2xs"
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
                className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-2xs"
              >
                Log Expense
              </Button>
            )}
          </div>
        </div>

        {/* Expense List Table/Rows */}
        {filteredExpenses.length > 0 ? (
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {filteredExpenses.map((expense) => {
              const catDetails = getCategoryDetails(expense.category);

              return (
                <div
                  key={expense.id}
                  className="p-4 sm:px-6 flex items-center justify-between hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors group"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div
                      className="h-9 w-9 rounded-xl flex items-center justify-center text-white flex-shrink-0 shadow-2xs"
                      style={{ backgroundColor: catDetails.color }}
                    >
                      <Receipt className="h-4 w-4" />
                    </div>

                    <div className="min-w-0 space-y-0.5">
                      <div className="flex items-center gap-2">
                        <p className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">{expense.title}</p>
                        <span
                          className="text-[10px] font-bold px-2 py-0.5 rounded-md text-white shadow-2xs"
                          style={{ backgroundColor: catDetails.color }}
                        >
                          {catDetails.label}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-[11px] text-slate-400 dark:text-slate-500 font-medium">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {formatDate(expense.date)}
                        </span>
                        {expense.notes && (
                          <span className="truncate max-w-[200px] text-slate-500 dark:text-slate-400 italic">
                            • {expense.notes}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 flex-shrink-0 ml-3">
                    <span className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-slate-100">
                      {formatCurrency(expense.amount, expense.currency)}
                    </span>

                    {!readOnly && (
                      <button
                        onClick={() => setExpenseToDelete(expense.id)}
                        className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-all cursor-pointer"
                        title="Delete expense"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-8 text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400">No expenses found for the selected category.</p>
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
