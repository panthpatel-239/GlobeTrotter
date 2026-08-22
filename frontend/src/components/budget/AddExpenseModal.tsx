import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Receipt, DollarSign, Calendar, Tag } from 'lucide-react';
import { expenseSchema, ExpenseFormData } from '../../utils/validators';
import { Modal } from '../common/Modal';
import { Input } from '../common/Input';
import { Select } from '../common/Select';
import { Button } from '../common/Button';
import { EXPENSE_CATEGORIES } from '../../constants';

export interface AddExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddExpense: (data: ExpenseFormData) => Promise<void>;
  isLoading?: boolean;
}

export const AddExpenseModal: React.FC<AddExpenseModalProps> = ({
  isOpen,
  onClose,
  onAddExpense,
  isLoading = false,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ExpenseFormData>({
    resolver: zodResolver(expenseSchema),
    defaultValues: {
      title: '',
      category: 'food',
      amount: 50,
      currency: 'USD',
      date: new Date().toISOString().split('T')[0],
      notes: '',
    },
  });

  const categoryOptions = EXPENSE_CATEGORIES.map((c) => ({
    value: c.id,
    label: c.label,
  }));

  const currencyOptions = [
    { value: 'USD', label: 'USD ($)' },
    { value: 'EUR', label: 'EUR (€)' },
    { value: 'GBP', label: 'GBP (£)' },
    { value: 'INR', label: 'INR (₹)' },
    { value: 'JPY', label: 'JPY (¥)' },
  ];

  const handleFormSubmit = async (data: ExpenseFormData) => {
    await onAddExpense(data);
    reset();
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Log Travel Expense"
      description="Record a flight, hotel, meal, tour, or other cost."
      maxWidth="md"
    >
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-3.5 pt-1">
        <Input
          label="Expense Title *"
          placeholder="e.g. Flight to Tokyo, Sushi Omakase"
          leftIcon={<Receipt className="w-3.5 h-3.5" />}
          error={errors.title?.message}
          {...register('title')}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <Select
            label="Category *"
            options={categoryOptions}
            error={errors.category?.message}
            {...register('category')}
          />

          <Select
            label="Currency"
            options={currencyOptions}
            error={errors.currency?.message}
            {...register('currency')}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <Input
            label="Amount *"
            type="number"
            step="0.01"
            placeholder="0.00"
            leftIcon={<DollarSign className="w-3.5 h-3.5" />}
            error={errors.amount?.message}
            {...register('amount', { valueAsNumber: true })}
          />

          <Input
            label="Date of Payment *"
            type="date"
            leftIcon={<Calendar className="w-3.5 h-3.5" />}
            error={errors.date?.message}
            {...register('date')}
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-900 dark:text-slate-100 mb-1.5">
            Notes / Receipt info
          </label>
          <textarea
            rows={2}
            placeholder="e.g. Paid in cash, split with Marcus"
            className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/60 p-3 text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            {...register('notes')}
          />
        </div>

        <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100 dark:border-slate-800">
          <Button type="button" size="sm" variant="outline" onClick={onClose} className="rounded-xl">
            Cancel
          </Button>
          <Button
            type="submit"
            size="sm"
            variant="primary"
            isLoading={isLoading}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl px-4 py-2"
          >
            Save Expense
          </Button>
        </div>
      </form>
    </Modal>
  );
};
