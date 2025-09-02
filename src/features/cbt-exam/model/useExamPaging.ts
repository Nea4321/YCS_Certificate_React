import { useEffect, useMemo, useRef } from "react";
import type { Question } from "@/entities/cbt/model/types";

export type LayoutMode = "twoCol" | "narrowSheet" | "oneCol";

export function useExamPaging(
    layout: LayoutMode,
    pageSize: number,
    currentPage: number,
    setCurrentPage: (p: number) => void,
    totalQuestions: number,
    questions: Question[],
) {
    const effPageSize = layout === "oneCol" ? 1 : pageSize;
    const totalPages = Math.ceil(totalQuestions / effPageSize);
    const startIdx = (currentPage - 1) * effPageSize;

    // 레이아웃 버튼 클릭 시 ‘현재 첫 문항 인덱스’를 유지한 채 페이지 재계산
    const onLayoutChange = (next: LayoutMode) => {
        const firstIdx = (currentPage - 1) * effPageSize;
        const nextSize = next === "oneCol" ? 1 : pageSize;
        const nextPage = Math.floor(firstIdx / nextSize) + 1;
        setCurrentPage(nextPage);
    };

    // pageSize prop 변경 시 첫 문항 유지
    const prevPropPageSizeRef = useRef(pageSize);
    useEffect(() => {
        if (prevPropPageSizeRef.current !== pageSize) {
            const oldSize = layout === "oneCol" ? 1 : prevPropPageSizeRef.current;
            const newSize = layout === "oneCol" ? 1 : pageSize;
            const firstIdx = (currentPage - 1) * oldSize;
            const nextPage = Math.floor(firstIdx / newSize) + 1;
            setCurrentPage(nextPage);
            prevPropPageSizeRef.current = pageSize;
        }
    }, [pageSize, layout, currentPage, setCurrentPage]);

    // 현재 페이지 상한 보정
    useEffect(() => {
        const tp = Math.ceil(totalQuestions / effPageSize);
        if (currentPage > tp) setCurrentPage(tp || 1);
    }, [effPageSize, totalQuestions, currentPage, setCurrentPage]);

    const currentSlice = useMemo(
        () => questions.slice(startIdx, startIdx + effPageSize),
        [questions, startIdx, effPageSize]
    );

    const goToQuestion = (num: number) => {
        const eff = layout === "oneCol" ? 1 : pageSize;
        const nextPage = Math.floor((num - 1) / eff) + 1;
        setCurrentPage(nextPage);
    };

    return { totalPages, startIdx, currentSlice, onLayoutChange, goToQuestion };
}
