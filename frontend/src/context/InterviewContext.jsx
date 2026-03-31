import { createContext, useContext, useEffect, useReducer } from "react";

const STORAGE_KEY = "ai-interview-simulator-state";

const initialState = {
  fileName: "",
  extractedSkills: [],
  questions: [],
  currentQuestionIndex: 0,
  answers: [],
  scores: [],
  feedback: [],
  startedAt: null,
  completedAt: null,
};

const InterviewContext = createContext(null);

function readStoredState() {
  const rawState = sessionStorage.getItem(STORAGE_KEY);

  if (!rawState) {
    return initialState;
  }

  try {
    return {
      ...initialState,
      ...JSON.parse(rawState),
    };
  } catch {
    return initialState;
  }
}

function createSessionState(payload) {
  return {
    ...initialState,
    fileName: payload.fileName,
    extractedSkills: payload.extractedSkills ?? [],
    questions: payload.questions ?? [],
    currentQuestionIndex: 0,
    answers: Array(payload.questions?.length ?? 0).fill(""),
    scores: Array(payload.questions?.length ?? 0).fill(null),
    feedback: Array(payload.questions?.length ?? 0).fill(null),
    startedAt: new Date().toISOString(),
  };
}

function interviewReducer(state, action) {
  switch (action.type) {
    case "START_SESSION":
      return createSessionState(action.payload);

    case "SAVE_EVALUATION": {
      const { index, answer, result } = action.payload;
      const nextAnswers = [...state.answers];
      const nextScores = [...state.scores];
      const nextFeedback = [...state.feedback];

      nextAnswers[index] = answer;
      nextScores[index] = result.score;
      nextFeedback[index] = result;

      return {
        ...state,
        answers: nextAnswers,
        scores: nextScores,
        feedback: nextFeedback,
      };
    }

    case "NEXT_QUESTION": {
      const nextIndex = Math.min(
        state.currentQuestionIndex + 1,
        state.questions.length,
      );

      return {
        ...state,
        currentQuestionIndex: nextIndex,
        completedAt:
          nextIndex >= state.questions.length
            ? state.completedAt ?? new Date().toISOString()
            : state.completedAt,
      };
    }

    case "RESET_SESSION":
      return initialState;

    default:
      return state;
  }
}

export function InterviewProvider({ children }) {
  const [state, dispatch] = useReducer(interviewReducer, initialState, readStoredState);

  useEffect(() => {
    if (!state.questions.length) {
      sessionStorage.removeItem(STORAGE_KEY);
      return;
    }

    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const totalQuestions = state.questions.length;
  const answeredCount = state.feedback.filter(Boolean).length;
  const hasActiveSession = totalQuestions > 0;
  const isComplete = hasActiveSession && state.currentQuestionIndex >= totalQuestions;

  const value = {
    state,
    totalQuestions,
    answeredCount,
    hasActiveSession,
    isComplete,
    startSession: (payload) => dispatch({ type: "START_SESSION", payload }),
    saveEvaluation: (payload) => dispatch({ type: "SAVE_EVALUATION", payload }),
    nextQuestion: () => dispatch({ type: "NEXT_QUESTION" }),
    resetSession: () => dispatch({ type: "RESET_SESSION" }),
  };

  return <InterviewContext.Provider value={value}>{children}</InterviewContext.Provider>;
}

export function useInterview() {
  const context = useContext(InterviewContext);

  if (!context) {
    throw new Error("useInterview must be used within an InterviewProvider.");
  }

  return context;
}
