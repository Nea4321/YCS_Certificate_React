import { getTagColor, getTagName } from "@/entities/certificate/model/tagMeta";
import styles from "./styles/tag-badge.module.css"

type Props = {
    id: number;
    onClick?: (e: React.MouseEvent<HTMLSpanElement>) => void; // onclick 타입 명시
    className?: string
}

export default function TagBadge({ id, onClick, className }: Props) {
    const name = getTagName(id) ?? "";            // 렌더 가드
    const color = getTagColor(id) ?? "#64748B";   // fallback

    return (
        <span
            className={`${styles.badge} ${className ?? ""}`}
            style={{ backgroundColor: color }}
            onClick={onClick}
            role={onClick ? "button" : undefined}
        >
      #{name}
    </span>
    );
}
