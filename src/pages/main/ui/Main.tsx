import { InfiniteCertificateList } from '@/features/certificate/ui/InfiniteCertificateList';
import { CertificateCategorySlider } from '@/features/certificate/ui/CertificateCategorySlider';
import { TagFilterBar } from '@/shared/ui/tag/TagFilterBar.tsx';
import { useOrganizations } from "@/shared";
import {NewsTicker} from "@/widgets/newsticker";
import {MobileBannerSlider, useMedia} from "@/features";
import {originalCategories} from "@/entities/certificate/lib/slidesData.ts";

export const Main = () => {
    useOrganizations();
    const isMobile = useMedia("(max-width: 768px)");
    const mobileSlides = [
        originalCategories[0],
        originalCategories[1],
        originalCategories[2],
    ];
    return (
        <div>
            {isMobile ? (
                <MobileBannerSlider
                    categories={mobileSlides}
                    maxItems={4} /* 반응형에서 5개 고정 */
                />
            ) : (
            <CertificateCategorySlider />
                )}
            <NewsTicker />
            <TagFilterBar />
            <InfiniteCertificateList />
        </div>
    );
};