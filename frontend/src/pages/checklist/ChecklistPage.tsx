import React, { useState, useEffect } from 'react';
import {
  CheckSquare,
  Plus,
  CheckCircle2,
  Circle,
  Trash2,
  Layers,
  Sparkles,
  Calendar,
  Filter,
} from 'lucide-react';
import { checklistService } from '../../services/checklistService';
import { ChecklistItem } from '../../types';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { Skeleton } from '../../components/common/Skeleton';
import { EmptyState } from '../../components/common/EmptyState';
import { useToast } from '../../context/ToastContext';

export const ChecklistPage: React.FC = () => {
  const { success, error: toastError, info } = useToast();
  const [items, setItems] = useState<ChecklistItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<ChecklistItem['category']>('Documents');
  const [newDueDate, setNewDueDate] = useState('');

  const fetchChecklist = async () => {
    setIsLoading(true);
    try {
      const data = await checklistService.getChecklist();
      setItems(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchChecklist();
  }, []);

  const handleToggle = async (id: string) => {
    try {
      const updated = await checklistService.toggleChecklistItem(id);
      setItems((prev) => prev.map((item) => (item.id === id ? updated : item)));
      if (updated.isCompleted) {
        info(`Checked: "${updated.title}"`);
      }
    } catch (err: any) {
      toastError('Error', err.message);
    }
  };

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    try {
      const created = await checklistService.addChecklistItem({
        title: newTitle.trim(),
        category: newCategory,
        dueDate: newDueDate || undefined,
      });
      setItems((prev) => [...prev, created]);
      success('Task Added', `"${created.title}" added to checklist.`);
      setShowAddModal(false);
      setNewTitle('');
      setNewDueDate('');
    } catch (err: any) {
      toastError('Error', err.message);
    }
  };

  const handleDeleteItem = async (id: string) => {
    try {
      await checklistService.deleteChecklistItem(id);
      setItems((prev) => prev.filter((i) => i.id !== id));
      success('Removed', 'Checklist task removed.');
    } catch (err: any) {
      toastError('Error', err.message);
    }
  };

  const completedCount = items.filter((i) => i.isCompleted).length;
  const totalCount = items.length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const categories: ChecklistItem['category'][] = [
    'Documents',
    'Clothing & Gear',
    'Health & Tech',
    'Bookings',
    'Financial',
    'Custom',
  ];

  const filteredItems =
    selectedCategory === 'all'
      ? items
      : items.filter((i) => i.category === selectedCategory);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 dark:bg-brand-950 text-brand-700 dark:text-brand-300 text-xs font-bold uppercase tracking-wider mb-2">
            <CheckSquare className="w-3.5 h-3.5" />
            <span>Trip Preparation</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-sand-900 dark:text-[#F4F7F5] tracking-tight">
            Travel & Packing Checklist
          </h1>
          <p className="text-sm text-sand-600 dark:text-[#A7B3AD] mt-0.5">
            Stay organized with pre-departure passport validations, eSIM data packs, currency exchanges, and packing essentials.
          </p>
        </div>

        <Button
          variant="primary"
          leftIcon={<Plus className="w-4 h-4" />}
          onClick={() => setShowAddModal(true)}
          className="bg-brand-600 hover:bg-brand-700 dark:bg-brand-500 dark:text-sand-950 font-bold"
        >
          Add Checklist Item
        </Button>
      </div>

      {/* Progress Metric Card */}
      <div className="bg-white dark:bg-[#121A18] p-5 rounded-3xl border border-sand-300 dark:border-[#28342F] shadow-card space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-sand-900 dark:text-[#F4F7F5]">
            Checklist Readiness: {completedCount} of {totalCount} Completed
          </span>
          <span className="text-xs font-black text-brand-600 dark:text-brand-400">{progressPercent}%</span>
        </div>
        <div className="w-full bg-sand-200 dark:bg-[#18221F] rounded-full h-2 overflow-hidden">
          <div
            className="bg-brand-600 dark:bg-brand-500 h-2 rounded-full transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Filter Category Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`px-3.5 py-1.5 rounded-xl font-bold transition-all cursor-pointer whitespace-nowrap ${
            selectedCategory === 'all'
              ? 'bg-sand-900 dark:bg-brand-500 text-white dark:text-sand-950 shadow-2xs'
              : 'bg-white dark:bg-[#121A18] border border-sand-300 dark:border-[#28342F] text-sand-600 dark:text-[#A7B3AD] hover:text-sand-900 dark:hover:text-white'
          }`}
        >
          All Items ({items.length})
        </button>
        {categories.map((cat) => {
          const catCount = items.filter((i) => i.category === cat).length;
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl font-bold transition-all cursor-pointer whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-sand-900 dark:bg-brand-500 text-white dark:text-sand-950 shadow-2xs'
                  : 'bg-white dark:bg-[#121A18] border border-sand-300 dark:border-[#28342F] text-sand-600 dark:text-[#A7B3AD] hover:text-sand-900 dark:hover:text-white'
              }`}
            >
              {cat} ({catCount})
            </button>
          );
        })}
      </div>

      {/* Checklist List */}
      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} height={60} className="rounded-2xl" />
          ))}
        </div>
      ) : filteredItems.length > 0 ? (
        <div className="space-y-2">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              onClick={() => handleToggle(item.id)}
              className={`p-4 rounded-2xl border transition-all flex items-center justify-between gap-3 cursor-pointer select-none ${
                item.isCompleted
                  ? 'bg-emerald-50/50 dark:bg-[#14231B] border-emerald-200 dark:border-emerald-900/60 text-sand-400 dark:text-[#A7B3AD]'
                  : 'bg-white dark:bg-[#121A18] border-sand-300 dark:border-[#28342F] shadow-card hover:bg-sand-50 dark:hover:bg-[#18221F] text-sand-900 dark:text-[#F4F7F5]'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <button
                  type="button"
                  className="flex-shrink-0 text-emerald-600 dark:text-emerald-400"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleToggle(item.id);
                  }}
                >
                  {item.isCompleted ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 fill-emerald-100 dark:fill-emerald-950" />
                  ) : (
                    <Circle className="w-5 h-5 text-sand-400 hover:text-brand-600 dark:hover:text-brand-400" />
                  )}
                </button>
                <div className="truncate">
                  <span
                    className={`text-xs sm:text-sm font-semibold truncate block ${
                      item.isCompleted ? 'line-through text-sand-400 dark:text-[#66736B]' : 'text-sand-900 dark:text-[#F4F7F5]'
                    }`}
                  >
                    {item.title}
                  </span>
                  <span className="text-[10px] text-sand-500 dark:text-[#A7B3AD] font-medium">
                    {item.category} {item.dueDate && `• Target Date: ${item.dueDate}`}
                  </span>
                </div>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteItem(item.id);
                }}
                className="p-1.5 text-sand-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-lg transition-colors cursor-pointer"
                title="Delete task"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          title="No Checklist Items"
          description="Add pre-travel packing items or tasks to ensure smooth departure."
          actionText="Add First Task"
          onAction={() => setShowAddModal(true)}
          actionIcon={<Plus className="w-4 h-4" />}
        />
      )}

      {/* Add Task Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add Checklist Item"
        description="Add a pre-travel preparation or packing task."
        maxWidth="md"
      >
        <form onSubmit={handleAddItem} className="space-y-4 pt-2">
          <div>
            <label className="block text-xs font-bold text-sand-700 dark:text-[#A7B3AD] mb-1">Task Title</label>
            <input
              type="text"
              required
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="e.g. Order Japan Rail Pass voucher, Pack GaN charger"
              className="w-full rounded-xl border border-sand-300 dark:border-[#28342F] bg-sand-100 dark:bg-[#18221F] px-3 py-2 text-xs text-sand-900 dark:text-[#F4F7F5] focus:outline-none focus:border-brand-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-sand-700 dark:text-[#A7B3AD] mb-1">Category</label>
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value as ChecklistItem['category'])}
                className="w-full rounded-xl border border-sand-300 dark:border-[#28342F] bg-sand-100 dark:bg-[#18221F] px-3 py-2 text-xs text-sand-900 dark:text-[#F4F7F5] focus:outline-none focus:border-brand-500"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-sand-700 dark:text-[#A7B3AD] mb-1">Target Date</label>
              <input
                type="date"
                value={newDueDate}
                onChange={(e) => setNewDueDate(e.target.value)}
                className="w-full rounded-xl border border-sand-300 dark:border-[#28342F] bg-sand-100 dark:bg-[#18221F] px-3 py-2 text-xs text-sand-900 dark:text-[#F4F7F5] focus:outline-none focus:border-brand-500"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-sand-200 dark:border-[#28342F]">
            <Button variant="outline" type="button" onClick={() => setShowAddModal(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              type="submit"
              className="bg-brand-600 hover:bg-brand-700 dark:bg-brand-500 dark:text-sand-950 font-bold"
            >
              Add Item
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
