"use client";
import AdminWorkflow from "@/components/shared/AdminWorkflow";
import AdminPhotoBanner from "@/components/shared/AdminPhotoBanner";
import AdminSelectionImage from "@/components/shared/AdminSelectionImage";
import Button from "@/components/ui/Button";

import Alert from "@/components/shared/Alert";

import LoadingState from "@/components/shared/LoadingState";

import GlassCard from "@/components/shared/GlassCard";

import PageHeader from "@/components/shared/PageHeader";

import SummaryCard from "@/components/shared/MetricCard";

import { useEffect, useMemo, useRef, useState } from "react";

import {
  createAssessment,
  createAssessmentQuestion,
  deactivateAssessment,
  deactivateAssessmentQuestion,
  getAssessmentQuestions,
  getAssessments,
  updateAssessment,
  updateAssessmentQuestion,
} from "@/services/admin-assessment.service";

import {
  getLearningModulesByDomain,
  getTrainingDomains,
} from "@/services/admin-learning.service";

import ConfirmModal from "@/components/ConfirmModal";

import type {
  Assessment,
  AssessmentQuestion,
  AssessmentRequest,
  UpdateAssessmentQuestionRequest,
} from "@/types/admin-assessment";

import type { LearningModule } from "@/types/admin-learning";

import AssessmentFormModal from "./AssessmentFormModal";
import QuestionFormModal from "./QuestionFormModal";

export default function AdminAssessmentsView() {
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [learningModules, setLearningModules] = useState<LearningModule[]>([]);

  const [selectedAssessmentId, setSelectedAssessmentId] = useState<
    string | null
  >(null);

  const [questions, setQuestions] = useState<AssessmentQuestion[]>([]);
  const questionRequest = useRef(0);

  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [questionsLoading, setQuestionsLoading] = useState(false);
  const [error, setError] = useState("");

  const [showAssessmentModal, setShowAssessmentModal] = useState(false);
  const [editingAssessment, setEditingAssessment] = useState<Assessment | null>(
    null,
  );

  const [showQuestionModal, setShowQuestionModal] = useState(false);
  const [editingQuestion, setEditingQuestion] =
    useState<AssessmentQuestion | null>(null);

  const [confirmAction, setConfirmAction] = useState<{
    type: "ASSESSMENT" | "QUESTION";
    id: string;
    name: string;
  } | null>(null);

  const [deactivating, setDeactivating] = useState(false);

  async function loadLearningModules() {
    const domains = await getTrainingDomains();

    const moduleGroups = await Promise.all(
      domains
        .filter((domain) => domain.isActive)
        .map((domain) => getLearningModulesByDomain(domain.id)),
    );

    const modules = moduleGroups
      .flat()
      .filter((module) => module.isActive)
      .sort((a, b) => {
        const domainCompare = a.trainingDomainName.localeCompare(
          b.trainingDomainName,
        );

        if (domainCompare !== 0) {
          return domainCompare;
        }

        return a.order - b.order;
      });

    setLearningModules(modules);
  }

  async function loadAssessments() {
    const data = await getAssessments();

    setAssessments(data);

    setSelectedAssessmentId((current) => {
      if (current && data.some((item) => item.id === current)) {
        return current;
      }

      return data[0]?.id ?? null;
    });
  }

  async function loadQuestions(assessmentId: string) {
    const request = ++questionRequest.current;
    setQuestions([]);
    try {
      setQuestionsLoading(true);
      setError("");

      const data = await getAssessmentQuestions(assessmentId);

      if (request !== questionRequest.current) return;
      setQuestions([...data].sort((a, b) => a.order - b.order));
    } catch (err) {
      if (request !== questionRequest.current) return;
      setQuestions([]);

      setError(
        err instanceof Error
          ? err.message
          : "Failed to load assessment questions.",
      );
    } finally {
      if (request === questionRequest.current) setQuestionsLoading(false);
    }
  }

  async function loadData() {
    try {
      setLoading(true);
      setError("");

      await Promise.all([loadLearningModules(), loadAssessments()]);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to load assessment management.",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadData();
  }, []);

  useEffect(() => {
    if (!selectedAssessmentId) {
      setQuestions([]);
      return;
    }

    void loadQuestions(selectedAssessmentId);
  }, [selectedAssessmentId]);

  const filteredAssessments = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    if (!keyword) {
      return assessments;
    }

    return assessments.filter(
      (assessment) =>
        assessment.title.toLowerCase().includes(keyword) ||
        assessment.learningModuleName.toLowerCase().includes(keyword) ||
        assessment.type.toLowerCase().includes(keyword),
    );
  }, [assessments, search]);

  const selectedAssessment =
    assessments.find((assessment) => assessment.id === selectedAssessmentId) ??
    null;

  const activeCount = assessments.filter(
    (assessment) => assessment.isActive,
  ).length;

  const totalQuestions = assessments.reduce(
    (total, assessment) => total + assessment.questionCount,
    0,
  );

  async function handleSaveAssessment(data: AssessmentRequest) {
    if (editingAssessment) {
      await updateAssessment(editingAssessment.id, data);
    } else {
      await createAssessment(data);
    }

    setShowAssessmentModal(false);
    setEditingAssessment(null);

    await loadAssessments();
  }

  function handleDeactivateAssessment(assessment: Assessment) {
    setConfirmAction({
      type: "ASSESSMENT",
      id: assessment.id,
      name: assessment.title,
    });
  }

  async function handleSaveQuestion(data: UpdateAssessmentQuestionRequest) {
    if (!selectedAssessmentId) {
      throw new Error("No assessment selected.");
    }

    if (editingQuestion) {
      await updateAssessmentQuestion(editingQuestion.id, data);
    } else {
      await createAssessmentQuestion({
        assessmentId: selectedAssessmentId,
        ...data,
      });
    }

    setShowQuestionModal(false);
    setEditingQuestion(null);

    await Promise.all([loadQuestions(selectedAssessmentId), loadAssessments()]);
  }

  function handleDeactivateQuestion(question: AssessmentQuestion) {
    setConfirmAction({
      type: "QUESTION",
      id: question.id,
      name: question.questionText,
    });
  }

  async function handleConfirmDeactivate() {
    if (!confirmAction) return;

    try {
      setDeactivating(true);
      setError("");

      if (confirmAction.type === "ASSESSMENT") {
        await deactivateAssessment(confirmAction.id);

        setConfirmAction(null);

        await loadAssessments();
        return;
      }

      await deactivateAssessmentQuestion(confirmAction.id);

      setConfirmAction(null);

      if (selectedAssessmentId) {
        await Promise.all([
          loadQuestions(selectedAssessmentId),
          loadAssessments(),
        ]);
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to deactivate item.",
      );
    } finally {
      setDeactivating(false);
    }
  }

  if (loading) {
    return <LoadingState label="Loading assessment management..." />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
        <PageHeader
          title={<> Assessment Management </>}
          description={
            <>
              {" "}
              Choose a test, check its linked learning module, then manage its
              questions.{" "}
            </>
          }
        />

        <Button
          fullWidth={false}
          type="button"
          onClick={() => {
            setEditingAssessment(null);
            setShowAssessmentModal(true);
          }}
          disabled={learningModules.length === 0}
          className="rounded-xl bg-[#006CB8] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#005a9c] disabled:cursor-not-allowed disabled:opacity-50"
        >
          + Add Assessment
        </Button>
      </div>

      {error && <Alert>{error}</Alert>}

      {learningModules.length === 0 && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
          No active learning modules are available. Create a learning module
          before adding an assessment.
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-3">
        <SummaryCard label="Total Assessments" value={assessments.length} />

        <SummaryCard label="Active Assessments" value={activeCount} />

        <SummaryCard label="Total Questions" value={totalQuestions} />
      </div>

      <AdminWorkflow
        steps={[
          {
            title: "Choose an assessment",
            description: "Each test is linked to one learning module.",
            selection: selectedAssessment?.title,
          },
          {
            title: "Manage its questions",
            description:
              "Add questions and mark the correct answer. A test with zero questions is not ready for participants.",
          },
        ]}
      />
      <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]">
        <GlassCard as="section" className="">
          <div className="border-b border-slate-100 p-5">
            <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
              <div>
                <h2 className="font-semibold text-slate-900">
                  Choose an Assessment
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Select an assessment to manage its questions.
                </p>
              </div>

              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                aria-label="Search assessments"
                placeholder="Search test or module..."
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 sm:w-44"
              />
            </div>
          </div>

          <div className="divide-y divide-slate-100">
            {filteredAssessments.length === 0 ? (
              <div className="p-8 text-center text-sm text-slate-500">
                No assessments found.
              </div>
            ) : (
              filteredAssessments.map((assessment) => {
                const selected = selectedAssessmentId === assessment.id;

                return (
                  <button
                    key={assessment.id}
                    type="button"
                    onClick={() => setSelectedAssessmentId(assessment.id)}
                    aria-pressed={selected}
                    className={`w-full p-5 text-left transition ${
                      selected ? "bg-blue-50" : "hover:bg-slate-50"
                    }`}
                  >
                    <AdminSelectionImage
                      name={
                        learningModules.find(
                          (module) => module.id === assessment.learningModuleId,
                        )?.trainingDomainName || assessment.learningModuleName
                      }
                    />
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="font-semibold text-slate-900">
                            {assessment.title}
                          </h3>

                          <StatusBadge active={assessment.isActive} />
                        </div>

                        <p className="mt-1 text-sm text-slate-500">
                          Module: {assessment.learningModuleName}
                        </p>

                        <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-500">
                          <span className="rounded-lg bg-slate-100 px-2.5 py-1">
                            {assessment.type}
                          </span>

                          <span className="rounded-lg bg-slate-100 px-2.5 py-1">
                            {assessment.durationMinutes} min
                          </span>

                          <span className="rounded-lg bg-slate-100 px-2.5 py-1">
                            {assessment.questionCount} questions ·{" "}
                            {assessment.questionCount === 0
                              ? "Needs questions"
                              : "Questions added"}
                          </span>
                        </div>
                      </div>

                      <span className="shrink-0 text-xs font-bold text-[#006CB8]">
                        {selected ? "Open ✓" : "Open →"}
                      </span>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </GlassCard>

        <GlassCard as="section" className="">
          {!selectedAssessment ? (
            <div className="flex min-h-80 items-center justify-center p-8 text-center text-sm text-slate-500">
              Select an assessment to manage its questions.
            </div>
          ) : (
            <>
              <div className="p-4">
                <AdminPhotoBanner
                  name={
                    learningModules.find(
                      (module) =>
                        module.id === selectedAssessment.learningModuleId,
                    )?.trainingDomainName ||
                    selectedAssessment.learningModuleName
                  }
                  title={selectedAssessment.title}
                  description={`Linked learning module: ${selectedAssessment.learningModuleName}`}
                />
              </div>
              <div className="border-b border-slate-100 p-5">
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-[#006CB8]">
                      Test settings
                    </p>

                    <h2 className="mt-1 text-lg font-semibold text-slate-900">
                      {selectedAssessment.title}
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                      {selectedAssessment.learningModuleName}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingAssessment(selectedAssessment);

                        setShowAssessmentModal(true);
                      }}
                      className="rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                    >
                      Edit Assessment
                    </button>

                    {selectedAssessment.isActive && (
                      <button
                        type="button"
                        onClick={() =>
                          handleDeactivateAssessment(selectedAssessment)
                        }
                        className="rounded-xl border border-red-200 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
                      >
                        Deactivate
                      </button>
                    )}
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-2 text-xs text-slate-500">
                  <span className="rounded-lg bg-slate-100 px-2.5 py-1">
                    {selectedAssessment.type}
                  </span>

                  <span className="rounded-lg bg-slate-100 px-2.5 py-1">
                    {selectedAssessment.durationMinutes} min
                  </span>

                  <span className="rounded-lg bg-slate-100 px-2.5 py-1">
                    Pass: {selectedAssessment.passingScore}
                  </span>

                  <span className="rounded-lg bg-slate-100 px-2.5 py-1">
                    Max attempts: {selectedAssessment.maxAttempts}
                  </span>

                  <StatusBadge active={selectedAssessment.isActive} />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
                  <div>
                    <h3 className="font-semibold text-slate-900">Questions</h3>

                    <p className="mt-1 text-xs text-slate-500">
                      {questions.length} question
                      {questions.length === 1 ? "" : "s"}
                    </p>
                  </div>

                  <Button
                    fullWidth={false}
                    type="button"
                    onClick={() => {
                      setEditingQuestion(null);
                      setShowQuestionModal(true);
                    }}
                    disabled={!selectedAssessment.isActive}
                    className="rounded-xl bg-[#006CB8] px-3.5 py-2 text-sm font-medium text-white hover:bg-[#005a9c] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    + Add Question
                  </Button>
                </div>

                {questionsLoading ? (
                  <LoadingState label="Loading questions..." />
                ) : questions.length === 0 ? (
                  <div className="p-8 text-center">
                    <p className="text-sm font-medium text-slate-700">
                      No questions yet
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      This test cannot be started by participants yet. Click Add
                      Question to add its first question and correct answer.
                    </p>
                  </div>
                ) : (
                  <div className="divide-y divide-slate-100">
                    {questions.map((question) => (
                      <QuestionCard
                        key={question.id}
                        question={question}
                        onEdit={() => {
                          setEditingQuestion(question);
                          setShowQuestionModal(true);
                        }}
                        onDeactivate={() => handleDeactivateQuestion(question)}
                      />
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </GlassCard>
      </div>

      {showAssessmentModal && (
        <AssessmentFormModal
          assessment={editingAssessment}
          learningModules={learningModules}
          onClose={() => {
            setShowAssessmentModal(false);
            setEditingAssessment(null);
          }}
          onSubmit={handleSaveAssessment}
        />
      )}

      {showQuestionModal && selectedAssessment && (
        <QuestionFormModal
          question={editingQuestion}
          onClose={() => {
            setShowQuestionModal(false);
            setEditingQuestion(null);
          }}
          onSubmit={handleSaveQuestion}
        />
      )}

      <ConfirmModal
        open={confirmAction !== null}
        title={
          confirmAction?.type === "QUESTION"
            ? "Deactivate Question?"
            : "Deactivate Assessment?"
        }
        message={
          confirmAction
            ? `Are you sure you want to deactivate "${confirmAction.name}"? This item will no longer be available for active use.`
            : ""
        }
        confirmLabel="Deactivate"
        loading={deactivating}
        onCancel={() => {
          if (!deactivating) {
            setConfirmAction(null);
          }
        }}
        onConfirm={handleConfirmDeactivate}
      />
    </div>
  );
}

function QuestionCard({
  question,
  onEdit,
  onDeactivate,
}: {
  question: AssessmentQuestion;
  onEdit: () => void;
  onDeactivate: () => void;
}) {
  const sortedOptions = [...question.options].sort((a, b) => a.order - b.order);

  return (
    <div className="p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-xs font-semibold text-blue-700">
              {question.order}
            </span>

            <p className="font-medium text-slate-900">
              {question.questionText}
            </p>

            <StatusBadge active={question.isActive} />
          </div>

          {question.mediaUrl && (
            <p className="mt-2 break-all text-xs text-[#006CB8]">
              Media: {question.mediaUrl}
            </p>
          )}

          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            {sortedOptions.map((option, index) => (
              <div
                key={option.id || `${question.id}-${index}`}
                className={`flex items-start gap-2 rounded-xl border p-3 text-sm ${
                  option.isCorrect
                    ? "border-emerald-200 bg-emerald-50"
                    : "border-slate-200 bg-slate-50"
                }`}
              >
                <span
                  className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-xs font-semibold ${
                    option.isCorrect
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-white text-slate-500"
                  }`}
                >
                  {String.fromCharCode(65 + index)}
                </span>

                <div className="min-w-0">
                  <p
                    className={
                      option.isCorrect
                        ? "font-medium text-emerald-800"
                        : "text-slate-700"
                    }
                  >
                    {option.optionText}
                  </p>

                  {option.isCorrect && (
                    <p className="mt-1 text-xs font-medium text-emerald-600">
                      Correct answer
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex shrink-0 flex-col gap-2">
          <button
            type="button"
            onClick={onEdit}
            className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
          >
            Edit
          </button>

          {question.isActive && (
            <button
              type="button"
              onClick={onDeactivate}
              className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50"
            >
              Deactivate
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ active }: { active: boolean }) {
  return (
    <span
      className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
        active
          ? "bg-emerald-50 text-emerald-700"
          : "bg-slate-100 text-slate-500"
      }`}
    >
      {active ? "ACTIVE" : "INACTIVE"}
    </span>
  );
}
