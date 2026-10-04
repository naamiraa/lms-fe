import LearningContentView from "@/features/learning/participant/LearningContentView";

interface LearningContentPageProps {
  params: Promise<{
    moduleId: string;
    contentId: string;
  }>;
}

export default async function LearningContentPage({
  params,
}: LearningContentPageProps) {
  const { moduleId, contentId } = await params;

  return (
    <LearningContentView
      moduleId={moduleId}
      contentId={contentId}
    />
  );
}