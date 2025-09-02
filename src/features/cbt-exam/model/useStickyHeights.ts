import { useLayoutEffect, useRef } from "react";

export function useStickyHeights() {
    const bodyRef = useRef<HTMLDivElement>(null);
    const headerRef = useRef<HTMLDivElement>(null);
    const footerRef = useRef<HTMLDivElement>(null);
    const toolbarRef = useRef<HTMLDivElement>(null);

    useLayoutEffect(() => {
        const update = () => {
            const h = headerRef.current?.getBoundingClientRect().height ?? 0;
            const f = footerRef.current?.getBoundingClientRect().height ?? 0;
            const t = toolbarRef.current?.getBoundingClientRect().height ?? 0;
            bodyRef.current?.style.setProperty("--headerH", `${Math.ceil(h)}px`);
            bodyRef.current?.style.setProperty("--footerH", `${Math.ceil(f)}px`);
            bodyRef.current?.style.setProperty("--toolbarH", `${Math.ceil(t)}px`);
        };
        update();
        window.addEventListener("resize", update);
        return () => window.removeEventListener("resize", update);
    }, []);

    return { bodyRef, headerRef, footerRef, toolbarRef };
}
