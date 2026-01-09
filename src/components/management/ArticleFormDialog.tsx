'use client';

import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import useUIStore from '@/store/uiStore';
import { articlesApi } from '@/lib/api/articles';
import { articleFormSchema, ArticleFormValues } from '@/lib/utils/validators';
import FormInput from '@/components/forms/FormInput';
import FormSelect from '@/components/forms/FormSelect';
import { MdClose } from 'react-icons/md';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { CATEGORY_LABELS } from '@/lib/utils/constants';

interface ArticleFormDialogProps {
  onSuccess: () => void;
}

const ArticleFormDialog: React.FC<ArticleFormDialogProps> = ({ onSuccess }) => {
  const { articleFormDialog, closeArticleForm } = useUIStore();
  const { open, article } = articleFormDialog;
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ArticleFormValues>({
    resolver: zodResolver(articleFormSchema),
  });

  useEffect(() => {
    if (article) {
      reset({
        title: article.title,
        description: article.description || '',
        content: article.content || '',
        url: article.url,
        imageUrl: article.imageUrl || '',
        source: article.source || '',
        author: article.author || '',
        category: article.category,
        publishedAt: article.publishedAt.split('T')[0], // Convert to YYYY-MM-DD
      });
    } else {
      reset({
        title: '',
        description: '',
        content: '',
        url: '',
        imageUrl: '',
        source: '',
        author: '',
        category: 'technology',
        publishedAt: new Date().toISOString().split('T')[0],
      });
    }
  }, [article, reset]);

  const onSubmit = async (data: ArticleFormValues) => {
    setLoading(true);
    try {
      if (article) {
        await articlesApi.updateArticle(article.id, data);
        toast.success('Article updated successfully');
      } else {
        await articlesApi.createArticle(data);
        toast.success('Article created successfully');
      }
      closeArticleForm();
      onSuccess();
    } catch (error: unknown) {
      let message = 'Failed to save article';
      if (error instanceof Error) {
        message = error.message;
      }
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  const categoryOptions = Object.entries(CATEGORY_LABELS).map(([value, label]) => ({
    value,
    label,
  }));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold">
            {article ? 'Edit Article' : 'Create Article'}
          </h2>
          <button
            onClick={closeArticleForm}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <MdClose className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
          <FormInput
            label="Title"
            name="title"
            placeholder="Enter article title"
            required
            register={register as never}
            error={errors.title}
          />

          <FormInput
            label="URL"
            name="url"
            type="url"
            placeholder="https://example.com/article"
            required
            register={register as never}
            error={errors.url}
          />

          <FormInput
            label="Image URL"
            name="imageUrl"
            type="url"
            placeholder="https://example.com/image.jpg"
            register={register as never}
            error={errors.imageUrl}
          />

          <div className="grid grid-cols-2 gap-4">
            <FormSelect
              label="Category"
              name="category"
              options={categoryOptions}
              required
              register={register as never}
              error={errors.category}
            />

            <FormInput
              label="Published Date"
              name="publishedAt"
              type="date"
              required
              register={register as never}
              error={errors.publishedAt}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormInput
              label="Source"
              name="source"
              placeholder="e.g. CNN, BBC"
              register={register as never}
              error={errors.source}
            />

            <FormInput
              label="Author"
              name="author"
              placeholder="Author name"
              register={register as never}
              error={errors.author}
            />
          </div>

          <FormInput
            label="Description"
            name="description"
            placeholder="Brief description"
            register={register as never}
            error={errors.description}
          />

          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={closeArticleForm}
              className="flex-1 py-2 px-4 border border-gray-300 hover:bg-gray-50 rounded-md transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2 px-4 bg-brand-500 hover:bg-brand-600 text-white rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading && <LoadingSpinner size="sm" />}
              {loading ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ArticleFormDialog;
