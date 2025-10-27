// TagFilterBar.tsx
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { ChevronDown, ChevronUp } from "lucide-react";
import styles from "./styles/tag-filter-bar.module.css";
import { certificateApi } from "@/entities/certificate/api/certificate-api";
import { setTag } from "@/shared/slice/TagSlice";
import type { RootState, AppDispatch } from "@/app/store/store";

interface TagFilterBarProps {
    closeOnTagClick?: boolean;
}

export const TagFilterBar = ({ closeOnTagClick = false }: TagFilterBarProps) => {
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();
    const [expanded, setExpanded] = useState(false);
    const tags = useSelector((s: RootState) => s.tag.list);
    useEffect(() => {
        if (tags && tags.length > 0) return;

        const ctrl = new AbortController();
        (async () => {
            const raw = await certificateApi.getTags(ctrl.signal);
            const adapted = raw.map(t => ({
                tag_id: t.tag_id,
                tag_Name: t.tag_name,
                tag_color: t.color,
            }));
            dispatch(setTag(adapted));
        })();

        return () => ctrl.abort();
    }, [dispatch, tags]);

    useEffect(() => {
        console.log("[TAG Redux] tag.list =", tags);
    }, [tags]);
    const popularNames = ["IT", "건축", "운송", "전기", "식품"] as const;

    const idByName = useMemo(() => {
        const m = new Map<string, number>();
        tags.forEach(t => m.set(t.tag_Name, t.tag_id));
        return m;
    }, [tags]);

    const byId = useMemo(() => {
        const m = new Map<number, { tag_id: number; tag_Name: string; tag_color: string }>();
        tags.forEach(t => m.set(t.tag_id, t));
        return m;
    }, [tags]);

    const popularIds = useMemo(
        () => popularNames.map(n => idByName.get(n)).filter((v): v is number => v !== undefined),
        [popularNames, idByName]
    );

    // 나머지(가나다 정렬, 인기 제외)
    const others = useMemo(
        () =>
            tags
                .filter(t => !popularIds.includes(t.tag_id))
                .sort((a, b) => a.tag_Name.localeCompare(b.tag_Name, "ko")),
        [tags, popularIds]
    );

    const handleNavigate = (id: number) => {
        const t = byId.get(id);
        if (!t) return;
        navigate(`/search?keyword=${encodeURIComponent("#" + t.tag_Name)}`);
        if (closeOnTagClick) setExpanded(false);
    };

    return (
        <div className={styles.wrap}>
            <div className={styles.row}>
                {popularIds.map(id => {
                    const t = byId.get(id)!;
                    return (
                        <button
                            key={id}
                            className={styles.tag}
                            style={{ backgroundColor: t.tag_color }}
                            onClick={() => handleNavigate(id)}
                        >
                            #{t.tag_Name}
                        </button>
                    );
                })}

                <button
                    className={styles.more}
                    onClick={() => setExpanded(v => !v)}
                    aria-expanded={expanded}
                    aria-controls="tag-filter-expand"
                >
                    {expanded ? <>접기 <ChevronUp size={16} /></> : <>펼치기 <ChevronDown size={16} /></>}
                </button>
            </div>

            <div id="tag-filter-expand" className={`${styles.expand} ${expanded ? styles.open : ""}`}>
                <div className={styles.chips}>
                    {others.map(t => (
                        <button
                            key={t.tag_id}
                            className={styles.chip}
                            style={{ backgroundColor: t.tag_color }}
                            onClick={() => handleNavigate(t.tag_id)}
                        >
                            #{t.tag_Name}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};
