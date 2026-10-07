"use client";
import Button from "@/components/ui/Button";

import Alert from "@/components/shared/Alert";

import LoadingState from "@/components/shared/LoadingState";

import GlassCard from "@/components/shared/GlassCard";

import PageHeader from "@/components/shared/PageHeader";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  getAssessmentAttempt,
  saveAssessmentAnswer,
  submitAssessment,
} from "@/services/assessment.service";
import type { AssessmentAttempt } from "@/types/assessment";

interface AssessmentAttemptViewProps {
  attemptId: string;
}

export default function AssessmentAttemptView({
  attemptId,
}: AssessmentAttemptViewProps) {
  const router = useRouter();

  const [attempt, setAttempt] = useState<AssessmentAttempt | null>(null);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const [answers, setAnswers] = useState<Record<string, string>>({});

  const [savingQuestionId, setSavingQuestionId] = useState<string | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [error, setError] = useState("");

  useEffect(() => {
    async function loadAttempt() {
      try {
        setError("");

        const data = await getAssessmentAttempt(attemptId);

        setAttempt(data);

        const savedAnswers: Record<string, string> = {};

        data.questions.forEach((question) => {
          if (question.selectedOptionId) {
            savedAnswers[question.id] = question.selectedOptionId;
          }
        });

        setAnswers(savedAnswers);
      } catch (err) {
        console.error(err);

        setError(
          err instanceof Error ? err.message : "Failed to load assessment.",
        );
      }
    }

    loadAttempt();
  }, [attemptId]);

  const sortedQuestions = useMemo(() => {
    if (!attempt) {
      return [];
    }

    return [...attempt.questions].sort((a, b) => a.order - b.order);
  }, [attempt]);

  const currentQuestion = sortedQuestions[currentQuestionIndex];

  const answeredCount = Object.keys(answers).length;

  async function handleSelectAnswer(questionId: string, optionId: string) {
    const previousAnswer = answers[questionId];

    setAnswers((current) => ({
      ...current,
      [questionId]: optionId,
    }));

    try {
      setSavingQuestionId(questionId);
      setError("");

      await saveAssessmentAnswer(attemptId, questionId, optionId);
    } catch (err) {
      console.error(err);

      setAnswers((current) => {
        const updated = { ...current };

        if (previousAnswer) {
          updated[questionId] = previousAnswer;
        } else {
          delete updated[questionId];
        }

        return updated;
      });

      setError(err instanceof Error ? err.message : "Failed to save answer.");
    } finally {
      setSavingQuestionId(null);
    }
  }

  async function handleSubmit() {
    if (!attempt) {
      return;
    }

    if (answeredCount < sortedQuestions.length) {
      setError("Please answer all questions before submitting the assessment.");
      return;
    }

    try {
      setIsSubmitting(true);
      setError("");

      await submitAssessment(attemptId);
      router.push(`/assessment/attempts/${attemptId}/completed`);

      //   sessionStorage.removeItem(
      //     `assessment_attempt_${attemptId}`
      //   );

      router.replace(`/assessment/attempts/${attemptId}/completed`);
    } catch (err) {
      console.error(err);

      setError(
        err instanceof Error ? err.message : "Failed to submit assessment.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  if (!attempt && !error) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <LoadingState label="Loading assessment..." />
      </div>
    );
  }

  if (!attempt) {
    return <Alert>{error}</Alert>;
  }

  if (!currentQuestion) {
    return (
      <GlassCard className="p-6">
        <p className="font-semibold text-slate-900">
          No assessment questions available.
        </p>
      </GlassCard>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <PageHeader
          title={<> {attempt.assessmentTitle} </>}
          description={
            <>
              {" "}
              Attempt {attempt.attemptNumber} of {attempt.maxAttempts}{" "}
            </>
          }
          eyebrow={<> Theory Assessment </>}
        />

        <AssessmentTimer expiresAt={attempt.expiresAt} />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_260px]">
        <GlassCard className="p-6">
          <div className="flex items-center justify-between gap-4">
            <p className="text-sm font-semibold text-[#006CB8]">
              Question {currentQuestionIndex + 1} of {sortedQuestions.length}
            </p>

            <p className="text-xs text-slate-400">
              {savingQuestionId === currentQuestion.id
                ? "Saving..."
                : answers[currentQuestion.id]
                  ? "Answer saved"
                  : "Not answered"}
            </p>
          </div>

          {currentQuestion.mediaUrl && (
            <div className="mt-6 overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
              <img
                src={currentQuestion.mediaUrl}
                alt="Question media"
                className="max-h-[320px] w-full object-contain"
              />
            </div>
          )}

          <h2 className="mt-6 text-xl font-bold leading-8 text-slate-900">
            {currentQuestion.questionText}
          </h2>

          <div className="mt-6 space-y-3">
            {[...currentQuestion.options]
              .sort((a, b) => a.order - b.order)
              .map((option, index) => {
                const selected = answers[currentQuestion.id] === option.id;

                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() =>
                      handleSelectAnswer(currentQuestion.id, option.id)
                    }
                    disabled={savingQuestionId === currentQuestion.id}
                    className={`flex w-full items-center gap-4 rounded-xl border p-4 text-left transition ${
                      selected
                        ? "border-[#006CB8] bg-blue-50"
                        : "border-slate-200 bg-white hover:border-blue-200 hover:bg-slate-50"
                    }`}
                  >
                    <span
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                        selected
                          ? "bg-[#006CB8] text-white"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {String.fromCharCode(65 + index)}
                    </span>

                    <span className="text-sm font-medium text-slate-700">
                      {option.optionText}
                    </span>
                  </button>
                );
              })}
          </div>

          <div className="mt-8 flex items-center justify-between">
            <button
              type="button"
              disabled={currentQuestionIndex === 0}
              onClick={() => setCurrentQuestionIndex((current) => current - 1)}
              className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 disabled:cursor-not-allowed disabled:opacity-40"
            >
              ← Previous
            </button>

            {currentQuestionIndex < sortedQuestions.length - 1 ? (
              <Button
                fullWidth={false}
                type="button"
                onClick={() =>
                  setCurrentQuestionIndex((current) => current + 1)
                }
                className="rounded-xl bg-[#006CB8] px-5 py-2.5 text-sm font-semibold text-white"
              >
                Next →
              </Button>
            ) : (
              <Button
                fullWidth={false}
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="rounded-xl bg-[#006CB8] px-5 py-2.5 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? "Submitting..." : "Submit Assessment"}
              </Button>
            )}
          </div>
        </GlassCard>

        <div className="space-y-4">
          <GlassCard className="p-5">
            <h2 className="font-bold text-slate-900">Questions</h2>

            <p className="mt-1 text-sm text-slate-500">
              {answeredCount} of {sortedQuestions.length} answered
            </p>

            <div className="mt-4 grid grid-cols-5 gap-2">
              {sortedQuestions.map((question, index) => {
                const answered = Boolean(answers[question.id]);

                const active = index === currentQuestionIndex;

                return (
                  <button
                    key={question.id}
                    type="button"
                    onClick={() => setCurrentQuestionIndex(index)}
                    className={`flex h-10 items-center justify-center rounded-lg text-sm font-bold transition ${
                      active
                        ? "bg-[#006CB8] text-white"
                        : answered
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {index + 1}
                  </button>
                );
              })}
            </div>
          </GlassCard>

          <div className="rounded-2xl border border-blue-100 bg-blue-50 p-5">
            <p className="text-sm font-semibold text-[#006CB8]">
              Auto-save enabled
            </p>

            <p className="mt-1 text-xs leading-5 text-slate-600">
              Your answer is saved automatically every time you select an
              option.
            </p>
          </div>
        </div>
      </div>

      {error && <Alert>{error}</Alert>}
    </div>
  );
}

function AssessmentTimer({ expiresAt }: { expiresAt: string }) {
  const [remainingSeconds, setRemainingSeconds] = useState(0);

  useEffect(() => {
    function updateTimer() {
      const remaining = new Date(expiresAt).getTime() - Date.now();

      setRemainingSeconds(Math.max(0, Math.floor(remaining / 1000)));
    }

    updateTimer();

    const interval = window.setInterval(updateTimer, 1000);

    return () => window.clearInterval(interval);
  }, [expiresAt]);

  const minutes = Math.floor(remainingSeconds / 60);

  const seconds = remainingSeconds % 60;

  return (
    <div className="rounded-xl border border-slate-200 bg-white px-5 py-3 shadow-sm">
      <p className="text-xs font-medium text-slate-500">Time Left</p>

      <p className="mt-1 font-mono text-lg font-bold text-slate-900">
        {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
      </p>
    </div>
  );
}
