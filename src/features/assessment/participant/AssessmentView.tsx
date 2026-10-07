"use client";
import Button from "@/components/ui/Button";

import Alert from "@/components/shared/Alert";

import GlassCard from "@/components/shared/GlassCard";

import PageHeader from "@/components/shared/PageHeader";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { startAssessment } from "@/services/assessment.service";

const DEFENSIVE_DRIVING_ASSESSMENT_ID = "20fd8851-d0a3-4175-94e7-d2c383fb1875";

export default function AssessmentView() {
  const router = useRouter();

  const [isStarting, setIsStarting] = useState(false);
  const [error, setError] = useState("");

  async function handleStartAssessment() {
    try {
      setIsStarting(true);
      setError("");

      const attempt = await startAssessment(DEFENSIVE_DRIVING_ASSESSMENT_ID);

      sessionStorage.setItem(
        `assessment_attempt_${attempt.attemptId}`,
        JSON.stringify(attempt),
      );

      router.push(`/assessment/attempts/${attempt.attemptId}`);
    } catch (err) {
      console.error(err);

      setError(
        err instanceof Error ? err.message : "Failed to start assessment.",
      );
    } finally {
      setIsStarting(false);
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={<> Defensive Driving — Post-Test </>}
        description={
          <>
            {" "}
            Complete the theory assessment before continuing to your simulator
            training session.{" "}
          </>
        }
        eyebrow={<> Theory Assessment </>}
      />

      <div className="grid gap-4 md:grid-cols-3">
        <AssessmentInfo label="Duration" value="20 Minutes" />

        <AssessmentInfo label="Passing Score" value="80%" />

        <AssessmentInfo label="Maximum Attempts" value="3 Attempts" />
      </div>

      <GlassCard className="p-6">
        <h2 className="text-lg font-bold text-slate-900">Before You Start</h2>

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
      </GlassCard>

      {error && <Alert>{error}</Alert>}

      <div className="flex justify-end">
        <Button
          fullWidth={false}
          type="button"
          onClick={handleStartAssessment}
          disabled={isStarting}
          className="rounded-xl bg-[#006CB8] px-6 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isStarting ? "Starting Assessment..." : "Start Assessment"}
        </Button>
      </div>
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
