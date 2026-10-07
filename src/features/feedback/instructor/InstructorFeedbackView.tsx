"use client";
import Button from "@/components/ui/Button";

import Alert from "@/components/shared/Alert";

import LoadingState from "@/components/shared/LoadingState";

import GlassCard from "@/components/shared/GlassCard";

import { FormEvent, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

import {
  createInstructorFeedback,
  getInstructorFeedback,
} from "@/services/feedback.service";
import { getPerformanceEvaluation } from "@/services/performance.service";

import type { PerformanceEvaluation } from "@/types/performance";
import type { InstructorFeedback } from "@/types/feedback";

type RecommendationInput = {
  description: string;
  priority: number;
};

export default function InstructorFeedbackView() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("sessionId");

  const [performance, setPerformance] = useState<PerformanceEvaluation | null>(
    null,
  );

  const [existingFeedback, setExistingFeedback] =
    useState<InstructorFeedback | null>(null);

  const [overallComments, setOverallComments] = useState("");
  const [strengths, setStrengths] = useState("");
  const [improvementAreas, setImprovementAreas] = useState("");

  const [recommendations, setRecommendations] = useState<RecommendationInput[]>(
    [{ description: "", priority: 1 }],
  );

  const [violationExplanations, setViolationExplanations] = useState<
    Record<string, string>
  >({});

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (!sessionId) {
      setError(
        "Select a training session from the Instructor Dashboard first.",
      );
      setLoading(false);
      return;
    }

    async function load() {
      try {
        setLoading(true);
        setError("");

        const performanceData = await getPerformanceEvaluation(sessionId!);

        setPerformance(performanceData);

        try {
          const feedbackData = await getInstructorFeedback(sessionId!);

          setExistingFeedback(feedbackData);
        } catch {
          // Feedback may not exist yet.
        }
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to load training session.",
        );
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [sessionId]);

  function addRecommendation() {
    setRecommendations((current) => [
      ...current,
      {
        description: "",
        priority: current.length + 1,
      },
    ]);
  }

  function updateRecommendation(index: number, description: string) {
    setRecommendations((current) =>
      current.map((item, currentIndex) =>
        currentIndex === index ? { ...item, description } : item,
      ),
    );
  }

  function removeRecommendation(index: number) {
    setRecommendations((current) =>
      current
        .filter((_, currentIndex) => currentIndex !== index)
        .map((item, currentIndex) => ({
          ...item,
          priority: currentIndex + 1,
        })),
    );
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    if (!sessionId || !performance) {
      return;
    }

    if (!overallComments.trim()) {
      setError("Overall comments are required.");
      return;
    }

    try {
      setSubmitting(true);
      setError("");
      setSuccess("");

      const result = await createInstructorFeedback({
        simulationSessionId: sessionId,
        overallComments: overallComments.trim(),

        strengths: splitLines(strengths),

        improvementAreas: splitLines(improvementAreas),

        safetyRecommendations: recommendations
          .filter((item) => item.description.trim())
          .map((item, index) => ({
            description: item.description.trim(),
            priority: index + 1,
          })),

        violationExplanations: performance.events
          .filter((item) => violationExplanations[item.eventId]?.trim())
          .map((item) => ({
            simulationEventId: item.eventId,
            explanation: violationExplanations[item.eventId].trim(),
          })),

        recommendedModules: [],
      });

      setExistingFeedback(result);
      setSuccess("Instructor feedback submitted successfully.");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to submit instructor feedback.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return <LoadingState label="Loading training session..." />;
  }

  if (error && !performance) {
    return <Alert>{error}</Alert>;
  }

  if (!performance) {
    return null;
  }

  return (
    <div className="space-y-8">
      <header>
        <p className="text-sm font-semibold text-[#006CB8]">
          Participant Evaluation
        </p>

        <h1 className="mt-1 text-2xl font-bold text-slate-900">
          Instructor Feedback
        </h1>

        <p className="mt-2 text-sm text-slate-500">
          Review participant performance and provide structured training
          feedback.
        </p>
      </header>

      <GlassCard as="section" className="p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              {performance.scenarioName}
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {performance.domainName}
            </p>
          </div>

          <span
            className={`rounded-full px-3 py-1 text-sm font-bold ${
              performance.result === "PASS"
                ? "bg-emerald-100 text-emerald-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {performance.result}
          </span>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <Score label="Theory" value={performance.theoryScore} />
          <Score label="Simulator" value={performance.simulatorScore} />
          <Score label="Overall" value={performance.overallScore} />
          <Score label="Violations" value={performance.totalViolations} />
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          <SmallScore
            label="Safety"
            value={performance.breakdown.safetyScore}
          />

          <SmallScore
            label="Vehicle Control"
            value={performance.breakdown.vehicleControlScore}
          />

          <SmallScore
            label="Emergency Response"
            value={performance.breakdown.emergencyResponseScore}
          />
        </div>
      </GlassCard>

      {existingFeedback ? (
        <section className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6">
          <p className="text-sm font-semibold text-emerald-700">
            Evaluation completed
          </p>

          <h2 className="mt-1 text-lg font-bold text-slate-900">
            Feedback has already been submitted
          </h2>

          <p className="mt-3 text-sm leading-6 text-slate-700">
            {existingFeedback.overallComments}
          </p>

          <p className="mt-4 text-xs text-slate-500">
            Evaluated by {existingFeedback.instructorName}
          </p>
        </section>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <GlassCard as="section" className="p-6">
            <h2 className="text-lg font-bold text-slate-900">
              Overall Evaluation
            </h2>

            <textarea
              value={overallComments}
              onChange={(event) => setOverallComments(event.target.value)}
              rows={5}
              placeholder="Write an overall evaluation of the participant's simulator performance..."
              className="mt-4 w-full rounded-xl border border-slate-200 p-4 text-sm outline-none focus:border-[#006CB8]"
            />
          </GlassCard>

          <div className="grid gap-6 lg:grid-cols-2">
            <TextListInput
              title="Strengths"
              description="Write one strength per line."
              value={strengths}
              onChange={setStrengths}
              placeholder={
                "Maintained good vehicle control\nDemonstrated strong safety awareness"
              }
            />

            <TextListInput
              title="Areas for Improvement"
              description="Write one improvement area per line."
              value={improvementAreas}
              onChange={setImprovementAreas}
              placeholder={
                "Improve speed management\nAnticipate braking situations earlier"
              }
            />
          </div>

          <GlassCard as="section" className="p-6">
            <h2 className="text-lg font-bold text-slate-900">
              Violation Review
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Explain simulator violations where additional coaching is needed.
            </p>

            <div className="mt-5 space-y-4">
              {performance.events.length === 0 ? (
                <p className="text-sm text-slate-500">
                  No simulator violations recorded.
                </p>
              ) : (
                performance.events.map((item) => (
                  <div
                    key={item.eventId}
                    className="rounded-xl border border-slate-200 p-4"
                  >
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-bold text-slate-900">
                        {formatEventType(item.eventType)}
                      </p>

                      {item.severity && (
                        <span className="rounded-full bg-amber-100 px-2 py-1 text-xs font-semibold text-amber-700">
                          {item.severity}
                        </span>
                      )}
                    </div>

                    {item.description && (
                      <p className="mt-2 text-sm text-slate-500">
                        {item.description}
                      </p>
                    )}

                    <textarea
                      value={violationExplanations[item.eventId] ?? ""}
                      onChange={(event) =>
                        setViolationExplanations((current) => ({
                          ...current,
                          [item.eventId]: event.target.value,
                        }))
                      }
                      rows={3}
                      placeholder="Instructor explanation or coaching note..."
                      className="mt-4 w-full rounded-xl border border-slate-200 p-3 text-sm outline-none focus:border-[#006CB8]"
                    />
                  </div>
                ))
              )}
            </div>
          </GlassCard>

          <GlassCard as="section" className="p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Safety Recommendations
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Add recommendations in priority order.
                </p>
              </div>

              <button
                type="button"
                onClick={addRecommendation}
                className="rounded-xl border border-[#006CB8] px-4 py-2 text-sm font-semibold text-[#006CB8]"
              >
                + Add
              </button>
            </div>

            <div className="mt-5 space-y-3">
              {recommendations.map((item, index) => (
                <div key={index} className="flex gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-sm font-bold text-[#006CB8]">
                    {index + 1}
                  </div>

                  <input
                    value={item.description}
                    onChange={(event) =>
                      updateRecommendation(index, event.target.value)
                    }
                    placeholder="Safety recommendation..."
                    className="min-w-0 flex-1 rounded-xl border border-slate-200 px-4 text-sm outline-none focus:border-[#006CB8]"
                  />

                  {recommendations.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeRecommendation(index)}
                      className="px-2 text-sm font-semibold text-red-500"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
            </div>
          </GlassCard>

          {error && <Alert>{error}</Alert>}

          {success && (
            <div className="rounded-xl bg-emerald-50 p-4 text-sm text-emerald-700">
              {success}
            </div>
          )}

          <div className="flex justify-end">
            <Button
              fullWidth={false}
              type="submit"
              disabled={submitting}
              className="rounded-xl bg-[#006CB8] px-6 py-3 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              {submitting ? "Submitting..." : "Submit Feedback"}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}

function TextListInput({
  title,
  description,
  value,
  onChange,
  placeholder,
}: {
  title: string;
  description: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}) {
  return (
    <GlassCard as="section" className="p-6">
      <h2 className="text-lg font-bold text-slate-900">{title}</h2>

      <p className="mt-1 text-sm text-slate-500">{description}</p>

      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        rows={5}
        placeholder={placeholder}
        className="mt-4 w-full rounded-xl border border-slate-200 p-4 text-sm outline-none focus:border-[#006CB8]"
      />
    </GlassCard>
  );
}

function Score({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl bg-slate-50 p-4">
      <p className="text-xs font-semibold uppercase text-slate-400">{label}</p>

      <p className="mt-1 text-2xl font-bold text-slate-900">
        {formatScore(value)}
      </p>
    </div>
  );
}

function SmallScore({ label, value }: { label: string; value: number | null }) {
  return (
    <div className="rounded-xl border border-slate-100 p-4">
      <p className="text-xs font-semibold text-slate-500">{label}</p>

      <p className="mt-1 text-lg font-bold text-slate-900">
        {value == null ? "—" : formatScore(value)}
      </p>
    </div>
  );
}

function splitLines(value: string) {
  return value
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);
}

function formatScore(value: number) {
  return Number.isInteger(value)
    ? value.toString()
    : value.toFixed(2).replace(/0+$/, "").replace(/\.$/, "");
}

function formatEventType(value: string) {
  return value
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}
