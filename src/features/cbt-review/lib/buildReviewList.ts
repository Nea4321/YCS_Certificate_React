import type { QuestionDTO } from "@/entities/cbt";

export type ReviewItem = {
    index: number;
    question: QuestionDTO;
    user: number | null;
    correct: number;
    isCorrect: boolean;
};

export function buildReviewList(
    questions: QuestionDTO[],
    userAnswers: (number | null)[]
): ReviewItem[] {
    if (!questions?.length) return [];

    return questions.map((q, i) => {
        const user = userAnswers[i] ?? null;
        const correctIdx = q.answers.findIndex(a => a.bool);
        const correct = correctIdx >= 0 ? correctIdx + 1 : 0;
        const isCorrect = user !== null && user === correct;
        return { index: i, question: q, user, correct, isCorrect };
    });
}
