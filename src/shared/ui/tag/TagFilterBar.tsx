import { useNavigate } from "react-router-dom"
import { useState } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"
import styles from "./styles/tag-filter-bar.module.css"
import {
    tagMetaList,   // 모든 태그의 메타 배열 [{id, name, color}, ...]
    tagIdByName,   // 이름 → ID 맵 (예: "건설" → 40)
    getTagName,    // ID → 이름
    getTagColor,   // ID → 색상
} from "@/entities/certificate/model/tagMeta";

// 숫자 기반 태그 필터 바
// tagMeta(단일 소스)에서 이름/색상/ID를 얻어 렌더
// 인기 태그는 고정된 이름을 ID로 변환해서 사용
// 나머지 태그는 meta 전체에서 인기 태그를 제외하고 가나다 정렬

interface TagFilterBarProps {
    closeOnTagClick?: boolean; // 태그 클릭 시 펼침 영역 닫기 옵션
}

export const TagFilterBar = ({ closeOnTagClick = false }: TagFilterBarProps) => {
    const navigate = useNavigate()
    const [expanded, setExpanded] = useState(false)

    // 1) 인기 태그(이름 배열)를 ID로 변환
    const popular = ["IT", "건축", "운송", "전기", "식품"] as const;

    const popularTags = popular // 이름 → ID 변환 + 타입가드로 number[] 보장
        .map((name) => tagIdByName[name])
        .filter((id): id is number => id !== undefined);  // 단순화 불필요

    // 2) 나머지 태그 -전체 메타에서 인기 태그 제외, 한국어 가나다 정렬 (localeCompare with "ko")
    const otherTags = tagMetaList
        .filter((t) => !popularTags.includes(t.id))
        .sort((a, b) => a.name.localeCompare(b.name, "ko")); // 가나다

    // 3) 태그 클릭 → #이름으로 라우팅
    const handleNavigate = (id: number) => {
        const name = getTagName(id);
        if (!name) return;
        navigate(`/search?keyword=${encodeURIComponent("#" + name)}`);
        if (closeOnTagClick) setExpanded(false);
    };

    return (
        <div className={styles.wrap}>
            {/* 상단: 인기 태그 + 펼치기/접기 버튼 */}
            <div className={styles.row}>
                {popularTags.map((id) => {
                    const name = getTagName(id)!;
                    const color = getTagColor(id)!;
                    return (
                        <button
                            key={id}
                            className={styles.tag}
                            style={{ backgroundColor: color }}
                            onClick={() => handleNavigate(id)}
                        >
                            #{name}
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

            {/* 하단: 나머지 태그(칩) */}
            <div
                id="tag-filter-expand"
                className={`${styles.expand} ${expanded ? styles.open : ""}`}
            >
                <div className={styles.chips}>
                    {otherTags.map((t) => (
                        <button
                            key={t.id}
                            className={styles.chip}
                            style={{ backgroundColor: t.color }}
                            onClick={() => handleNavigate(t.id)}
                        >
                            #{t.name}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};