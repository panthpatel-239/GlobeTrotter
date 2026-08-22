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
    <div className="bg-white dark:bg-[#1C1C1E] p-4 sm:p-5 rounded-2xl border border-black/[0.08] dark:border-white/[0.10] shadow-card space-y-3.5">
      {/* Large Search Input */}
      <div className="relative w-full">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-[#8E8E93] dark:text-[#98989D]">
          <Search className="h-4 w-4" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Where do you want to go? (e.g. Tokyo, Paris, Bali, Kyoto...)"
          className="w-full rounded-xl border border-black/[0.08] dark:border-white/[0.10] bg-black/[0.02] dark:bg-white/[0.04] pl-10 pr-4 py-2.5 text-xs sm:text-sm text-[#1D1D1F] dark:text-[#F5F5F7] placeholder:text-[#8E8E93] transition-all focus:border-[#007AFF] focus:outline-none focus:ring-1 focus:ring-[#007AFF]"
        />
      </div>

      {/* Filter Tag Chips */}
      {handleTag && (
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1 border-t border-black/[0.06] dark:border-white/[0.08]">
          {TAG_OPTIONS.map((tag) => {
            const Icon = tag.icon;
            const isSelected = tagFilter === tag.id;
            return (
              <button
                key={tag.id}
                onClick={() => handleTag(tag.id)}
                className={`flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                  isSelected
                    ? 'bg-[#007AFF] dark:bg-[#0A84FF] text-white shadow-xs'
                    : 'bg-black/[0.03] dark:bg-white/[0.04] text-[#6E6E73] dark:text-[#98989D] hover:bg-black/[0.06] dark:hover:bg-white/[0.08] hover:text-[#1D1D1F] dark:hover:text-[#F5F5F7]'
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
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-black/[0.06] dark:border-white/[0.08] text-xs">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#8E8E93] dark:text-[#98989D]">
            Region:
          </span>
          {['all', 'Asia', 'Europe', 'Africa'].map((r) => (
            <button
              key={r}
              onClick={() => onRegionChange(r)}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                activeRegion === r
                  ? 'bg-blue-500/10 text-[#007AFF] dark:text-[#0A84FF] font-semibold'
                  : 'text-[#6E6E73] dark:text-[#98989D] hover:text-[#1D1D1F] dark:hover:text-[#F5F5F7]'
              }`}
            >
              {r === 'all' ? 'All Regions' : r}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#8E8E93] dark:text-[#98989D]">
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
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                activeCost === tier.id
                  ? 'bg-blue-500/10 text-[#007AFF] dark:text-[#0A84FF] font-semibold'
                  : 'text-[#6E6E73] dark:text-[#98989D] hover:text-[#1D1D1F] dark:hover:text-[#F5F5F7]'
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
