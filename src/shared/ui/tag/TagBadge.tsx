import React from 'react'
import { useSelector } from "react-redux"
import styles from "./styles/tag-badge.module.css"
import type { RootState } from "@/app/store/store"

type Props = {
    id: number;
    onClick?: (e: React.MouseEvent<HTMLSpanElement>) => void;
    className?: string
}

export default function TagBadge({ id, onClick, className }: Props) {
    const tag = useSelector((s: RootState) =>
        s.tag.list.find((t) => t.tag_id === id)
    );

    const name = tag?.tag_Name ?? "";
    const color = tag?.tag_color ?? "#64748B";

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
