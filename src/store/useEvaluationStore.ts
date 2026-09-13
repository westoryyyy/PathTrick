import { create } from 'zustand';

export type UserCourseProgress =
  | 'not_started'
  | 'in_progress'
  | 'quiz_failed'
  | 'project_failed'
  | 'completed';

export type ProjectStatus =
  | 'not_submitted'
  | 'submitted'
  | 'ai_review'
  | 'manual_review_queue'
  | 'failed'
  | 'passed';

export type OnChainStatus = 'not_started' | 'pending_onchain' | 'minted' | 'failed';

export type EvaluationRecord = {
  courseId: string; // e.g., house-1
  questId?: string; // e.g., html-4
  userCourseProgress: UserCourseProgress;
  quizScore: number | null; // 0-100
  quizPassingScore: number; // threshold e.g., 66
  projectStatus: ProjectStatus;
  onChainStatus: OnChainStatus;
  xpEarned: number;
  lastFeedback?: string | null;
};

interface EvaluationState {
  records: Record<string, EvaluationRecord>;

  // Actions
  initRecord: (courseId: string, questId?: string) => void;
  startMaterial: (courseId: string) => void;
  submitQuiz: (courseId: string, score: number) => Promise<void>;
  submitProject: (courseId: string, submission: { filename?: string; code?: string }) => Promise<void>;
  retryQuiz: (courseId: string) => void;
  resubmitProject: (courseId: string, submission: { filename?: string; code?: string }) => Promise<void>;
  // admin/manual actions
  markManualReviewCompleted: (courseId: string, passed: boolean, feedback?: string) => void;
}

// Mock AI evaluator: simulates network call to AI rubric engine.
const evaluateProjectMock = async (submission: { filename?: string; code?: string }) => {
  // Simulate variable latency and possible timeout/failure
  const latency = 1000 + Math.floor(Math.random() * 1200);
  await new Promise((res) => setTimeout(res, latency));

  // Simulate a 10% chance of AI failing to evaluate (timeout/error)
  const failChance = Math.random();
  if (failChance < 0.10) {
    throw new Error('AI evaluation timeout');
  }

  const code = submission.code ?? '';
  const hasClosedH1 = /<h1\b[^>]*>[\s\S]*?<\/h1>/i.test(code);
  const hasClosedParagraph = /<p\b[^>]*>[\s\S]*?<\/p>/i.test(code);
  const hasClosedUnorderedList = /<ul\b[^>]*>[\s\S]*?<\/ul>/i.test(code);
  const closedListItems = code.match(/<li\b[^>]*>[\s\S]*?<\/li>/gi)?.length ?? 0;

  let score = 0;
  if (hasClosedH1) score += 25;
  if (hasClosedParagraph) score += 25;
  if (hasClosedUnorderedList) score += 25;
  if (closedListItems >= 3) score += 25;

  if (score === 0 && code.trim().length > 0) {
    score = 20;
  }

  const passed = score >= 66;
  const feedback = passed
    ? 'Project passed: <h1>, <p>, <ul>, and at least 3 properly closed <li> items were found.'
    : 'Project needs revision: include a closed <h1>, a closed <p>, a closed <ul>, and at least 3 properly closed <li> skill items.';

  return { score, feedback, passed };
};

export const useEvaluationStore = create<EvaluationState>((set, get) => ({
  records: {},

  initRecord: (courseId: string, questId?: string) => {
    set((state) => {
      if (state.records[courseId]) return state; // already initialized
      const newRec: EvaluationRecord = {
        courseId,
        questId,
        userCourseProgress: 'not_started',
        quizScore: null,
        quizPassingScore: 66,
        projectStatus: 'not_submitted',
        onChainStatus: 'not_started',
        xpEarned: 0,
        lastFeedback: null,
      };
      return { records: { ...state.records, [courseId]: newRec } };
    });
  },

  startMaterial: (courseId: string) => {
    set((state) => {
      const rec = state.records[courseId];
      if (!rec) return state;
      const updated: EvaluationRecord = { ...rec, userCourseProgress: 'in_progress' };
      return { records: { ...state.records, [courseId]: updated } };
    });
  },

  submitQuiz: async (courseId: string, score: number) => {
    set((state) => {
      const rec = state.records[courseId];
      if (!rec) return state;
      const passed = score >= rec.quizPassingScore;
      const newProgress: UserCourseProgress = passed ? 'in_progress' : 'quiz_failed';
      const xpEarned = passed ? (rec.xpEarned + 50) : rec.xpEarned;
      const updated: EvaluationRecord = {
        ...rec,
        quizScore: score,
        userCourseProgress: newProgress,
        xpEarned,
        lastFeedback: passed ? 'Quiz passed' : 'Quiz failed: review the material and retry',
      };
      return { records: { ...state.records, [courseId]: updated } };
    });
  },

  retryQuiz: (courseId: string) => {
    set((state) => {
      const rec = state.records[courseId];
      if (!rec) return state;
      const updated: EvaluationRecord = { ...rec, quizScore: null, userCourseProgress: 'in_progress', lastFeedback: null };
      return { records: { ...state.records, [courseId]: updated } };
    });
  },

  submitProject: async (courseId: string, submission: { filename?: string; code?: string }) => {
    // mark submitted -> ai_review
    set((state) => {
      const rec = state.records[courseId];
      if (!rec) return state;
      const updated: EvaluationRecord = { ...rec, projectStatus: 'ai_review', lastFeedback: 'Waiting for AI review...' };
      return { records: { ...state.records, [courseId]: updated } };
    });

    try {
      const result = await evaluateProjectMock(submission);

      set((state) => {
        const rec = state.records[courseId];
        if (!rec) return state;

        if (result.passed) {
          // Pass path: issue badge (pending_onchain), update progress completed, add XP
          const updated: EvaluationRecord = {
            ...rec,
            projectStatus: 'passed',
            lastFeedback: result.feedback,
            userCourseProgress: 'completed',
            xpEarned: rec.xpEarned + 200,
            onChainStatus: 'pending_onchain',
          };
          return { records: { ...state.records, [courseId]: updated } };
        } else {
          // Fail path: actionable feedback, allow resubmit
          const updated: EvaluationRecord = {
            ...rec,
            projectStatus: 'failed',
            lastFeedback: result.feedback,
            userCourseProgress: 'project_failed',
          };
          return { records: { ...state.records, [courseId]: updated } };
        }
      });

      // If passed, simulate on-chain minting process (asynchronous)
      const recAfter = get().records[courseId];
      if (recAfter && recAfter.onChainStatus === 'pending_onchain') {
        // simulate minting
        setTimeout(() => {
          // 95% success
          const success = Math.random() > 0.05;
          set((state) => {
            const rec = state.records[courseId];
            if (!rec) return state;
            const updated: EvaluationRecord = {
              ...rec,
              onChainStatus: success ? 'minted' : 'failed',
            };
            return { records: { ...state.records, [courseId]: updated } };
          });
        }, 1200);
      }
    } catch {
      // AI failed -> move to manual review queue
      set((state) => {
        const rec = state.records[courseId];
        if (!rec) return state;
        const updated: EvaluationRecord = {
          ...rec,
          projectStatus: 'manual_review_queue',
          lastFeedback: 'AI evaluation failed / timed out. Sent to manual review queue.',
        };
        return { records: { ...state.records, [courseId]: updated } };
      });
    }
  },

  resubmitProject: async (courseId: string, submission: { filename?: string; code?: string }) => {
    // allow resubmission: just call submitProject
    await get().submitProject(courseId, submission);
  },

  markManualReviewCompleted: (courseId: string, passed: boolean, feedback?: string) => {
    set((state) => {
      const rec = state.records[courseId];
      if (!rec) return state;
      if (rec.projectStatus !== 'manual_review_queue') return state;

      if (passed) {
        const updated: EvaluationRecord = {
          ...rec,
          projectStatus: 'passed',
          userCourseProgress: 'completed',
          lastFeedback: feedback ?? 'Manual review: passed',
          xpEarned: rec.xpEarned + 200,
          onChainStatus: 'pending_onchain',
        };
        // simulate on-chain minting
        setTimeout(() => {
          set((s) => ({
            records: {
              ...s.records,
              [courseId]: { ...s.records[courseId], onChainStatus: 'minted' as OnChainStatus },
            },
          }));
        }, 1200);
        return { records: { ...state.records, [courseId]: updated } };
      } else {
        const updated: EvaluationRecord = {
          ...rec,
          projectStatus: 'failed',
          userCourseProgress: 'project_failed',
          lastFeedback: feedback ?? 'Manual review: failed',
        };
        return { records: { ...state.records, [courseId]: updated } };
      }
    });
  },
}));

export default useEvaluationStore;
