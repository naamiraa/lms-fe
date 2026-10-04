export interface SafetyRecommendation {
  description: string;
  priority: number;
}

export interface ViolationExplanation {
  simulationEventId: string;
  eventType: string;
  severity: string | null;
  explanation: string;
}

export interface RecommendedModule {
  learningModuleId: string;
  learningModuleName: string;
  recommendationType: string | null;
  order: number;
}

export interface InstructorFeedback {
  id: string;
  simulationSessionId: string;
  instructorId: string;
  instructorName: string;
  scenarioName: string;
  overallComments: string;
  evaluatedAt: string;
  strengths: string[];
  improvementAreas: string[];
  safetyRecommendations: SafetyRecommendation[];
  violationExplanations: ViolationExplanation[];
  recommendedModules: RecommendedModule[];
}