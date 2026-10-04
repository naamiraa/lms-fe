import LearningModuleView from "@/features/learning/participant/LearningModuleView";

interface LearningModulePageProps {
  params: Promise<{
    moduleId: string;
  }>;
}

export default async function LearningModulePage({
  params,
}: LearningModulePageProps) {
  const { moduleId } = await params;

  return <LearningModuleView moduleId={moduleId} />;
}