import { tagColors } from "@/entities/certificate/model/tagColors"
import styles from "./styles/tag-badge.module.css"

type Props = {
    tag: string
    onClick?: (e: React.MouseEvent<HTMLSpanElement>) => void; // onclick 타입 명시
    className?: string
}

export default function TagBadge({ tag, onClick, className }: Props) {
    const color = tagColors[tag] ?? "#64748B" // fallback
    return (
        <span
            className={`${styles.badge} ${className ?? ""}`}
            style={{ backgroundColor: color }}
            onClick={onClick}
            role={onClick ? "button" : undefined}
        >
      #{tag}
    </span>
    )
}
