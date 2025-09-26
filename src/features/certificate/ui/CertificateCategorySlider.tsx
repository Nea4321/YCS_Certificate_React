import React, { useState, useEffect, useRef } from 'react';
import '@/features/certificate/ui/CertificateCategorySlider.css';
import { originalCategories } from "@/entities/certificate/lib/slidesData.ts";


/**무한 슬라이더를 위해 만든 가상 슬라이더를 추가한 배열*/
const categories = [
    originalCategories[originalCategories.length - 2], // 가상: 마지막에서 두 번째
    originalCategories[originalCategories.length - 1], // 가상: 마지막
    ...originalCategories,                             // 원본 슬라이드들
    originalCategories[0],                             // 가상: 첫 번째
    originalCategories[1],                             // 가상: 두 번째
];

/**메인 페이지의 무한 슬라이더 컴포넌트
 *
 * - 원본 슬라이더와 해당 슬라이더를 복사한 가상 슬라이더를 생성한다
 * - 이후 '<' 또는 '>' 버튼을 눌러 다음 슬라이더로 접근할 때,
 *   원본 슬라이더의 범위 밖이라면 가상 슬라이더를 보여주고 가상 슬라이더의 양 끝으로 이동했을 때,
 *   원본 인덱스(2)로 점프하여 무한 슬라이더 구현
 *
 *   @component
 */
export const CertificateCategorySlider: React.FC = () => {
    const initialSlidesLength = originalCategories.length;

    const [currentIndex, setCurrentIndex] = useState(2);
    const [isAnimating, setIsAnimating] = useState(false);
    const sliderTrackRef = useRef<HTMLDivElement>(null);

    const [slideWidthPct, setSlideWidthPct] = useState(45);

    useEffect(() => {
        const update = () => {
            const w = window.innerWidth;
            if (w <= 768) {
                setSlideWidthPct(100);   // 모바일
            } else if (w <= 1024) {
                setSlideWidthPct(80);    // 태블릿
            } else if (w <= 1440) {
                setSlideWidthPct(60);    // 작은 데스크탑
            } else {
                setSlideWidthPct(45);    // 큰 데스크탑
            }
        };
        update();
        window.addEventListener('resize', update);
        return () => window.removeEventListener('resize', update);
    }, []);

    const centerOffsetPct = slideWidthPct === 100 ? 0 : (100 - slideWidthPct) / 2;
    const isMobile = slideWidthPct === 100;

    useEffect(() => {
        if (!isAnimating) return;
        const onTransitionEnd = () => {
            if (currentIndex === initialSlidesLength + 2) {
                setIsAnimating(false);
                setCurrentIndex(2);
            } else if (currentIndex === 1) {
                setIsAnimating(false);
                setCurrentIndex(initialSlidesLength + 1);
            } else {
                setIsAnimating(false);
            }
        };
        const el = sliderTrackRef.current;
        el?.addEventListener('transitionend', onTransitionEnd, { once: true });
        return () => el?.removeEventListener('transitionend', onTransitionEnd);
    }, [isAnimating, currentIndex, initialSlidesLength]);


    /**슬라이더 이전 페이징 함수
     * '<'버튼을 누르면 이전 슬라이더 배열 내용을 보여주기 위해 currentIndex 상태 변경
     */
    const handlePrev = () => {
        if (isAnimating) return;
        setIsAnimating(true);
        setCurrentIndex((prev) => prev - 1);
    };

    /**슬라이더 이후 페이징 함수
     * '>'버튼을 누르면 다음 슬라이더 배열 내용을 보여주기 위해 currentIndex 상태 변경
     */
    const handleNext = () => {
        if (isAnimating) return;
        setIsAnimating(true);
        setCurrentIndex((prev) => prev + 1);
    };

    return (
        <div className="slider-wrapper">
            <button onClick={handlePrev} className="slider-arrow left">{'<'}</button>
            <div
                className="slider-track"
                ref={sliderTrackRef}
                style={{
                    transform:
                        slideWidthPct === 100
                            ? `translateX(-${currentIndex * 100}%)` // 모바일: 한 장 꽉 차게
                            : `translateX(calc(-${currentIndex * slideWidthPct}% + ${centerOffsetPct}%))`,
                    transition: isAnimating ? 'transform 0.25s ease' : 'none',
                }}
            >
                {/* categories 배열을 매핑하여 슬라이드 렌더링 */}
                {categories.map((category, index) => {
                    // 제목에 'TOP 숫자'가 들어가면 모바일에서만 'TOP 5'로 치환
                    const displayTitle = isMobile
                        ? category.title.replace(/TOP\s*\d+/i, 'TOP 5')
                        : category.title;

                    // 모바일이면 모든 카드 항목을 5개로 제한, 아니면 원본 유지
                    const displayItems = isMobile ? category.items.slice(0, 5) : category.items;

                    return (
                        <div
                            className={`slide ${index === currentIndex && index > 1 && index < categories.length - 2}`}
                            key={`${category.title}-${index}`}
                        >
                            <h3>{displayTitle}</h3>
                            <ol>
                                {displayItems.map((item, i) => (
                                    <li key={i}>{item}</li>
                                ))}
                            </ol>
                        </div>
                    );
                })}
            </div>

            <button onClick={handleNext} className="slider-arrow right">{'>'}</button>
        </div>
    );
};