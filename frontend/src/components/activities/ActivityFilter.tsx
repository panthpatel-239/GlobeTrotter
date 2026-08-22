import React from 'react';
import { Search, Sparkles, Utensils, Compass, Landmark, Trees, PartyPopper, ShoppingBag, Waves } from 'lucide-react';
import { ACTIVITY_CATEGORIES } from '../../constants';

export interface ActivityFilterProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  maxCost: number;
  onMaxCostChange: (cost: number) => void;
}

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  'Sightseeing': <Landmark className="w-3.5 h-3.5" />,
  'Food & Dining': <Utensils className="w-3.5 h-3.5" />,
  'Adventure': <Compass className="w-3.5 h-3.5" />,
  'Culture & History': <Sparkles className="w-3.5 h-3.5" />,
  'Nature': <Trees className="w-3.5 h-3.5" />,
  'Nightlife': <PartyPopper className="w-3.5 h-3.5" />,
  'Shopping': <ShoppingBag className="w-3.5 h-3.5" />,
  'Relaxation': <Waves className="w-3.5 h-3.5" />,
};

export const ActivityFilter: React.FC<ActivityFilterProps> = ({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  maxCost,
  onMaxCostChange,
}) => {
  return (
    <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm space-y-4 mb-6">
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        {/* Search input */}
        <div className="relative w-full md:w-96">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
            <Search className="h-4 w-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search tours, museums, dining, hikes..."
            className="w-full rounded-xl border border-slate-200 bg-slate-50/60 pl-9 pr-4 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:border-brand-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20"
          />
        </div>

        {/* Max Cost filter */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <span className="text-xs font-medium text-slate-500 whitespace-nowrap">
            Max Cost: <strong className="text-slate-900 font-bold">${maxCost || 'Any'}</strong>
          </span>
          <input
            type="range"
            min="0"
            max="150"
            step="10"
            value={maxCost}
            onChange={(e) => onMaxCostChange(Number(e.target.value))}
            className="accent-brand-600 cursor-pointer w-32"
          />
        </div>
      </div>

      {/* Category Pills with Icons */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1 border-t border-slate-100">
        <button
          onClick={() => onCategoryChange('all')}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
            selectedCategory === 'all'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          All Categories
        </button>
        {ACTIVITY_CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => onCategoryChange(cat)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              selectedCategory === cat
                ? 'bg-brand-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 bg-slate-50'
            }`}
          >
            {CATEGORY_ICONS[cat] || <Sparkles className="w-3.5 h-3.5" />}
            <span>{cat}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
