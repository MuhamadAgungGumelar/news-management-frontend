'use client';

import { useState, useEffect, useCallback } from 'react';
import { articlesApi } from '@/lib/api/articles';
import { Article, ArticleFilters } from '@/lib/types/article';
import { PaginatedResponse } from '@/lib/types/api';

export const useArticles = (filters: ArticleFilters) => {
  const [data, setData] = useState<Article[]>([]);
  const [meta, setMeta] = useState<PaginatedResponse<Article>['meta'] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Use JSON.stringify to create stable dependency
  const filtersKey = JSON.stringify(filters);

  const fetchArticles = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await articlesApi.getArticles(filters);
      setData(response.data);
      setMeta(response.meta);
    } catch (err) {
      setError(err as Error);
      setData([]);
      setMeta(null);
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filtersKey]);

  useEffect(() => {
    fetchArticles();
  }, [fetchArticles]);

  return {
    data,
    meta,
    loading,
    error,
    refetch: fetchArticles
  };
};
