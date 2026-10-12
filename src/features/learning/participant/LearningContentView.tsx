import LearningPlayerView from "./LearningPlayerView";
export default function LearningContentView({
  moduleId,
  contentId,
}: {
  moduleId: string;
  contentId: string;
}) {
  return (
    <LearningPlayerView moduleId={moduleId} initialContentId={contentId} />
  );
}
