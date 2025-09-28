"use client"

import { useState } from "react"
import type { DragItem } from "../types"

export function useDragDrop() {
    const [draggedItem, setDraggedItem] = useState<DragItem | null>(null)

    const handleDragStart = (item: DragItem) => {
        setDraggedItem(item)
    }

    const handleDragEnd = () => {
        setDraggedItem(null)
    }

    return {
        draggedItem,
        handleDragStart,
        handleDragEnd,
    }
}
