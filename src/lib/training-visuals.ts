export const trainingImages = {
  background: "/images/simulator/fleet-background.png",
  ground: "/images/simulator/ground-operations.png",
  maritime: "/images/simulator/maritime-operations.png",
  heavy: "/images/simulator/heavy-equipment.png",
};
export function getTrainingImage(name: string) {
  if (/maritime|marine|ship|kapal|laut|pelayaran/i.test(name))
    return trainingImages.maritime;
  if (/heavy|equipment|excavator|alat berat/i.test(name))
    return trainingImages.heavy;
  return trainingImages.ground;
}
