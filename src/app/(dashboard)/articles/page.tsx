"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useArticles } from "@/hooks/useArticles";
import { useDebounce } from "@/hooks/useDebounce";
import useUIStore from "@/store/uiStore";
import TableContainer from "@/components/common/TableContainer";
import SearchBar from "@/components/management/SearchBar";
import DeleteConfirmDialog from "@/components/management/DeleteConfirmDialog";
import FilterModal, { FilterValues } from "@/components/management/FilterModal";
import { MdAdd, MdFilterList, MdEdit, MdDelete } from "react-icons/md";
import { format } from "date-fns";
import { Article } from "@/lib/types/article";
import { CATEGORY_LABELS, CHART_COLORS } from "@/lib/utils/constants";
import { formatDate } from "@/lib/utils/date";

export default function ManagementPage() {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [sortBy, setSortBy] = useState("updatedAt");
  const [sortOrder, setSortOrder] = useState<"ASC" | "DESC">("DESC");
  const [filterModalOpen, setFilterModalOpen] = useState(false);

  const { managementFilters, setManagementFilters, clearManagementFilters, openDeleteConfirm } =
    useUIStore();
  const debouncedSearch = useDebounce(managementFilters.search, 300);

  // Convert dateRange to API format
  const dateFrom = managementFilters.dateRange?.from
    ? format(managementFilters.dateRange.from, "yyyy-MM-dd")
    : undefined;
  const dateTo = managementFilters.dateRange?.to
    ? format(managementFilters.dateRange.to, "yyyy-MM-dd")
    : undefined;

  const { data, meta, loading, refetch } = useArticles({
    page,
    limit,
    search: debouncedSearch,
    category: managementFilters.categories.join(","),
    source: managementFilters.source || undefined,
    author: managementFilters.author || undefined,
    dateFrom,
    dateTo,
    sortBy,
    sortOrder,
  });

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleLimitChange = (newLimit: number) => {
    setLimit(newLimit);
    setPage(1);
  };

  const handleSearch = (query: string) => {
    setManagementFilters({ search: query });
    setPage(1);
  };

  const handleSort = (field: string, order: "ASC" | "DESC" | "") => {
    if (order === "") {
      setSortBy("updatedAt");
      setSortOrder("DESC");
    } else {
      setSortBy(field);
      setSortOrder(order);
    }
    setPage(1);
  };

  const handleApplyFilters = (filters: FilterValues) => {
    setManagementFilters({
      categories: filters.categories,
      source: filters.source || null,
      author: filters.author || null,
      dateRange: filters.dateRange,
    });
    setPage(1);
  };

  const handleClearFilters = () => {
    clearManagementFilters();
    setPage(1);
  };

  // Count active filters
  const activeFiltersCount =
    managementFilters.categories.length +
    (managementFilters.source ? 1 : 0) +
    (managementFilters.author ? 1 : 0) +
    (managementFilters.dateRange ? 1 : 0);

  const currentFilterValues: FilterValues = {
    categories: managementFilters.categories,
    source: managementFilters.source || "",
    author: managementFilters.author || "",
    dateRange: managementFilters.dateRange,
  };

  // Define table columns
  const columns = [
    {
      key: "imageUrl",
      label: "Image",
      sortable: false,
      render: (article: Article) => (
        article.imageUrl ? (
          <Image
            src={article.imageUrl}
            alt={article.title}
            width={60}
            height={40}
            className="rounded object-cover"
          />
        ) : (
          <div className="w-[60px] h-[40px] bg-gray-200 dark:bg-gray-700 rounded flex items-center justify-center text-xs text-gray-400 dark:text-gray-500">
            No image
          </div>
        )
      ),
    },
    {
      key: "title",
      label: "Title",
      sortable: true,
      render: (article: Article) => (
        <span className="max-w-md truncate block">{article.title}</span>
      ),
    },
    {
      key: "category",
      label: "Category",
      sortable: true,
      render: (article: Article) => (
        <span
          className="inline-block px-2 py-1 text-xs font-semibold rounded text-white"
          style={{ backgroundColor: CHART_COLORS[article.category] }}
        >
          {CATEGORY_LABELS[article.category]}
        </span>
      ),
    },
    {
      key: "source",
      label: "Source",
      sortable: true,
      render: (article: Article) => article.source || "N/A",
    },
    {
      key: "publishedAt",
      label: "Published",
      sortable: true,
      render: (article: Article) => formatDate(article.publishedAt, "PP"),
    },
    {
      key: "actions",
      label: "Actions",
      sortable: false,
      render: (article: Article) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => router.push(`/articles/edit/${article.id}`)}
            className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-md transition-colors"
            aria-label="Edit article"
          >
            <MdEdit className="w-5 h-5" />
          </button>
          <button
            onClick={() => openDeleteConfirm(article)}
            className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors"
            aria-label="Delete article"
          >
            <MdDelete className="w-5 h-5" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Articles Management</h1>
      </div>

      {/* Search & Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
        <div className="flex items-center justify-between gap-4 mb-8">
          <div className="flex-1 max-w-md">
            <SearchBar
              value={managementFilters.search}
              onChange={handleSearch}
            />
          </div>

          <div className="flex items-center gap-3">
            {/* Filter Button */}
            <button
              onClick={() => setFilterModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-md transition-colors relative"
            >
              <MdFilterList className="w-5 h-5" />
              Filters
              {activeFiltersCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {activeFiltersCount}
                </span>
              )}
            </button>

            {/* Clear Filters */}
            {activeFiltersCount > 0 && (
              <button
                onClick={handleClearFilters}
                className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 underline"
              >
                Clear all
              </button>
            )}

            {/* Create Button */}
            <button
              onClick={() => router.push("/articles/create")}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors"
            >
              <MdAdd className="w-5 h-5" />
              Create Article
            </button>
          </div>
        </div>

        {/* Table Container */}
        <TableContainer
          columns={columns}
          data={data}
          pagination={
            meta
              ? {
                  page: meta.page,
                  limit: meta.limit,
                  total: meta.total,
                  totalPages: meta.totalPages,
                }
              : null
          }
          isLoading={loading}
          onPageChange={handlePageChange}
          onLimitChange={handleLimitChange}
          onSort={handleSort}
          currentSort={{ sortBy, sortOrder }}
        />
      </div>

      {/* Filter Modal */}
      <FilterModal
        open={filterModalOpen}
        onClose={() => setFilterModalOpen(false)}
        onApply={handleApplyFilters}
        currentFilters={currentFilterValues}
      />

      {/* Delete Dialog */}
      <DeleteConfirmDialog onSuccess={refetch} />
    </div>
  );
}
