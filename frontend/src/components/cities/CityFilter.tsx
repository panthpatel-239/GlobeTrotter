import React from 'react';
import { Search, MapPin, Sparkles, DollarSign, Compass, Utensils, Waves, Heart, Trees } from 'lucide-react';

export interface CityFilterProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  costIndex?: string;
  costIndexFilter?: string;
  onCostIndexChange: (cost: string) => void;
  region?: string;
  regionFilter?: string;
  onRegionChange: (region: string) => void;
  tagFilter?: string;
  onTagChange?: (tag: string) => void;
  onTagFilterChange?: (tag: string) => void;
}

const TAG_OPTIONS = [
  { id: 'all', label: 'All Destinations', icon: Compass },
  { id: 'Budget', label: 'Budget Friendly', icon: DollarSign },
  { id: 'Culture', label: 'Culture & Heritage', icon: Sparkles },
  { id: 'Food', label: 'Culinary & Dining', icon: Utensils },
  { id: 'Beach', label: 'Beach & Coastal', icon: Waves },
  { id: 'Adventure', label: 'Adventure & Treks', icon: Compass },
  { id: 'Nature', label: 'Nature & Volcanoes', icon: Trees },
  { id: 'Romantic', label: 'Romantic Escapes', icon: Heart },
];

export const CityFilter: React.FC<CityFilterProps> = ({
  searchQuery,
  onSearchChange,
  costIndex,
  costIndexFilter,
  onCostIndexChange,
  region,
  regionFilter,
  onRegionChange,
  tagFilter = 'all',
  onTagChange,
  onTagFilterChange,
}) => {
  const activeCost = costIndex || costIndexFilter || 'all';
  const activeRegion = region || regionFilter || 'all';
  const handleTag = onTagChange || onTagFilterChange;

  return (
    <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
      {/* Large Search Input */}
      <div className="relative w-full">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
          <Search className="h-4 w-4" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Where do you want to go? (e.g. Tokyo, Paris, Bali, Kyoto...)"
          className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/60 pl-10 pr-4 py-2.5 text-xs sm:text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 transition-all focus:bg-white dark:focus:bg-slate-800 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 shadow-2xs"
        />
      </div>

      {/* Filter Tag Chips */}
      {handleTag && (
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1 border-t border-slate-100 dark:border-slate-800">
          {TAG_OPTIONS.map((tag) => {
            const Icon = tag.icon;
            const isSelected = tagFilter === tag.id;
            return (
              <button
                key={tag.id}
                onClick={() => handleTag(tag.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                  isSelected
                    ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/25'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200/70 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tag.label}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* Secondary Filters: Region & Cost Index */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2.5 border-t border-slate-100 dark:border-slate-800 text-xs">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Region:
          </span>
          {['all', 'Asia', 'Europe', 'Africa'].map((r) => (
            <button
              key={r}
              onClick={() => onRegionChange(r)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                activeRegion === r
                  ? 'bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400 border border-blue-100 dark:border-blue-900/40'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {r === 'all' ? 'All Regions' : r}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Budget Tier:
          </span>
          {[
            { id: 'all', label: 'All' },
            { id: 'budget', label: '$ Budget' },
            { id: 'moderate', label: '$$ Moderate' },
            { id: 'luxury', label: '$$$ Luxury' },
          ].map((tier) => (
            <button
              key={tier.id}
              onClick={() => onCostIndexChange(tier.id)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                activeCost === tier.id
                  ? 'bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400 border border-blue-100 dark:border-blue-900/40'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {tier.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
