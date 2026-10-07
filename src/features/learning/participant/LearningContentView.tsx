"use client";
import Button from "@/components/ui/Button";

import Alert from "@/components/shared/Alert";

import LoadingState from "@/components/shared/LoadingState";

import GlassCard from "@/components/shared/GlassCard";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  completeLearningContent,
  getLearningContent,
  getLearningContentsByModule,
  getLearningProgress,
} from "@/services/learning.service";
import type { LearningContent, LearningProgress } from "@/types/learning";

interface LearningContentViewProps {
  moduleId: string;
  contentId: string;
}

export default function LearningContentView({
  moduleId,
  contentId,
}: LearningContentViewProps) {
  const [content, setContent] = useState<LearningContent | null>(null);
  const [contents, setContents] = useState<LearningContent[]>([]);
  const [progress, setProgress] = useState<LearningProgress | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [isCompleting, setIsCompleting] = useState(false);
  const [error, setError] = useState("");

  async function loadContent() {
    try {
      setError("");

      const [contentData, contentsData, progressData] = await Promise.all([
        getLearningContent(contentId),
        getLearningContentsByModule(moduleId),
        getLearningProgress(moduleId),
      ]);

      setContent(contentData);

      setContents(
        contentsData
          .filter((item) => item.isActive)
          .sort((a, b) => a.order - b.order),
      );

      setProgress(progressData);
    } catch (err) {
      console.error(err);
      setError("Failed to load learning content.");
    }
  }

  useEffect(() => {
    async function initialize() {
      setIsLoading(true);
      await loadContent();
      setIsLoading(false);
    }

    initialize();
  }, [moduleId, contentId]);

  const contentProgress = progress?.contents.find(
    (item) => item.learningContentId === contentId,
  );

  const isCompleted = contentProgress?.isCompleted ?? false;

  const currentIndex = contents.findIndex((item) => item.id === contentId);

  const previousContent = currentIndex > 0 ? contents[currentIndex - 1] : null;

  const nextContent =
    currentIndex >= 0 && currentIndex < contents.length - 1
      ? contents[currentIndex + 1]
      : null;

  async function handleComplete() {
    if (isCompleted) {
      return;
    }

    try {
      setIsCompleting(true);
      setError("");

      await completeLearningContent(contentId);

      await loadContent();
    } catch (err) {
      console.error(err);
      setError("Failed to mark this content as completed.");
    } finally {
      setIsCompleting(false);
    }
  }

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <LoadingState label="Loading learning content..." />
      </div>
    );
  }

  if (error && !content) {
    return <Alert>{error}</Alert>;
  }

  if (!content) {
    return (
      <GlassCard className="p-8">
        <p className="font-semibold text-slate-900">
          Learning content not found.
        </p>
      </GlassCard>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <Link
          href={`/learning/${moduleId}`}
          className="text-sm font-semibold text-[#006CB8] hover:underline"
        >
          ← Back to Module
        </Link>
      </div>

      <GlassCard className="p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-[#006CB8]">
              {content.learningModuleName}
            </p>

            <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
              {content.title}
            </h1>

            <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-slate-500">
              <span className="rounded-full bg-blue-50 px-3 py-1 font-semibold text-[#006CB8]">
                {content.contentType}
              </span>

              <span>{content.estimatedMinutes} min</span>

              {isCompleted && (
                <>
                  <span>•</span>

                  <span className="font-semibold text-emerald-600">
                    Completed
                  </span>
                </>
              )}
            </div>
          </div>

          <div
            className={`rounded-full px-3 py-1 text-xs font-semibold ${
              isCompleted
                ? "bg-emerald-50 text-emerald-700"
                : "bg-amber-50 text-amber-700"
            }`}
          >
            {isCompleted ? "Completed" : "In Progress"}
          </div>
        </div>
      </GlassCard>

      <ContentViewer content={content} />

      <GlassCard className="p-6">
        <h2 className="text-lg font-bold text-slate-900">
          About This Material
        </h2>

        <p className="mt-3 text-sm leading-7 text-slate-600">
          {content.description ?? "No description available."}
        </p>
      </GlassCard>

      {error && <Alert>{error}</Alert>}

      <GlassCard className="flex flex-col gap-3  p-6  sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-semibold text-slate-900">
            {isCompleted
              ? "Material completed"
              : "Finished studying this material?"}
          </p>

          <p className="mt-1 text-sm text-slate-500">
            {isCompleted
              ? "Your learning progress has been saved."
              : "Mark this material as complete to update your learning progress."}
          </p>
        </div>

        {isCompleted ? (
          <Link
            href={`/learning/${moduleId}`}
            className="rounded-xl bg-[#006CB8] px-5 py-3 text-center text-sm font-semibold text-white transition hover:opacity-90"
          >
            Back to Module
          </Link>
        ) : (
          <Button
            fullWidth={false}
            type="button"
            onClick={handleComplete}
            disabled={isCompleting}
            className="rounded-xl bg-[#006CB8] px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isCompleting ? "Saving..." : "Mark as Complete"}
          </Button>
        )}
      </GlassCard>

      <div className="flex items-center justify-between gap-4">
        <div>
          {previousContent && (
            <Link
              href={`/learning/${moduleId}/contents/${previousContent.id}`}
              className="inline-flex rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              ← Previous Material
            </Link>
          )}
        </div>

        <div>
          {nextContent && (
            <Link
              href={`/learning/${moduleId}/contents/${nextContent.id}`}
              className="inline-flex rounded-xl bg-[#006CB8] px-4 py-3 text-sm font-semibold text-white transition hover:opacity-90"
            >
              Next Material →
            </Link>
          )}
        </div>
      </div>

      {progress?.isCompleted && (
        <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-6">
          <p className="text-sm font-semibold text-emerald-700">
            Learning Module Completed
          </p>

          <h2 className="mt-1 text-xl font-bold text-slate-900">
            You have completed {progress.learningModuleName}
          </h2>

          <p className="mt-2 text-sm leading-6 text-slate-600">
            All learning materials in this module have been completed. You can
            continue to the theory assessment when it is available.
          </p>

          <Link
            href="/assessment"
            className="mt-5 inline-flex rounded-xl bg-[#006CB8] px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90"
          >
            Continue to Assessment →
          </Link>
        </div>
      )}
    </div>
  );
}

function ContentViewer({ content }: { content: LearningContent }) {
  const contentType = content.contentType.toUpperCase();

  if (!content.contentUrl) {
    return (
      <div className="flex min-h-[300px] items-center justify-center rounded-2xl border border-slate-200 bg-slate-950 p-8 text-center">
        <div>
          <p className="font-semibold text-white">Content unavailable</p>

          <p className="mt-2 text-sm text-slate-400">
            No content URL has been provided for this material.
          </p>
        </div>
      </div>
    );
  }

  if (contentType === "VIDEO") {
    return (
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-950 shadow-sm">
        <div className="flex aspect-video items-center justify-center p-8">
          <div className="text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-white/10 text-2xl text-white">
              ▶
            </div>

            <p className="mt-4 font-semibold text-white">
              Video Learning Material
            </p>

            <p className="mt-1 text-sm text-slate-400">
              Open the training video to start learning.
            </p>

            <a
              href={content.contentUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-slate-900"
            >
              Open Video
            </a>
          </div>
        </div>
      </div>
    );
  }

  if (contentType === "PDF") {
    return (
      <GlassCard className="p-8 text-center">
        <p className="text-lg font-bold text-slate-900">
          PDF Learning Material
        </p>

        <p className="mt-2 text-sm text-slate-500">
          Open the document to study this material.
        </p>

        <a
          href={content.contentUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-5 inline-flex rounded-xl bg-[#006CB8] px-5 py-3 text-sm font-semibold text-white"
        >
          Open PDF
        </a>
      </GlassCard>
    );
  }

  return (
    <GlassCard className="p-8">
      <p className="font-semibold text-slate-900">Learning Resource</p>

      <p className="mt-2 text-sm text-slate-500">
        Open the learning resource using the link below.
      </p>

      <a
        href={content.contentUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-5 inline-flex rounded-xl bg-[#006CB8] px-5 py-3 text-sm font-semibold text-white"
      >
        Open Learning Resource
      </a>
    </GlassCard>
  );
}
