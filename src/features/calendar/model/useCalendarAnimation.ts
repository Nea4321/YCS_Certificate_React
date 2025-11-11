import { useLayoutEffect, RefObject } from "react";

interface UseCalendarAnimationArgs {
    calRef: RefObject<HTMLDivElement | null>;
    isExpanded: boolean;
    viewReady: boolean;
    deps?: any[];
}

export function useCalendarAnimation({
                                         calRef,
                                         isExpanded,
                                         viewReady,
                                         deps = [],
                                     }: UseCalendarAnimationArgs) {
    useLayoutEffect(() => {
        if (!viewReady) return;
        const root = calRef.current;
        if (!root) return;

        let tries = 0;
        let rafId = 0;

        const run = () => {
            const tiles = Array.from(
                root.querySelectorAll<HTMLElement>(".react-calendar__tile")
            );
            if (!tiles.length) {
                if (tries < 3) {
                    tries += 1;
                    rafId = requestAnimationFrame(run);
                }
                return;
            }

            const grid = tiles[0].parentElement as HTMLElement | null;
            if (!grid) return;

            rafId = requestAnimationFrame(() => {
                const target =
                    (root.querySelector(
                        ".react-calendar__tile--active"
                    ) as HTMLElement | null) ||
                    (root.querySelector(
                        ".react-calendar__tile--now"
                    ) as HTMLElement | null) ||
                    tiles[0];

                const rowTops = Array.from(new Set(tiles.map((t) => t.offsetTop))).sort(
                    (a, b) => a - b
                );
                const totalRows = rowTops.length;
                const rowIdx = Math.max(0, rowTops.indexOf(target.offsetTop));

                let rowStep = 0;
                const first = tiles[0];
                const nextRowTile = tiles.find((t) => t.offsetTop > first.offsetTop);
                if (nextRowTile) {
                    rowStep = Math.round(nextRowTile.offsetTop - first.offsetTop);
                }
                if (!rowStep) {
                    const rect = tiles[0].getBoundingClientRect();
                    const cs = getComputedStyle(grid);
                    const rowGap =
                        parseFloat(
                            (cs as any).rowGap || (cs as any).gridRowGap || "0"
                        ) || 0;
                    rowStep = Math.round(rect.height + rowGap);
                }

                const rowTop = rowIdx * rowStep;
                const rowBottom = (totalRows - rowIdx - 1) * rowStep;

                if (!isExpanded) {
                    const clip = `inset(${rowTop}px 0 ${Math.max(0, rowBottom)}px)`;
                    grid.style.clipPath = clip;
                    grid.style.setProperty("-webkit-clip-path", clip);
                    grid.style.transform = `translateY(-${rowTop}px)`;
                    grid.style.willChange = "clip-path, transform";
                    grid.style.overflow = "hidden";
                } else {
                    grid.style.clipPath = "";
                    grid.style.removeProperty("-webkit-clip-path");
                    grid.style.transform = "";
                    grid.style.willChange = "";
                    grid.style.overflow = "";
                }
            });
        };

        rafId = requestAnimationFrame(run);

        return () => {
            if (rafId) cancelAnimationFrame(rafId);
        };
    }, [calRef, isExpanded, viewReady, ...deps]);
}
