import { tagColors } from "@/entities/certificate/model/tagColors"
import { useNavigate } from "react-router-dom"
import { useEffect, useMemo, useRef, useState } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"
import styles from "./styles/tag-filter-bar.module.css"

interface TagFilterBarProps {
    closeOnTagClick?: boolean; // ← 새로 추가
}

export const TagFilterBar = ({ closeOnTagClick = false }: TagFilterBarProps) => {
    const navigate = useNavigate()

    const wrapRef = useRef<HTMLDivElement | null>(null)
    const panelRef = useRef<HTMLDivElement | null>(null)
    const innerRef = useRef<HTMLDivElement | null>(null)

    const [expanded, setExpanded] = useState(false)
    const [prevScrollY, setPrevScrollY] = useState<number | null>(null)
    const [isAnimating, setIsAnimating] = useState(false)

    const popularTags = ["IT", "건축", "기계", "전기", "조리"]

    const otherTags = useMemo(
        () =>
            Object.entries(tagColors)
                .filter(([tag]) => !popularTags.includes(tag))
                .sort(([a], [b]) => a.localeCompare(b)),
        []
    )

    const setPanelHeight = (val: number | "auto") => {
        if (!panelRef.current) return
        panelRef.current.style.height = typeof val === "number" ? `${val}px` : "auto"
    }

    const open = () => {
        if (!panelRef.current || !innerRef.current) {
            setExpanded(true)
            return
        }
        setPrevScrollY(window.scrollY)
        setExpanded(true)
        setIsAnimating(true)
        requestAnimationFrame(() => {
            const h = innerRef.current!.scrollHeight
            setPanelHeight(h)
            wrapRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
        })
    }

    const close = () => {
        if (!panelRef.current || !innerRef.current) {
            setExpanded(false)
            return
        }
        setIsAnimating(true)
        const currentHeight = innerRef.current.scrollHeight
        setPanelHeight(currentHeight)
        requestAnimationFrame(() => {
            setPanelHeight(0)
        })
    }

    const handleNavigate = (tag: string) => {
        navigate(`/search?keyword=${encodeURIComponent("#" + tag)}`)
        if (closeOnTagClick) close() // prop이 true일 때만 닫기
    }

    useEffect(() => {
        const onKey = (e: KeyboardEvent) => e.key === "Escape" && expanded && close()
        window.addEventListener("keydown", onKey)
        return () => window.removeEventListener("keydown", onKey)
    }, [expanded])

    useEffect(() => {
        const el = panelRef.current
        if (!el) return

        const onEnd = (e: TransitionEvent) => {
            if (e.propertyName !== "height") return
            setIsAnimating(false)
            if (expanded) {
                setPanelHeight("auto")
            } else {
                if (prevScrollY !== null) {
                    window.scrollTo({ top: prevScrollY, behavior: "smooth" })
                }
            }
        }

        el.addEventListener("transitionend", onEnd)
        return () => el.removeEventListener("transitionend", onEnd)
    }, [expanded, prevScrollY])

    useEffect(() => {
        if (!innerRef.current) return
        const ro = new ResizeObserver(() => {
            if (expanded && panelRef.current && isAnimating === false) {
                const computed = getComputedStyle(panelRef.current).height
                if (computed !== "auto") {
                    setPanelHeight(innerRef.current!.scrollHeight)
                }
            }
        })
        ro.observe(innerRef.current)
        return () => ro.disconnect()
    }, [expanded, isAnimating])

    return (
        <div className={styles.wrap} ref={wrapRef}>
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

                {!expanded ? (
                    <button className={styles.more} onClick={open} aria-expanded={expanded}>
                        전체 태그 <ChevronDown size={16} />
                    </button>
                ) : (
                    <button className={styles.more} onClick={() => setExpanded(false)} aria-expanded={expanded}>
                        접기 <ChevronUp size={16} />
                    </button>
                )}
            </div>

            <div
                ref={panelRef}
                className={`${styles.expand} ${expanded ? styles.open : ""}`}
                style={{ height: expanded ? undefined : 0 }}
            >
                <div ref={innerRef} className={styles.chips}>
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
