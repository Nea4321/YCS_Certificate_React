import React, { useState, useEffect, useRef } from 'react';
import '@/features/certificate/ui/CertificateCategorySlider.css';
import { originalCategories} from "@/entities/certificate/lib/slidesData.ts";


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
    const initialSlidesLength = originalCategories.length; // 원본 슬라이드 개수 (예: 3개)

    // currentIndex는 categories 배열에서 실제 첫 번째 슬라이드 (originalCategories[0])의 인덱스에서 시작합니다.
    // categories 배열 구조: [가상2, 가상1, 원본0, 원본1, 원본2, 가상0, 가상1]

    const [currentIndex, setCurrentIndex] = useState(2); // 현재 슬라이더
    const [isAnimating, setIsAnimating] = useState(false); // 애니메이션 중인지 여부
    const sliderTrackRef = useRef<HTMLDivElement>(null);


    const slideWidthPercentage = 50;
    const centerOffsetPercentage = (100 - slideWidthPercentage) / 2;

    // 애니메이션이 끝나면 끝에 도달했는지 확인하고 원본 인덱스(2)로 점프하여 순환
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