"use client";

import React, { useState } from "react";
import { MdClose, MdFilterList } from "react-icons/md";
import { CATEGORY_LABELS } from "@/lib/utils/constants";
import { DateRange } from "@/lib/types/common";
import { format } from "date-fns";

interface FilterModalProps {
  open: boolean;
  onClose: () => void;
  onApply: (filters: FilterValues) => void;
  currentFilters: FilterValues;
}

export interface FilterValues {
  categories: string[];
  source: string;
  author: string;
  dateRange: DateRange | null;
}

const FilterModal: React.FC<FilterModalProps> = ({
  open,
  onClose,
  onApply,
  currentFilters,
}) => {
  const [filters, setFilters] = useState<FilterValues>(currentFilters);

  if (!open) return null;

  const handleCategoryToggle = (category: string) => {
    setFilters((prev) => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter((c) => c !== category)
        : [...prev.categories, category],
    }));
  };

  const handleApply = () => {
    onApply(filters);
    onClose();
  };

  const handleClear = () => {
    const clearedFilters: FilterValues = {
      categories: [],
      source: "",
      author: "",
      dateRange: null,
    };
    setFilters(clearedFilters);
    onApply(clearedFilters);
    onClose();
  };

  const formatInputDate = (date: Date) => {
    return format(date, "yyyy-MM-dd");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <MdFilterList className="w-6 h-6 text-gray-700 dark:text-gray-300" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Filter Articles</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
          >
            <MdClose className="w-5 h-5 text-gray-700 dark:text-gray-300" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Categories */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Categories
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {Object.entries(CATEGORY_LABELS).map(([value, label]) => (
                <button
                  key={value}
                  onClick={() => handleCategoryToggle(value)}
                  className={`px-4 py-2 text-sm rounded-md border transition-colors ${
                    filters.categories.includes(value)
                      ? "bg-red-50 dark:bg-red-900/30 border-red-500 dark:border-red-600 text-red-700 dark:text-red-400"
                      : "bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Source */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Source
            </label>
            <input
              type="text"
              value={filters.source}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, source: e.target.value }))
              }
              placeholder="e.g. CNN, BBC, TechCrunch"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
            />
          </div>

          {/* Author */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Author
            </label>
            <input
              type="text"
              value={filters.author}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, author: e.target.value }))
              }
              placeholder="Author name"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 dark:focus:ring-red-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
            />
          </div>

          {/* Date Range */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Published Date Range
            </label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">From</label>
                <input
                  type="date"
                  value={
                    filters.dateRange?.from
                      ? formatInputDate(filters.dateRange.from)
                      : ""
                  }
                  onChange={(e) => {
                    const newDate = e.target.value
                      ? new Date(e.target.value)
                      : null;
                    setFilters((prev) => ({
                      ...prev,
                      dateRange: newDate
                        ? { from: newDate, to: prev.dateRange?.to || newDate }
                        : null,
                    }));
                  }}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-red-500 dark:focus:ring-red-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">To</label>
                <input
                  type="date"
                  value={
                    filters.dateRange?.to
                      ? formatInputDate(filters.dateRange.to)
                      : ""
                  }
                  onChange={(e) => {
                    const newDate = e.target.value
                      ? new Date(e.target.value)
                      : null;
                    setFilters((prev) => ({
                      ...prev,
                      dateRange: newDate
                        ? {
                            from: prev.dateRange?.from || newDate,
                            to: newDate,
                          }
                        : null,
                    }));
                  }}
                  min={
                    filters.dateRange?.from
                      ? formatInputDate(filters.dateRange.from)
                      : undefined
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-red-500 dark:focus:ring-red-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-3 p-6 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={handleClear}
            className="flex-1 py-2.5 px-4 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md transition-colors text-gray-700 dark:text-gray-300"
          >
            Clear All
          </button>
          <button
            onClick={handleApply}
            className="flex-1 py-2.5 px-4 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterModal;
