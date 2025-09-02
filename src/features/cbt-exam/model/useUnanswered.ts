import { useMemo } from "react";

export function useUnanswered(answers: (number | null)[]) {
    const unanswered = useMemo(() => answers.filter(a => a == null).length, [answers]);
    const numbers = useMemo(
        () => answers.map((a, i) => (a == null ? i + 1 : null)).filter((n): n is number => n !== null),
        [answers]
    );
    return { unanswered, numbers, hasUnanswered: numbers.length > 0 };
}
