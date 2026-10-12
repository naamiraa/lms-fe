"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import Button from "@/components/ui/Button";
import Alert from "@/components/shared/Alert";
import LoadingState from "@/components/shared/LoadingState";
import GlassCard from "@/components/shared/GlassCard";
import PageHeader from "@/components/shared/PageHeader";
import {
  getAvailableAssessments,
  startAssessment,
} from "@/services/assessment.service";
import { getLearningModule } from "@/services/learning.service";
import type { Assessment } from "@/types/admin-assessment";

export default function AssessmentView() {
  const router = useRouter();
  const params = useSearchParams();
  const moduleId = params.get("moduleId") || undefined;
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [moduleName, setModuleName] = useState("");
  const [loading, setLoading] = useState(true);
  const [isStarting, setIsStarting] = useState(false);
  const [error, setError] = useState("");
  const startingRef = useRef(false);
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError("");
    setAssessments([]);
    setSelectedId(null);
    setModuleName("");
    Promise.all([
      getAvailableAssessments(moduleId),
      moduleId ? getLearningModule(moduleId) : Promise.resolve(null),
    ])
      .then(([items, module]) => {
        if (cancelled) return;
        const available = items.filter(
          (item) =>
            item.isActive &&
            item.type.toUpperCase() === "POST_TEST" &&
            (!moduleId || item.learningModuleId === moduleId),
        );
        setAssessments(available);
        setModuleName(module?.name || "");
        if (available.length === 1) setSelectedId(available[0].id);
      })
      .catch((err) => {
        if (!cancelled)
          setError(
            err instanceof Error ? err.message : "Could not load assessments.",
          );
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [moduleId]);
  const selected = assessments.find((item) => item.id === selectedId);
  async function handleStartAssessment() {
    if (!selected || startingRef.current) return;
    startingRef.current = true;
    setIsStarting(true);
    setError("");
    try {
      const attempt = await startAssessment(selected.id);
      sessionStorage.setItem(
        `assessment_attempt_${attempt.attemptId}`,
        JSON.stringify(attempt),
      );
      router.push(`/assessment/attempts/${attempt.attemptId}`);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to start assessment.",
      );
    } finally {
      startingRef.current = false;
      setIsStarting(false);
    }
  }
  if (loading)
    return <LoadingState label="Finding your module assessment..." />;
  return (
    <div className="space-y-6">
      {moduleId && (
        <Link
          href={`/learning/${encodeURIComponent(moduleId)}`}
          className="text-sm font-semibold text-[#006CB8]"
        >
          ← Back to module
        </Link>
      )}
      <PageHeader
        tone="brand"
        eyebrow="Theory Assessment"
        title={selected?.title || "Theory Challenges"}
        description={
          moduleName
            ? `Post-test for ${moduleName}`
            : "Choose the post-test for your learning module."
        }
      />
      {error && <Alert>{error}</Alert>}
      {!error && assessments.length === 0 && (
        <GlassCard className="p-8">
          <h2 className="text-lg font-bold text-slate-900">
            Assessment not available yet
          </h2>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            {moduleName
              ? `No active post-test is linked to ${moduleName}.`
              : "No active post-tests are available."}{" "}
            Please contact your administrator to add the assessment for this
            module.
          </p>
        </GlassCard>
      )}
      {assessments.length > 1 && (
        <GlassCard className="p-5">
          <h2 className="mb-4 font-bold text-slate-900">
            Choose an assessment
          </h2>
          <div className="grid gap-3 md:grid-cols-2">
            {assessments.map((item) => (
              <button
                key={item.id}
                type="button"
                disabled={isStarting}
                onClick={() => setSelectedId(item.id)}
                aria-pressed={item.id === selectedId}
                className={`rounded-xl border p-4 text-left ${item.id === selectedId ? "border-[#006CB8] bg-blue-50" : "border-slate-200 bg-white"}`}
              >
                <span className="block text-xs font-semibold text-[#006CB8]">
                  {item.learningModuleName}
                </span>
                <span className="mt-2 block font-semibold text-slate-900">
                  {item.title}
                </span>
                <span className="mt-2 block text-xs text-slate-500">
                  {item.durationMinutes} min · {item.questionCount} questions
                </span>
              </button>
            ))}
          </div>
        </GlassCard>
      )}
      {selected && (
        <>
          <div className="grid gap-4 md:grid-cols-3">
            <AssessmentInfo
              label="Duration"
              value={`${selected.durationMinutes} Minutes`}
            />
            <AssessmentInfo
              label="Passing Score"
              value={`${selected.passingScore}%`}
            />
            <AssessmentInfo
              label="Maximum Attempts"
              value={`${selected.maxAttempts} Attempts`}
            />
          </div>
          <GlassCard className="p-6">
            <h2 className="text-lg font-bold text-slate-900">
              Before You Start
            </h2>
            {selected.description && (
              <p className="mt-3 text-sm leading-6 text-slate-600">
                {selected.description}
              </p>
            )}
            <div className="mt-5 space-y-4">
              <Instruction
                number="1"
                title="Complete all questions"
                description="Answer every question before submitting your assessment."
              />
              <Instruction
                number="2"
                title="Your answers are saved automatically"
                description="Each selected answer will be saved while you complete the assessment."
              />
              <Instruction
                number="3"
                title="Complete within the time limit"
                description={`This assessment has a ${selected.durationMinutes}-minute time limit.`}
              />
              <Instruction
                number="4"
                title="Your score will remain hidden"
                description="Your theory score will be combined with your simulator performance and shown after the simulation is completed."
              />
            </div>
          </GlassCard>
          {selected.questionCount === 0 && (
            <Alert>
              This assessment has no questions yet. Please contact your
              administrator.
            </Alert>
          )}
          <div className="flex justify-end">
            <Button
              fullWidth={false}
              onClick={handleStartAssessment}
              isLoading={isStarting}
              disabled={isStarting || selected.questionCount === 0}
            >
              Start Assessment
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
function AssessmentInfo({ label, value }: { label: string; value: string }) {
  return (
    <GlassCard className="p-5">
      <p className="text-sm text-slate-500">{label}</p>
      <p className="mt-1 text-xl font-bold text-slate-900">{value}</p>
    </GlassCard>
  );
}
function Instruction({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) {
  return (
    <div className="flex gap-4">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-50 text-sm font-bold text-[#006CB8]">
        {number}
      </div>
      <div>
        <p className="font-semibold text-slate-900">{title}</p>
        <p className="mt-1 text-sm leading-6 text-slate-500">{description}</p>
      </div>
    </div>
  );
}
