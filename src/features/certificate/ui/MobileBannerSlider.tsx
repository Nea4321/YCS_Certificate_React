import { useMemo, useState } from "react";
import styles from "./MobileBannerSlider.module.css";

type Category = { title: string; items: string[] };

type Props = {
    /** 예: [컴소과, 자격증 TOP 10, 난이도 TOP 10] */
    categories: Category[];
    /** 각 배너에서 보여줄 아이템 개수 (기본 5) */
    maxItems?: number;
};

export function MobileBannerSlider({ categories, maxItems = 5 }: Props) {
    const slides = useMemo(
        () =>
            categories.map((c) => ({
                title: c.title,
                items: c.items.slice(0, maxItems),
            })),
        [categories, maxItems]
    );

    // 외부적으로 선택된 "논리 인덱스"
    const [idx, setIdx] = useState(0);

    // 화면에 보이는 "stage 인덱스"와 애니메이션 단계
    const [stage, setStage] = useState(0);
    const [anim, setAnim] = useState<"" | "exitL" | "exitR" | "enterL" | "enterR">("");
    const [busy, setBusy] = useState(false); // 중복 클릭 방지

    const DURATION = 240; // exit/enter 동일 (ms)

    const goTo = (nextIdx: number) => {
        if (busy || nextIdx === idx) return;
        setBusy(true);

        const dir = nextIdx > idx ? 1 : -1;
        // 1) 현재 화면 내보내기
        setAnim(dir > 0 ? "exitL" : "exitR");

        // 2) 내보내기 종료 후 stage 교체 + 들어오기
        window.setTimeout(() => {
            setStage(nextIdx);
            setIdx(nextIdx);
            setAnim(dir > 0 ? "enterR" : "enterL");
        }, DURATION);

        // 3) 들어오기 종료 후 정리
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
                    {/* 뷰포트: 오버플로우 숨기고, 슬라이드를 절대배치 */}
                    <div className={styles.viewport}>
                        <div
                            key={stage} // stage가 바뀔 때 enter 애니가 재생되도록
                            className={`${styles.slide} ${anim ? styles[anim] : ""}`}
                        >
                            <div
                                className={styles.banner}
                                role="group"
                                aria-roledescription="슬라이드"
                                aria-label={cur.title}
                            >
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
                    {/* // viewport */}
                </div>
            </section>
        </section>
    );
}
