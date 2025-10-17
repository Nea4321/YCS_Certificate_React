import { memo } from 'react';
import {departmentDetailStyles} from "@/widgets";

interface AdditionalInfoSectionProps {
    description: Record<string, string>;
}

const DISPLAY_ORDER = [
    "어떤 자격증을 취득할 수 있나요?",
    "졸업 후에는 무슨 일을 하나요?",
    "학과만의 차별점은 뭔가요?",
    "학과의특ㆍ장점",
    "졸업생인터뷰"
];

export const AdditionalInfoSection = memo(({ description }: AdditionalInfoSectionProps) => {
    const { "학과소개": _, ...otherDetails } = description || {};

    const detailsToShow = DISPLAY_ORDER
        .map(key => ({ key, value: otherDetails[key] }))
        .filter(item => item.value && item.value.trim() !== "");

    return (
        <section className={departmentDetailStyles.descriptionSection}>
            <h2>학과 상세 정보</h2>
            <div className={departmentDetailStyles.description}>
                {detailsToShow.length > 0 ? (
                    detailsToShow.map(({ key, value }) => (
                        <div key={key} className={departmentDetailStyles.descriptionItem}>
                            <h4 className={departmentDetailStyles.descriptionTitle}>{key}</h4>
                            <p className={departmentDetailStyles.descriptionText}>{String(value)}</p>
                        </div>
                    ))
                ) : (
                    <p className={departmentDetailStyles.noInfo}>추가 상세 정보가 없습니다.</p>
                )}
            </div>
        </section>
    );
});

AdditionalInfoSection.displayName = 'AdditionalInfoSection';