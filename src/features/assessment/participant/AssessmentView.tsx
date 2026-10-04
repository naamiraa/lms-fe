"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { startAssessment } from "@/services/assessment.service";

const DEFENSIVE_DRIVING_ASSESSMENT_ID =
  "20fd8851-d0a3-4175-94e7-d2c383fb1875";

export default function AssessmentView() {
  const router = useRouter();

  const [isStarting, setIsStarting] = useState(false);
  const [error, setError] = useState("");

  async function handleStartAssessment() {
    try {
      setIsStarting(true);
      setError("");

      const attempt = await startAssessment(
        DEFENSIVE_DRIVING_ASSESSMENT_ID
      );

      sessionStorage.setItem(
        `assessment_attempt_${attempt.attemptId}`,
        JSON.stringify(attempt)
      );

      router.push(
        `/assessment/attempts/${attempt.attemptId}`
      );
    } catch (err) {
      console.error(err);

      setError(
        err instanceof Error
          ? err.message
          : "Failed to start assessment."
      );
    } finally {
      setIsStarting(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold text-[#006CB8]">
          Theory Assessment
        </p>

        <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">
          Defensive Driving — Post-Test
        </h1>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
          Complete the theory assessment before continuing to your
          simulator training session.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <AssessmentInfo
          label="Duration"
          value="20 Minutes"
        />

        <AssessmentInfo
          label="Passing Score"
          value="80%"
        />

        <AssessmentInfo
          label="Maximum Attempts"
          value="3 Attempts"
        />
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-bold text-slate-900">
          Before You Start
        </h2>

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
            description="The assessment has a 20-minute time limit."
          />

          <Instruction
            number="4"
            title="Your score will remain hidden"
            description="Your theory score will be combined with your simulator performance and shown after the simulation is completed."
          />
        </div>
      </div>

      {error && (
        <div className="rounded-xl border border-red-100 bg-red-50 p-4">
          <p className="text-sm font-medium text-red-700">
            {error}
          </p>
        </div>
      )}

      <div className="flex justify-end">
        <button
          type="button"
          onClick={handleStartAssessment}
          disabled={isStarting}
          className="rounded-xl bg-[#006CB8] px-6 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isStarting
            ? "Starting Assessment..."
            : "Start Assessment"}
        </button>
      </div>
    </div>
  );
}

function AssessmentInfo({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-sm text-slate-500">{label}</p>

      <p className="mt-1 text-xl font-bold text-slate-900">
        {value}
      </p>
    </div>
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
        <p className="font-semibold text-slate-900">
          {title}
        </p>

        <p className="mt-1 text-sm leading-6 text-slate-500">
          {description}
        </p>
      </div>
    </div>
  );
}