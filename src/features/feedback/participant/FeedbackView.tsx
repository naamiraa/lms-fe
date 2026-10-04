"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

import { getInstructorFeedback } from "@/services/feedback.service";
import type { InstructorFeedback } from "@/types/feedback";

export default function FeedbackView() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("sessionId");

  const [feedback, setFeedback] =
    useState<InstructorFeedback | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadFeedback() {
      if (!sessionId) {
        setError(
          "Simulation session was not found. Please complete your simulator training first."
        );
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const data =
          await getInstructorFeedback(sessionId);

        setFeedback(data);
      } catch (err) {
        console.error(err);

        setError(
          err instanceof Error
            ? err.message
            : "Failed to load instructor feedback."
        );
      } finally {
        setLoading(false);
      }
    }

    loadFeedback();
  }, [sessionId]);

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <p className="text-sm text-slate-500">
          Loading instructor feedback...
        </p>
      </div>
    );
  }

  if (error || !feedback) {
    return (
      <div className="space-y-6">
        <div>
          <p className="text-sm font-semibold text-[#006CB8]">
            Training Feedback
          </p>

          <h1 className="mt-1 text-2xl font-bold text-slate-900">
            Instructor Feedback
          </h1>
        </div>

        <div className="rounded-2xl border border-amber-100 bg-amber-50 p-6">
          <h2 className="font-bold text-slate-900">
            Feedback Not Available
          </h2>

          <p className="mt-2 text-sm leading-6 text-slate-600">
            {error ||
              "Your instructor has not provided feedback for this training session yet."}
          </p>

          <Link
            href={
              sessionId
                ? `/performance?sessionId=${encodeURIComponent(
                    sessionId
                  )}`
                : "/performance"
            }
            className="mt-5 inline-flex rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-[#006CB8] shadow-sm"
          >
            ← Back to Performance
          </Link>
        </div>
      </div>
    );
  }

  const evaluatedDate = new Date(
    feedback.evaluatedAt
  ).toLocaleString();

  const sortedRecommendations = [
    ...feedback.safetyRecommendations,
  ].sort((a, b) => a.priority - b.priority);

  const sortedModules = [
    ...feedback.recommendedModules,
  ].sort((a, b) => a.order - b.order);

  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm font-semibold text-[#006CB8]">
          Training Feedback
        </p>

        <h1 className="mt-1 text-2xl font-bold text-slate-900">
          Instructor Feedback
        </h1>

        <p className="mt-2 text-sm text-slate-500">
          Review your instructor&apos;s evaluation and
          recommendations for your simulator training.
        </p>
      </div>

      <section className="rounded-2xl border border-blue-100 bg-blue-50 p-6">
        <p className="text-sm font-semibold text-[#006CB8]">
          {feedback.scenarioName}
        </p>

        <h2 className="mt-2 text-xl font-bold text-slate-900">
          Feedback from {feedback.instructorName}
        </h2>

        <p className="mt-1 text-xs text-slate-500">
          Evaluated {evaluatedDate}
        </p>

        <p className="mt-5 leading-7 text-slate-700">
          {feedback.overallComments}
        </p>
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        <FeedbackList
          title="Strengths"
          description="What you performed well during the training."
          items={feedback.strengths}
          emptyText="No strengths recorded."
        />

        <FeedbackList
          title="Areas for Improvement"
          description="Skills that should receive more attention."
          items={feedback.improvementAreas}
          emptyText="No improvement areas recorded."
        />
      </div>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-bold text-slate-900">
          Safety Recommendations
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Recommended actions to improve your driving
          safety.
        </p>

        {sortedRecommendations.length === 0 ? (
          <p className="mt-5 text-sm text-slate-500">
            No safety recommendations recorded.
          </p>
        ) : (
          <div className="mt-5 space-y-3">
            {sortedRecommendations.map(
              (recommendation, index) => (
                <div
                  key={`${recommendation.priority}-${index}`}
                  className="flex gap-4 rounded-xl bg-slate-50 p-4"
                >
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-[#006CB8]">
                    {recommendation.priority}
                  </div>

                  <p className="text-sm leading-6 text-slate-700">
                    {recommendation.description}
                  </p>
                </div>
              )
            )}
          </div>
        )}
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-bold text-slate-900">
          Violation Review
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Instructor explanations for events recorded
          during your simulation.
        </p>

        {feedback.violationExplanations.length === 0 ? (
          <p className="mt-5 text-sm text-slate-500">
            No violation explanations recorded.
          </p>
        ) : (
          <div className="mt-5 space-y-4">
            {feedback.violationExplanations.map(
              (violation) => (
                <div
                  key={violation.simulationEventId}
                  className="rounded-xl border border-slate-100 bg-slate-50 p-4"
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-bold text-slate-900">
                      {formatLabel(
                        violation.eventType
                      )}
                    </span>

                    {violation.severity && (
                      <span className="rounded-full bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-700">
                        {violation.severity}
                      </span>
                    )}
                  </div>

                  <p className="mt-3 text-sm leading-6 text-slate-600">
                    {violation.explanation}
                  </p>
                </div>
              )
            )}
          </div>
        )}
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-bold text-slate-900">
          Recommended Learning
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Learning modules recommended by your
          instructor.
        </p>

        {sortedModules.length === 0 ? (
          <p className="mt-5 text-sm text-slate-500">
            No additional learning modules recommended.
          </p>
        ) : (
          <div className="mt-5 grid gap-3 md:grid-cols-2">
            {sortedModules.map((module) => (
              <Link
                key={module.learningModuleId}
                href={`/learning/${module.learningModuleId}`}
                className="rounded-xl border border-slate-200 p-4 transition hover:border-blue-200 hover:bg-blue-50"
              >
                {module.recommendationType && (
                  <p className="text-xs font-semibold uppercase tracking-wide text-[#006CB8]">
                    {formatLabel(
                      module.recommendationType
                    )}
                  </p>
                )}

                <h3 className="mt-1 font-bold text-slate-900">
                  {module.learningModuleName}
                </h3>

                <p className="mt-3 text-sm font-semibold text-[#006CB8]">
                  Open Module →
                </p>
              </Link>
            ))}
          </div>
        )}
      </section>

      <div className="flex justify-end">
        <Link
          href={`/performance?sessionId=${encodeURIComponent(
            feedback.simulationSessionId
          )}`}
          className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
        >
          ← Back to Performance
        </Link>
      </div>
    </div>
  );
}

function FeedbackList({
  title,
  description,
  items,
  emptyText,
}: {
  title: string;
  description: string;
  items: string[];
  emptyText: string;
}) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-bold text-slate-900">
        {title}
      </h2>

      <p className="mt-1 text-sm text-slate-500">
        {description}
      </p>

      {items.length === 0 ? (
        <p className="mt-5 text-sm text-slate-500">
          {emptyText}
        </p>
      ) : (
        <div className="mt-5 space-y-3">
          {items.map((item, index) => (
            <div
              key={`${item}-${index}`}
              className="flex gap-3 rounded-xl bg-slate-50 p-4"
            >
              <span className="font-bold text-[#006CB8]">
                ✓
              </span>

              <p className="text-sm leading-6 text-slate-700">
                {item}
              </p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

function formatLabel(value: string) {
  return value
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (letter) =>
      letter.toUpperCase()
    );
}