import AssessmentAttemptView from "@/features/assessment/participant/AssessmentAttemptView";

interface AssessmentAttemptPageProps {
  params: Promise<{
    attemptId: string;
  }>;
}

export default async function AssessmentAttemptPage({
  params,
}: AssessmentAttemptPageProps) {
  const { attemptId } = await params;

  return (
    <AssessmentAttemptView
      attemptId={attemptId}
    />
  );
}