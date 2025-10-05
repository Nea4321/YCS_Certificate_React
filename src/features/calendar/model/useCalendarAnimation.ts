import { useLayoutEffect } from 'react';
import type { RefObject } from 'react';

interface UseCalendarAnimationProps {
    calRef: RefObject<HTMLDivElement | null>;
    isExpanded: boolean;
    visibleMonth: Date;
    currentDate: Date;
    viewReady: boolean;
}

export function useCalendarAnimation({
                                         calRef,
                                         isExpanded,
                                         visibleMonth,
                                         currentDate,
                                         viewReady,
                                     }: UseCalendarAnimationProps) {
    useLayoutEffect(() => {
        if (!viewReady) return;

        const root = calRef.current;
        if (!root) return;

        const days = root.querySelector('.react-calendar__month-view__days') as HTMLElement | null;
        if (!days) return;

        const tiles = Array.from(days.querySelectorAll('.react-calendar__tile')) as HTMLElement[];
        if (!tiles.length) return;

        const raf = requestAnimationFrame(() => {
            const isNeighbor = (el: Element) =>
                el.classList.contains('react-calendar__month-view__days__day--neighboringMonth');

            const monthStart = new Date(visibleMonth.getFullYear(), visibleMonth.getMonth(), 1);
            const sameMonth = (a: Date, b: Date) => a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth();

            const today = new Date();
            const baseDate = sameMonth(today, monthStart)
                ? today
                : sameMonth(currentDate, monthStart)
                    ? currentDate
                    : monthStart;

            let targetTile: HTMLElement | null = null;
            for (const t of tiles) {
                if (isNeighbor(t)) continue;
                const abbr = t.querySelector('abbr');
                const dayNum = abbr?.textContent?.trim();
                if (dayNum && Number(dayNum) === baseDate.getDate()) {
                    targetTile = t as HTMLElement;
                    break;
                }
            }
            if (!targetTile) targetTile = tiles.find(t => !isNeighbor(t)) ?? tiles[0];

            const rowTops = Array.from(new Set(tiles.map(t => t.offsetTop))).sort((a, b) => a - b);
            const totalRows = rowTops.length;

            const rowIdx = Math.max(0, rowTops.indexOf(targetTile.offsetTop));

            let rowStep = 0;
            if (tiles.length >= 8) {
                const a = tiles[0];
                const b = tiles[7] ?? tiles.find(t => t.offsetTop > a.offsetTop);
                if (b) rowStep = Math.round(b.offsetTop - a.offsetTop);
            }
            if (!rowStep) {
                const rect = tiles[0].getBoundingClientRect();
                const style = getComputedStyle(days);
                const rowGap =
                    parseFloat((style as any).rowGap || (style as any).gridRowGap || '0') || 0;
                rowStep = Math.round(rect.height + rowGap);
            }

            const rowTop = rowIdx * rowStep;
            const rowBottom = (totalRows - rowIdx - 1) * rowStep;

            if (!isExpanded) {
                const clip = `inset(${rowTop}px 0 ${Math.max(0, rowBottom)}px)`;

                if (days.style.clipPath !== clip) {
                    days.style.clipPath = clip;
                    days.style.setProperty('-webkit-clip-path', clip); // Safari
                    days.style.transform = `translateY(-${rowTop}px)`;
                    days.style.willChange = 'clip-path, transform';
                    days.style.overflow = 'hidden';
                }
            } else {
                if (days.style.clipPath) {
                    days.style.clipPath = '';
                    days.style.removeProperty('-webkit-clip-path');
                    days.style.transform = '';
                    days.style.willChange = '';
                    days.style.overflow = '';
                }
            }
        });

        return () => cancelAnimationFrame(raf);
    }, [isExpanded, visibleMonth, currentDate, viewReady, calRef]);
}
