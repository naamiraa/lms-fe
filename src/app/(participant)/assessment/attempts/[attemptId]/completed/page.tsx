import Link from "next/link";

interface AssessmentCompletedPageProps {
  params: Promise<{
    attemptId: string;
  }>;
}

export default async function AssessmentCompletedPage({
  params,
}: AssessmentCompletedPageProps) {
  const { attemptId } = await params;

  return (
    <div className="mx-auto max-w-2xl">
      <div className="rounded-2xl border border-emerald-100 bg-white p-8 text-center shadow-sm">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-2xl text-emerald-600">
          ✓
        </div>

        <p className="mt-5 text-sm font-semibold text-emerald-600">
          Assessment Submitted
        </p>

        <h1 className="mt-2 text-2xl font-bold text-slate-900">
          Theory Assessment Completed
        </h1>

        <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-slate-500">
          Your answers have been submitted successfully.
          Your theory assessment result will be shown
          together with your simulator performance after
          the simulation is completed.
        </p>

        <div className="mt-6 rounded-xl bg-blue-50 p-4 text-left">
          <p className="font-semibold text-[#006CB8]">
            Next Step: Simulator Training
          </p>

          <p className="mt-1 text-sm leading-6 text-slate-600">
            Continue to Simulation to select your
            operational domain and training scenario.
          </p>
        </div>

        <Link
          href={`/simulation?assessmentAttemptId=${encodeURIComponent(
            attemptId
          )}`}
          className="mt-6 inline-flex rounded-xl bg-[#006CB8] px-6 py-3 text-sm font-semibold text-white transition hover:opacity-90"
        >
          Continue to Simulation →
        </Link>
      </div>
    </div>
  );
}