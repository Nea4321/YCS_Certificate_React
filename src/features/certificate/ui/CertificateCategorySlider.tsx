import React, { useState, useEffect, useRef } from 'react';
import '@/features/certificate/ui/CertificateCategorySlider.css';
import { originalCategories} from "@/entities/certificate/lib/slidesData.ts";


const categories = [
    originalCategories[originalCategories.length - 2], // 가상: 마지막에서 두 번째
    originalCategories[originalCategories.length - 1], // 가상: 마지막
    ...originalCategories,                             // 원본 슬라이드들
    originalCategories[0],                             // 가상: 첫 번째
    originalCategories[1],                             // 가상: 두 번째
];

export const CertificateCategorySlider: React.FC = () => {
    const initialSlidesLength = originalCategories.length; // 원본 슬라이드 개수 (예: 3개)

    // currentIndex는 categories 배열에서 실제 첫 번째 슬라이드 (originalCategories[0])의 인덱스에서 시작합니다.
    // categories 배열 구조: [가상2, 가상1, 원본0, 원본1, 원본2, 가상0, 가상1]

    const [currentIndex, setCurrentIndex] = useState(2);
    const [isAnimating, setIsAnimating] = useState(false); // 애니메이션 중인지 여부
    const sliderTrackRef = useRef<HTMLDivElement>(null);


    const slideWidthPercentage = 50;
    const centerOffsetPercentage = (100 - slideWidthPercentage) / 2;


    useEffect(() => {
        if (isAnimating) {
            const onTransitionEnd = () => {
                if (currentIndex === initialSlidesLength + 2) {
                    setIsAnimating(false);
                    setCurrentIndex(2); // 첫 번째 슬라이드로 정확히 이동
                } else if (currentIndex === 1) {
                    setIsAnimating(false);
                    setCurrentIndex(initialSlidesLength + 1); // 마지막 슬라이드로 정확히 이동
                } else {
                    setIsAnimating(false); // 일반적으로 애니메이션 종료
                }
            };

            const currentRef = sliderTrackRef.current;
            if (currentRef) {
                currentRef.addEventListener('transitionend', onTransitionEnd, { once: true });
            }

            return () => {
                if (currentRef) {
                    currentRef.removeEventListener('transitionend', onTransitionEnd);
                }
            };
        }
    }, [isAnimating, currentIndex, initialSlidesLength]);


    const handlePrev = () => {
        if (isAnimating) return;
        setIsAnimating(true);
        setCurrentIndex((prev) => prev - 1);
    };

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
                    transform: `translateX(calc(-${currentIndex * slideWidthPercentage}% + ${centerOffsetPercentage}%))`,
                    transition: isAnimating ? 'transform 0.1s ease' : 'none'
                }}
            >
                {/* categories 배열을 매핑하여 슬라이드 렌더링 */}
                {categories.map((category, index) => (
                    <div

                        className={`slide ${index === currentIndex && index > 1 && index < categories.length - 2 ? 'active' : ''}`}
                        key={`${category.title}-${index}`}
                    >
                        <h3>{category.title}</h3>
                        <ol>
                            {/* 각 카테고리의 아이템들을 목록으로 렌더링 */}
                            {category.items.map((item, i) => (
                                <li key={i}>{item}</li> // 아이템의 고유성을 위해 i 사용 (간단한 경우)
                            ))}
                        </ol>
                    </div>
                ))}
            </div>
            <button onClick={handleNext} className="slider-arrow right">{'>'}</button>
        </div>
    );
};

export default CertificateCategorySlider;