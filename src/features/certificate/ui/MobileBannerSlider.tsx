import React, {useMemo, useState, useRef, useEffect} from "react";
import styles from "./MobileBannerSlider.module.css";
import { Link } from "react-router-dom";
import { certificateApi } from "@/entities/certificate/api/certificate-api";
import type { Certificate } from "@/entities/certificate/model/types";

type Category = { title: string; items: number[] };

type Props = {
    categories: Category[];
    maxItems?: number;
};

export function MobileBannerSlider({ categories, maxItems = 5 }: Props) {
    const slides = useMemo(
        () =>
            categories.map((c) => {
                const items = c.items.slice(0, maxItems);
                const patchedTitle = c.title.replace(
                    /(TOP\s*)(\d+)/i,
                    `$1${maxItems}`
                );
                return {
                    title: patchedTitle,
                    items,
                };
            }),
        [categories, maxItems]
    );
    const [certMap, setCertMap] = useState<Record<number, Certificate>>({});
    const [isCertLoading, setIsCertLoading] = useState(false);
    const [certError, setCertError] = useState<string | null>(null);

    useEffect(() => {
        const controller = new AbortController();

        const loadCertificates = async () => {
            try {
                setIsCertLoading(true);
                setCertError(null);

                const list = await certificateApi.getCertificate(controller.signal);
                const map: Record<number, Certificate> = {};
                list.forEach((c) => {
                    map[c.certificate_id] = c;
                });
                setCertMap(map);
            } catch (e) {
                console.error("[MobileBannerSlider] getCertificate error", e);
                setCertError("자격증 목록을 불러오는 중 오류가 발생했습니다.");
            } finally {
                setIsCertLoading(false);
            }
        };

        loadCertificates();
        return () => controller.abort();
    }, []);

    const [idx, setIdx] = useState(0);
    const [stage, setStage] = useState(0);
    const [anim, setAnim] =
        useState<"" | "exitL" | "exitR" | "enterL" | "enterR">("");
    const [busy, setBusy] = useState(false);
    const DURATION = 240;
    const touchStartX = useRef(0);
    const touchStartY = useRef(0);
    const isSwiping = useRef(false);

    const goTo = (nextIdx: number, dir: 1 | -1) => {
        if (busy || nextIdx === idx) return;
        setBusy(true);
        setAnim(dir > 0 ? "exitL" : "exitR");

        window.setTimeout(() => {
            setStage(nextIdx);
            setIdx(nextIdx);
            setAnim(dir > 0 ? "enterR" : "enterL");
        }, DURATION);

        window.setTimeout(() => {
            setAnim("");
            setBusy(false);
        }, DURATION * 2);
    };

    const prev = () =>
        goTo((idx - 1 + slides.length) % slides.length, -1);

    const next = () =>
        goTo((idx + 1) % slides.length, +1);

    const cur = slides[stage];

    const handleTouchStart: React.TouchEventHandler<HTMLDivElement> = (e) => {
        const t = e.touches[0];
        touchStartX.current = t.clientX;
        touchStartY.current = t.clientY;
        isSwiping.current = true;
    };

    const handleTouchMove: React.TouchEventHandler<HTMLDivElement> = (e) => {
        if (!isSwiping.current) return;

        const t = e.touches[0];
        const dx = t.clientX - touchStartX.current;
        const dy = t.clientY - touchStartY.current;

        if (Math.abs(dx) > Math.abs(dy)) {
            const native = e.nativeEvent as TouchEvent;
            if (native.cancelable) {
                native.preventDefault();
            }
        }
    };

    const handleTouchEnd: React.TouchEventHandler<HTMLDivElement> = (e) => {
        if (!isSwiping.current) return;
        isSwiping.current = false;

        if (busy) return;

        const t = e.changedTouches[0];
        const dx = t.clientX - touchStartX.current;
        const threshold = 40;

        if (Math.abs(dx) < threshold) return;

        if (dx < 0) {
            next();
        } else {
            prev();
        }
    };

    const handleTouchCancel: React.TouchEventHandler<HTMLDivElement> = () => {
        isSwiping.current = false;
    };

    return (
        <section className={styles.wrap} aria-label="모바일 배너 슬라이더">
            <section className={styles.mobileBannerWrap}>
                <div className={styles.mobileBannerCard}>
                    <div
                        className={styles.viewport}
                        onTouchStart={handleTouchStart}
                        onTouchMove={handleTouchMove}
                        onTouchEnd={handleTouchEnd}
                        onTouchCancel={handleTouchCancel}
                    >
                        <div
                            key={stage}
                            className={`${styles.slide} ${anim ? styles[anim] : ""}`}
                        >
                            <div className={styles.banner} role="group" aria-label={cur.title}>
                                <header className={styles.header}>
                                    <h3 className={styles.heading}>{cur.title}</h3>
                                </header>

                                {/* 필요하면 에러/로딩 메시지 */}
                                {certError && !Object.keys(certMap).length && (
                                    <p className={styles.errorText}>{certError}</p>
                                )}
                                {isCertLoading && !Object.keys(certMap).length && (
                                    <p className={styles.loadingText}>자격증 정보를 불러오는 중...</p>
                                )}

                                <ol className={styles.list}>
                                    {cur.items.map((certId, i) => {
                                        const cert = certMap[certId];

                                        return (
                                            <li key={`${stage}-${certId}`} className={styles.row}>
                                                <span className={styles.num}>{i + 1}</span>

                                                {cert ? (
                                                    <Link
                                                        to={`/certificate/${cert.certificate_id}`}
                                                        className={styles.link}
                                                        onPointerDown={(e) => e.stopPropagation()} // 슬라이드 드래그와 충돌 방지
                                                    >
                                                        {cert.certificate_name}
                                                    </Link>
                                                ) : (
                                                    <span className={styles.text}>로딩 중...</span>
                                                )}
                                            </li>
                                        );
                                    })}
                                </ol>

                                <div className={styles.nav}>
                                    <button
                                        className={styles.navBtn}
                                        onClick={prev}
                                        aria-label="이전 배너"
                                        disabled={busy}
                                    >
                                        ‹
                                    </button>
                                    <div className={styles.dots} aria-hidden>
                                        {slides.map((_, i) => (
                                            <span
                                                key={i}
                                                className={`${styles.dot} ${
                                                    i === idx ? styles.dotOn : ""
                                                }`}
                                            />
                                        ))}
                                    </div>
                                    <button
                                        className={styles.navBtn}
                                        onClick={next}
                                        aria-label="다음 배너"
                                        disabled={busy}
                                    >
                                        ›
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </section>
    );
}