"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { articlesApi } from "@/lib/api/articles";
import { articleFormSchema, ArticleFormValues } from "@/lib/utils/validators";
import FormInput from "@/components/forms/FormInput";
import FormSelect from "@/components/forms/FormSelect";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import ErrorAlert from "@/components/common/ErrorAlert";
import Breadcrumb from "@/components/common/Breadcrumb";
import { CATEGORY_LABELS } from "@/lib/utils/constants";
import { Article } from "@/lib/types/article";

interface ArticleFormProps {
  id?: string;
}

const ArticleForm: React.FC<ArticleFormProps> = ({ id }) => {
  const router = useRouter();
  const isEdit = !!id;

  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(isEdit);
  const [error, setError] = useState<string | null>(null);
  const [article, setArticle] = useState<Article | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ArticleFormValues>({
    resolver: zodResolver(articleFormSchema),
    defaultValues: {
      title: "",
      description: "",
      content: "",
      url: "",
      imageUrl: "",
      source: "",
      author: "",
      category: "technology",
      publishedAt: new Date().toISOString().split("T")[0],
    },
  });

  // Fetch article data for edit mode
  useEffect(() => {
    if (!isEdit || !id) return;

    const fetchArticle = async () => {
      try {
        setFetchLoading(true);
        const response = await articlesApi.getArticle(id);
        const articleData = response.data;
        setArticle(articleData);

        // Populate form with article data
        reset({
          title: articleData.title,
          description: articleData.description || "",
          content: articleData.content || "",
          url: articleData.url,
          imageUrl: articleData.imageUrl || "",
          source: articleData.source || "",
          author: articleData.author || "",
          category: articleData.category,
          publishedAt: articleData.publishedAt.split("T")[0],
        });
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to fetch article";
        setError(message);
        toast.error(message);
      } finally {
        setFetchLoading(false);
      }
    };

    fetchArticle();
  }, [id, isEdit, reset]);

  const onSubmit = async (data: ArticleFormValues) => {
    setLoading(true);
    try {
      if (isEdit && id) {
        await articlesApi.updateArticle(id, data);
        toast.success("Article updated successfully");
      } else {
        await articlesApi.createArticle(data);
        toast.success("Article created successfully");
      }
      router.push("/management");
    } catch (error: unknown) {
      let message = isEdit
        ? "Failed to update article"
        : "Failed to create article";
      if (error instanceof Error) {
        message = error.message;
      }
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const categoryOptions = Object.entries(CATEGORY_LABELS).map(
    ([value, label]) => ({
      value,
      label,
    })
  );

  // Loading state
  if (fetchLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // Error state
  if (isEdit && (error || !article)) {
    return (
      <div className="mx-auto">
        <Breadcrumb
          backLink="/management"
          currentPage="Edit Article"
          breadcrumbItems={[
            { link: "/dashboard", name: "Dashboard" },
            { link: "/management", name: "Management" },
          ]}
        />
        <ErrorAlert
          message={error || "Article not found"}
          onRetry={() => window.location.reload()}
        />
      </div>
    );
  }

  return (
    <div className="mx-auto">
      {/* Breadcrumb */}
      <Breadcrumb
        backLink="/management"
        currentPage={isEdit ? "Edit Article" : "Create New Article"}
        breadcrumbItems={[
          { link: "/dashboard", name: "Dashboard" },
          { link: "/articles", name: "Articles" },
        ]}
      />

      <p className="text-gray-600 dark:text-gray-400 mb-6">
        {isEdit
          ? "Update the article details below"
          : "Fill in the details below to create a new article"}
      </p>

      {/* Form */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md">
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
          {/* Basic Info Section */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700 pb-2">
              Basic Information
            </h2>

            <FormInput
              label="Title"
              name="title"
              placeholder="Enter article title"
              required
              register={register as never}
              error={errors.title}
            />

            <FormInput
              label="Description"
              name="description"
              placeholder="Brief description of the article"
              register={register as never}
              error={errors.description}
            />
          </div>

          {/* URLs Section */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700 pb-2">
              URLs
            </h2>

            <FormInput
              label="Article URL"
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
          </div>

          {/* Metadata Section */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700 pb-2">
              Metadata
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-4 border-t">
            <button
              type="button"
              onClick={() => router.back()}
              disabled={loading}
              className="flex-1 py-2.5 px-4 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md transition-colors disabled:opacity-50 text-gray-700 dark:text-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2.5 px-4 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading && <LoadingSpinner size="sm" />}
              {loading
                ? isEdit
                  ? "Updating..."
                  : "Creating..."
                : isEdit
                ? "Update Article"
                : "Create Article"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ArticleForm;
