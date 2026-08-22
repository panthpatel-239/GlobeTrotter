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
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-3 pt-1">
        <Input
          label="Expense Title *"
          placeholder="e.g. Flight to Tokyo, Sushi Omakase"
          leftIcon={<Receipt className="w-3.5 h-3.5" />}
          error={errors.title?.message}
          {...register('title')}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
          <label className="block text-xs font-semibold text-[#1D1D1F] dark:text-[#F5F5F7] mb-1">
            Notes / Receipt info
          </label>
          <textarea
            rows={2}
            placeholder="e.g. Paid in cash, split with Marcus"
            className="w-full rounded-lg border border-black/[0.08] dark:border-white/[0.10] bg-black/[0.02] dark:bg-white/[0.04] p-2.5 text-xs text-[#1D1D1F] dark:text-[#F5F5F7] placeholder:text-[#8E8E93] focus:outline-none focus:border-[#007AFF]"
            {...register('notes')}
          />
        </div>

        <div className="flex items-center justify-end gap-2 pt-3 border-t border-black/[0.06] dark:border-white/[0.08]">
          <Button type="button" size="sm" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="submit"
            size="sm"
            variant="primary"
            isLoading={isLoading}
            className="bg-[#007AFF] hover:bg-[#0062CC] dark:bg-[#0A84FF] text-white"
          >
            Save Expense
          </Button>
        </div>
      </form>
    </Modal>
  );
};
