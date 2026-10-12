"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import Alert from "@/components/shared/Alert";
import GlassCard from "@/components/shared/GlassCard";
import LoadingState from "@/components/shared/LoadingState";
import ProgressBar from "@/components/shared/ProgressBar";
import LearningMedia from "@/components/shared/LearningMedia";
import Button from "@/components/ui/Button";
import {
  getLearningModule,
  getLearningContentsByModule,
  getLearningProgress,
  completeLearningContent,
} from "@/services/learning.service";
import type {
  LearningModule,
  LearningContent,
  LearningProgress,
} from "@/types/learning";

export default function LearningPlayerView({
  moduleId,
  initialContentId,
}: {
  moduleId: string;
  initialContentId?: string;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const requestedId = initialContentId || searchParams.get("content");
  const [module, setModule] = useState<LearningModule | null>(null);
  const [contents, setContents] = useState<LearningContent[]>([]);
  const [progress, setProgress] = useState<LearningProgress | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const savingRef = useRef(false);
  const activeModuleRef = useRef(moduleId);
  activeModuleRef.current = moduleId;
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError("");
    setModule(null);
    setContents([]);
    setProgress(null);
    setSelectedId(null);
    Promise.all([
      getLearningModule(moduleId),
      getLearningContentsByModule(moduleId),
      getLearningProgress(moduleId),
    ])
      .then(([moduleData, items, progressData]) => {
        if (cancelled) return;
        const active = items
          .filter((item) => item.isActive)
          .sort((a, b) => a.order - b.order);
        setModule(moduleData);
        setContents(active);
        setProgress(progressData);
        setSelectedId(
          active.find(
            (item) =>
              !progressData.contents.some(
                (p) => p.learningContentId === item.id && p.isCompleted,
              ),
          )?.id ||
            active[0]?.id ||
            null,
        );
      })
      .catch((err) => {
        if (!cancelled)
          setError(
            err instanceof Error ? err.message : "Unable to load this module.",
          );
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [moduleId]);
  useEffect(() => {
    if (requestedId && contents.some((item) => item.id === requestedId))
      setSelectedId(requestedId);
  }, [requestedId, contents]);
  const content = contents.find((item) => item.id === selectedId);
  const completed = !!progress?.contents.some(
    (item) => item.learningContentId === selectedId && item.isCompleted,
  );
  const index = contents.findIndex((item) => item.id === selectedId);
  function select(id: string) {
    router.push(
      `/learning/${encodeURIComponent(moduleId)}?content=${encodeURIComponent(id)}`,
      { scroll: false },
    );
  }
  async function complete() {
    if (!content || completed || savingRef.current) return;
    const currentModuleId = moduleId;
    savingRef.current = true;
    setSaving(true);
    setError("");
    try {
      await completeLearningContent(content.id);
      const updated = await getLearningProgress(currentModuleId);
      if (activeModuleRef.current === currentModuleId) setProgress(updated);
    } catch (err) {
      if (activeModuleRef.current === currentModuleId)
        setError(
          err instanceof Error ? err.message : "Could not save your progress.",
        );
    } finally {
      savingRef.current = false;
      setSaving(false);
    }
  }
  if (loading)
    return <LoadingState label="Preparing your learning mission..." />;
  if (!module) return <Alert>{error || "This module is not available."}</Alert>;
  return (
    <div className="space-y-6">
      <Link
        href="/learning"
        className="inline-flex text-sm font-semibold text-[#006CB8]"
      >
        ← All learning missions
      </Link>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#006CB8]">
            Learning mission · {module.trainingDomainName}
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
            {module.name}
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
            {module.description}
          </p>
        </div>
        <span className="rounded-full border border-white bg-white/80 px-4 py-2 text-xs font-semibold text-[#006CB8]">
          {progress?.completedContents ?? 0} /{" "}
          {progress?.totalContents ?? contents.length} materials complete
        </span>
      </div>
      {error && <Alert>{error}</Alert>}
      {requestedId && !contents.some((item) => item.id === requestedId) && (
        <Alert>
          This material is unavailable. Choose another material from the module.
        </Alert>
      )}
      <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
        <GlassCard className="min-w-0 overflow-hidden p-3 sm:p-5">
          {content ? (
            <>
              <LearningMedia key={content.id} content={content} />
              <div className="px-2 pb-3 pt-6 sm:px-3">
                <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
                  <span className="rounded-full bg-blue-50 px-3 py-1 text-[#006CB8]">
                    {content.contentType}
                  </span>
                  <span className="text-slate-500">
                    {content.estimatedMinutes} min · Material {index + 1} of{" "}
                    {contents.length}
                  </span>
                  {completed && (
                    <span className="text-emerald-700">✓ Completed</span>
                  )}
                </div>
                <h2 className="mt-4 text-2xl font-bold text-slate-900">
                  {content.title}
                </h2>
                <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-slate-600">
                  {content.description ||
                    "Study this material before continuing to the next lesson."}
                </p>
                <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-5">
                  <p className="text-xs text-slate-500">
                    {completed
                      ? "Your progress has been saved."
                      : "Finished studying? Save your progress."}
                  </p>
                  <Button
                    fullWidth={false}
                    onClick={complete}
                    isLoading={saving}
                    disabled={completed || saving}
                  >
                    {completed ? "✓ Material completed" : "Mark as complete"}
                  </Button>
                </div>
                <div className="mt-4 flex justify-between gap-3">
                  <Button
                    fullWidth={false}
                    variant="secondary"
                    disabled={index <= 0}
                    onClick={() => select(contents[index - 1].id)}
                  >
                    ← Previous
                  </Button>
                  <Button
                    fullWidth={false}
                    variant="secondary"
                    disabled={index >= contents.length - 1}
                    onClick={() => select(contents[index + 1].id)}
                  >
                    Next material
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="p-8 text-center text-slate-600">
              No active materials have been added to this module yet.
            </div>
          )}
        </GlassCard>
        <GlassCard as="section" className="overflow-hidden">
          <div className="border-b border-slate-100 p-5">
            <p className="text-xs font-bold uppercase tracking-widest text-[#006CB8]">
              Mission progress
            </p>
            <div className="my-3 flex items-center justify-between">
              <h2 className="font-bold text-slate-900">Module materials</h2>
              <span className="text-sm font-bold text-[#006CB8]">
                {progress?.progressPercentage ?? 0}%
              </span>
            </div>
            <ProgressBar value={progress?.progressPercentage ?? 0} />
          </div>
          <ol className="max-h-[560px] space-y-2 overflow-y-auto p-3">
            {contents.map((item, i) => {
              const done = progress?.contents.some(
                (p) => p.learningContentId === item.id && p.isCompleted,
              );
              return (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={() => select(item.id)}
                    aria-current={item.id === selectedId ? "step" : undefined}
                    className={`flex w-full items-start gap-3 rounded-xl border p-3 text-left transition ${item.id === selectedId ? "border-[#006CB8]/25 bg-blue-50" : "border-transparent hover:bg-slate-50"}`}
                  >
                    <span
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xs font-bold ${done ? "bg-emerald-50 text-emerald-700" : item.id === selectedId ? "bg-[#006CB8] text-white" : "bg-slate-100 text-slate-500"}`}
                    >
                      {done ? "✓" : String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="min-w-0">
                      <span className="block text-sm font-semibold text-slate-900">
                        {item.title}
                      </span>
                      <span className="mt-1 block text-xs text-slate-500">
                        {item.contentType} · {item.estimatedMinutes} min
                        {done ? " · Completed" : ""}
                      </span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ol>
          {progress?.isCompleted && (
            <div className="border-t border-slate-100 p-5">
              <p className="mb-3 text-sm font-semibold text-emerald-700">
                ✓ Mission completed
              </p>
              <Link
                href={`/assessment?moduleId=${encodeURIComponent(moduleId)}`}
                className="text-sm font-bold text-[#006CB8]"
              >
                Continue to theory challenge
              </Link>
            </div>
          )}
        </GlassCard>
      </div>
    </div>
  );
}
