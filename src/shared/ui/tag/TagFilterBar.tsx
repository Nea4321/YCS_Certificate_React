import { tagColors } from "@/entities/certificate/model/tagColors.ts"
import { useNavigate } from "react-router-dom"
import { useState } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"
import styles from "./styles/tag-filter-bar.module.css"

interface TagFilterBarProps {
    closeOnTagClick?: boolean;
}

export const TagFilterBar = ({ closeOnTagClick = false }: TagFilterBarProps) => {
    const navigate = useNavigate()
    const [expanded, setExpanded] = useState(false)

    // 고정 인기 태그
    const popularTags = ["IT", "건축", "운송", "전기", "식품"]

    // 나머지 태그(가나다)
    const otherTags = Object.entries(tagColors)
        .filter(([tag]) => !popularTags.includes(tag))
        .sort(([a], [b]) => a.localeCompare(b, "ko"))

    const handleNavigate = (tag: string) => {
        navigate(`/search?keyword=${encodeURIComponent("#" + tag)}`)
        if (closeOnTagClick) setExpanded(false)
    }

    return (
        <div className={styles.wrap}>
            <div className={styles.row}>
                {popularTags.map(tag => (
                    <button
                        key={tag}
                        className={styles.tag}
                        style={{ backgroundColor: tagColors[tag] }}
                        onClick={() => handleNavigate(tag)}
                    >
                        #{tag}
                    </button>
                ))}

                <button
                    className={styles.more}
                    onClick={() => setExpanded(v => !v)}
                    aria-expanded={expanded}
                    aria-controls="tag-filter-expand"
                >
                    {expanded ? <>접기 <ChevronUp size={16} /></> : <>펼치기 <ChevronDown size={16} /></>}
                </button>
            </div>

            <div
                id="tag-filter-expand"
                className={`${styles.expand} ${expanded ? styles.open : ""}`}
            >
                <div className={styles.chips}>
                    {otherTags.map(([tag, color]) => (
                        <button
                            key={tag}
                            className={styles.chip}
                            style={{ backgroundColor: color }}
                            onClick={() => handleNavigate(tag)}
                        >
                            #{tag}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    )
}
