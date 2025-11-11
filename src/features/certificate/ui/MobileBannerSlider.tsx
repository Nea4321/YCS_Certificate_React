import { useMemo, useState } from "react";
import styles from "./MobileBannerSlider.module.css";

type Category = { title: string; items: string[] };

type Props = {
    categories: Category[];
    maxItems?: number;
};

export function MobileBannerSlider({ categories, maxItems = 5 }: Props) {
    const slides = useMemo(
        () =>
            categories.map((c) => {
                const items = c.items.slice(0, maxItems);
                const patchedTitle = c.title.replace(/(TOP\s*)(\d+)/i, `$1${maxItems}`);

                return {
                    title: patchedTitle,
                    items,
                };
            }),
        [categories, maxItems]
    );

    const [idx, setIdx] = useState(0);
    const [stage, setStage] = useState(0);
    const [anim, setAnim] = useState<"" | "exitL" | "exitR" | "enterL" | "enterR">("");
    const [busy, setBusy] = useState(false);
    const DURATION = 240;

    const goTo = (nextIdx: number) => {
        if (busy || nextIdx === idx) return;
        setBusy(true);

        const dir = nextIdx > idx ? 1 : -1;
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

    const prev = () => goTo((idx - 1 + slides.length) % slides.length);
    const next = () => goTo((idx + 1) % slides.length);
    const cur = slides[stage];

    return (
        <section className={styles.wrap} aria-label="모바일 배너 슬라이더">
            <section className={styles.mobileBannerWrap}>
                <div className={styles.mobileBannerCard}>
                    <div className={styles.viewport}>
                        <div
                            key={stage}
                            className={`${styles.slide} ${anim ? styles[anim] : ""}`}
                        >
                            <div className={styles.banner} role="group" aria-label={cur.title}>
                                <header className={styles.header}>
                                    <h3 className={styles.heading}>{cur.title}</h3>
                                </header>

                                <ol className={styles.list}>
                                    {cur.items.map((name, i) => (
                                        <li key={`${stage}-${i}`} className={styles.row}>
                                            <span className={styles.num}>{i + 1}</span>
                                            <span className={styles.text}>{name}</span>
                                        </li>
                                    ))}
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
                                                className={`${styles.dot} ${i === idx ? styles.dotOn : ""}`}
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
