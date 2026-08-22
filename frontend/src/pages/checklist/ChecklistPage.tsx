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
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-2.5">
            <CheckSquare className="w-7 h-7 text-blue-600 dark:text-blue-400" />
            <span>Travel & Packing Checklist</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Stay organized with pre-departure passport validations, eSIM data packs, currency exchanges, and packing essentials.
          </p>
        </div>

        <Button
          variant="primary"
          leftIcon={<Plus className="w-4 h-4" />}
          onClick={() => setShowAddModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl px-4 py-2 shadow-2xs"
        >
          Add Checklist Item
        </Button>
      </div>

      {/* Progress Metric Card */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400">
          <span className="font-bold text-slate-900 dark:text-slate-100">
            Checklist Readiness: {completedCount} of {totalCount} Completed
          </span>
          <span className="text-blue-600 dark:text-blue-400 font-bold">{progressPercent}% Ready</span>
        </div>
        <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
          <div
            className="bg-emerald-500 h-2 rounded-full transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Filter Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`px-3.5 py-1.5 rounded-xl font-semibold transition-all cursor-pointer whitespace-nowrap ${
            selectedCategory === 'all'
              ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/25'
              : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800'
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
              className={`px-3.5 py-1.5 rounded-xl font-semibold transition-all cursor-pointer whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/25'
                  : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800'
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
        <div className="space-y-2.5">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              onClick={() => handleToggle(item.id)}
              className={`p-4 rounded-xl border transition-all flex items-center justify-between gap-3.5 cursor-pointer select-none shadow-2xs ${
                item.isCompleted
                  ? 'bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/40 text-slate-400 dark:text-slate-500'
                  : 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-900 dark:text-slate-100'
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
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 fill-emerald-50 dark:fill-emerald-950" />
                  ) : (
                    <Circle className="w-5 h-5 text-slate-300 dark:text-slate-600 hover:text-blue-600 dark:hover:text-blue-400" />
                  )}
                </button>
                <div className="truncate">
                  <span
                    className={`text-xs sm:text-sm font-semibold truncate block ${
                      item.isCompleted ? 'line-through text-slate-400 dark:text-slate-500' : 'text-slate-900 dark:text-slate-100'
                    }`}
                  >
                    {item.title}
                  </span>
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">
                    {item.category} {item.dueDate && `• Target Date: ${item.dueDate}`}
                  </span>
                </div>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteItem(item.id);
                }}
                className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-lg transition-colors cursor-pointer"
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
            <label className="block text-xs font-semibold text-slate-900 dark:text-slate-100 mb-1.5">Task Title</label>
            <input
              type="text"
              required
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="e.g. Order Japan Rail Pass voucher, Pack GaN charger"
              className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/60 px-3.5 py-2 text-xs text-slate-900 dark:text-slate-100 focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-semibold text-slate-900 dark:text-slate-100 mb-1.5">Category</label>
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value as ChecklistItem['category'])}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-500"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-900 dark:text-slate-100 mb-1.5">Target Date</label>
              <input
                type="date"
                value={newDueDate}
                onChange={(e) => setNewDueDate(e.target.value)}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-100 dark:border-slate-800">
            <Button variant="outline" type="button" onClick={() => setShowAddModal(false)} className="rounded-xl">
              Cancel
            </Button>
            <Button
              variant="primary"
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl"
            >
              Add Item
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
