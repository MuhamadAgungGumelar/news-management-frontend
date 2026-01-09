"use client";

import React from "react";
import { useParams } from "next/navigation";
import ArticleForm from "@/components/forms/ArticleForm";

export default function EditArticlePage() {
  const params = useParams();
  const articleId = params.id as string;

  return <ArticleForm id={articleId} />;
}
