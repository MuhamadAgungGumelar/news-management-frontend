"use client";

import React from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Article } from "@/lib/types/article";
import { PaginatedResponse } from "@/lib/types/api";
import useUIStore from "@/store/uiStore";
import { formatDate } from "@/lib/utils/date";
import { CATEGORY_LABELS, CHART_COLORS } from "@/lib/utils/constants";
import {
  MdEdit,
  MdDelete,
  MdArrowUpward,
  MdArrowDownward,
} from "react-icons/md";
import Pagination from "@/components/common/Pagination";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import EmptyState from "@/components/common/EmptyState";

interface ArticlesTableProps {
  data: Article[];
  meta: PaginatedResponse<Article>["meta"] | null;
  loading: boolean;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
  onRefresh: () => void;
  sortBy: string;
  sortOrder: "ASC" | "DESC";
  onSort: (field: string) => void;
}

const ArticlesTable: React.FC<ArticlesTableProps> = ({
  data,
  meta,
  loading,
  onPageChange,
  onLimitChange,
  onRefresh,
  sortBy,
  sortOrder,
  onSort,
}) => {
  const router = useRouter();
  const { openDeleteConfirm } = useUIStore();

  const SortableHeader = ({
    field,
    children,
  }: {
    field: string;
    children: React.ReactNode;
  }) => {
    const isActive = sortBy === field;
    return (
      <th
        onClick={() => onSort(field)}
        className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase cursor-pointer hover:bg-gray-100 transition-colors select-none"
      >
        <div className="flex items-center gap-2">
          {children}
          {sortOrder === "ASC" ? (
            <MdArrowUpward
              className={`w-4 h-4 ${isActive ? "opacity-100" : "opacity-30"}`}
            />
          ) : (
            <MdArrowDownward
              className={`w-4 h-4 ${isActive ? "opacity-100" : "opacity-30"}`}
            />
          )}
        </div>
      </th>
    );
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-12 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="bg-white p-12">
        <EmptyState
          title="No articles found"
          message="Click 'Sync Now' to fetch articles from News API"
          action={{ label: "Refresh", onClick: onRefresh }}
        />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                Image
              </th>
              <SortableHeader field="title">Title</SortableHeader>
              <SortableHeader field="category">Category</SortableHeader>
              <SortableHeader field="source">Source</SortableHeader>
              <SortableHeader field="publishedAt">Published</SortableHeader>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((article) => (
              <tr
                key={article.id}
                className="hover:bg-gray-50 transition-colors"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  {article.imageUrl ? (
                    <Image
                      src={article.imageUrl}
                      alt={article.title}
                      width={60}
                      height={40}
                      className="rounded object-cover"
                    />
                  ) : (
                    <div className="w-[60px] h-[40px] bg-gray-200 rounded flex items-center justify-center text-xs text-gray-400">
                      No image
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900 max-w-md truncate">
                  {article.title}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className="inline-block px-2 py-1 text-xs font-semibold rounded text-white"
                    style={{ backgroundColor: CHART_COLORS[article.category] }}
                  >
                    {CATEGORY_LABELS[article.category]}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {article.source || "N/A"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {formatDate(article.publishedAt, "PP")}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        router.push(`/articles/edit/${article.id}`)
                      }
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                      aria-label="Edit"
                    >
                      <MdEdit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => openDeleteConfirm(article)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                      aria-label="Delete"
                    >
                      <MdDelete className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {meta && (
        <Pagination
          currentPage={meta.page}
          totalPages={meta.totalPages}
          totalItems={meta.total}
          pageSize={meta.limit}
          onPageChange={onPageChange}
          onPageSizeChange={onLimitChange}
        />
      )}
    </div>
  );
};

export default ArticlesTable;
