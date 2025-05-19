'use client';

import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ChevronDown, ChevronUp, RotateCcw } from 'lucide-react';
import { handleResetFilters } from '@/app/utils/resetFilters'; 

interface SidebarFilterProps {
  selectedCategories: string[];
  setSelectedCategories: React.Dispatch<React.SetStateAction<string[]>>;
  selectedStatuses: string[];
  setSelectedStatuses: React.Dispatch<React.SetStateAction<string[]>>;
  priceRange: { min: string; max: string };
  setPriceRange: React.Dispatch<React.SetStateAction<{ min: string; max: string }>>;
  selectedPriorities: string[];
  setSelectedPriorities: React.Dispatch<React.SetStateAction<string[]>>;
  customCategories: string[];
}

const SidebarFilter: React.FC<SidebarFilterProps> = ({
  selectedCategories,
  setSelectedCategories,
  selectedStatuses,
  setSelectedStatuses,
  priceRange,
  setPriceRange,
  selectedPriorities,
  setSelectedPriorities,
  customCategories,
}) => {
  const statuses = [
    { id: 'purchased', name: 'Purchased' },
    { id: 'not-purchased', name: 'Not Purchased' },
  ];
  const priorities = ['High', 'Medium', 'Low'];

  // Normalize and deduplicate categories
  const normalizeCategory = (category: string): string => {
    return category.trim().toLowerCase();
  };
  const denormalizeCategory = (category: string): string => {
    return category.charAt(0).toUpperCase() + category.slice(1);
  };
  const categories = Array.from(
    new Set(customCategories.map(normalizeCategory))
  ).map(denormalizeCategory);

  const handleCategoryChange = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]
    );
  };

  const handleStatusChange = (status: string) => {
    setSelectedStatuses((prev) =>
      prev.includes(status) ? prev.filter((s) => s !== status) : [...prev, status]
    );
  };

  const handlePriorityChange = (priority: string) => {
    setSelectedPriorities((prev) =>
      prev.includes(priority) ? prev.filter((p) => p !== priority) : [...prev, priority]
    );
  };

  const handlePriceChange = (type: 'min' | 'max', value: string) => {
    setPriceRange((prev) => ({ ...prev, [type]: value }));
  };

  const [isMobileOpen, setIsMobileOpen] = React.useState(false);
  const [isCategoriesOpen, setIsCategoriesOpen] = React.useState(true);
  const [isPriceRangeOpen, setIsPriceRangeOpen] = React.useState(true);
  const [isStatusOpen, setIsStatusOpen] = React.useState(true);
  const [isPriorityOpen, setIsPriorityOpen] = React.useState(true);

  return (
    <>
      {/* Toggle Button for Mobile */}
      <div className="md:hidden fixed top-20 left-4 z-20">
        <button
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="bg-blue-600 text-white px-3 py-1 rounded shadow-md hover:bg-blue-700 transition"
        >
          {isMobileOpen ? 'Close Filters' : 'Open Filters'}
        </button>
      </div>

      <aside className="w-64 bg-white shadow-md rounded-md fixed top-20 p-4 left-0 h-[90vh] z-10 overflow-auto no-scrollbar border-r border-gray-200 hidden md:block">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold text-lg text-gray-800 uppercase">Filters</h2>
          <button
            onClick={() =>
              handleResetFilters(setSelectedCategories, setSelectedStatuses, setPriceRange, setSelectedPriorities)
            }
            className="p-2 rounded-full text-gray-600 hover:bg-gray-600 hover:text-white transition duration-300"
            title="Reset Filters"
          >
            <RotateCcw size={18} />
          </button>
        </div>

        {/* Categories */}
        <div className="mb-6">
          <div
            className="flex justify-between items-center cursor-pointer mb-2 hover:bg-gray-100 px-1 py-1 rounded-lg transition duration-300"
            onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}
          >
            <h3 className="font-bold text-gray-700">Categories</h3>
            {isCategoriesOpen ? <ChevronUp className="hidden" size={18} /> : <ChevronDown className="hidden" size={18} />}
          </div>
          <div
            className={`transition-all duration-500 ease-in-out ${isCategoriesOpen ? 'max-h-screen' : 'max-h-0 overflow-hidden'}`}
          >
            {isCategoriesOpen && (
              <div className="space-y-2 ml-1">
                {categories.length > 0 ? (
                  categories.map((category) => (
                    <div key={category} className="flex items-center space-x-2">
                      <Checkbox
                        id={category}
                        checked={selectedCategories.includes(category)}
                        onCheckedChange={() => handleCategoryChange(category)}
                        className="data-[state=unchecked]:border-blue-500 data-[state=checked]:bg-blue-500 data-[state=checked]:border-primary"
                      />
                      <Label htmlFor={category} className="text-sm text-gray-600 cursor-pointer">
                        {category}
                      </Label>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">No categories with items available.</p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Price Range */}
        <div className="mb-6">
          <div
            className="flex justify-between items-center cursor-pointer mb-1 hover:bg-gray-100 px-1 py-1 rounded-lg transition duration-300"
            onClick={() => setIsPriceRangeOpen(!isPriceRangeOpen)}
          >
            <h3 className="font-bold text-gray-700">Price Range</h3>
            {isPriceRangeOpen ? <ChevronUp className="hidden" size={18} /> : <ChevronDown className="hidden" size={18} />}
          </div>
          <div
            className={`transition-all duration-500 ease-in-out ${isPriceRangeOpen ? 'max-h-screen' : 'max-h-0 overflow-hidden'}`}
          >
            {isPriceRangeOpen && (
              <div className="flex space-x-4 ml-1">
                <Input
                  id="min-price"
                  type="number"
                  placeholder="Min"
                  min="0"
                  value={priceRange.min}
                  onChange={(e) => handlePriceChange('min', e.target.value)}
                  className="mt-1 h-8 text-gray-800 placeholder:text-gray-400 border border-gray-300 rounded transition duration-300 focus:ring-2 focus:ring-blue-500"
                />
                <Input
                  id="max-price"
                  type="number"
                  placeholder="Max"
                  value={priceRange.max}
                  onChange={(e) => handlePriceChange('max', e.target.value)}
                  className="mt-1 h-8 text-gray-800 placeholder:text-gray-400 border border-gray-300 rounded transition duration-300 focus:ring-2 focus:ring-blue-500"
                />
              </div>
            )}
          </div>
        </div>

        {/* Status */}
        <div className="mb-6">
          <div
            className="flex justify-between items-center cursor-pointer mb-1 hover:bg-gray-100 px-1 py-1 rounded-lg transition duration-300"
            onClick={() => setIsStatusOpen(!isStatusOpen)}
          >
            <h3 className="font-bold text-gray-700">Status</h3>
            {isStatusOpen ? <ChevronUp className="hidden" size={18} /> : <ChevronDown className="hidden" size={18} />}
          </div>
          <div
            className={`transition-all duration-500 ease-in-out ${isStatusOpen ? 'max-h-screen' : 'max-h-0 overflow-hidden'}`}
          >
            {isStatusOpen && (
              <div className="space-y-2 ml-1">
                {statuses.map((status) => (
                  <div key={status.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={status.id}
                      checked={selectedStatuses.includes(status.id)}
                      onCheckedChange={() => handleStatusChange(status.id)}
                      className="data-[state=unchecked]:border-blue-500 data-[state=checked]:bg-blue-500 data-[state=checked]:border-primary"
                    />
                    <Label htmlFor={status.id} className="text-sm text-gray-600 cursor-pointer">
                      {status.name}
                    </Label>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Priority */}
        <div className="mb-6">
          <div
            className="flex justify-between items-center cursor-pointer mb-1 hover:bg-gray-100 px-1 py-1 rounded-lg transition duration-300"
            onClick={() => setIsPriorityOpen(!isPriorityOpen)}
          >
            <h3 className="font-bold text-gray-700">Priority</h3>
            {isPriorityOpen ? <ChevronUp className="hidden" size={18} /> : <ChevronDown className="hidden" size={18} />}
          </div>
          <div
            className={`transition-all duration-500 ease-in-out ${isPriorityOpen ? 'max-h-screen' : 'max-h-0 overflow-hidden'}`}
          >
            {isPriorityOpen && (
              <div className="space-y-2 ml-1">
                {priorities.map((priority) => (
                  <div key={priority} className="flex items-center space-x-2">
                    <Checkbox
                      id={priority}
                      checked={selectedPriorities.includes(priority)}
                      onCheckedChange={() => handlePriorityChange(priority)}
                      className="data-[state=unchecked]:border-blue-500 data-[state=checked]:bg-blue-500 data-[state=checked]:border-primary"
                    />
                    <Label htmlFor={priority} className="text-sm text-gray-600 cursor-pointer">
                      {priority}
                    </Label>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>   
      </aside>
    </>
  );
};

export default SidebarFilter;