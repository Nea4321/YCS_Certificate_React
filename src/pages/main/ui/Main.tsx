import { InfiniteCertificateList } from '@/features/certificate/ui/InfiniteCertificateList';
import { CertificateCategorySlider } from '@/features/certificate/ui/CertificateCategorySlider';
import { TagFilterBar } from '@/shared/ui/tag/TagFilterBar.tsx';

export const Main = () => {
    return (
        <div>
            <CertificateCategorySlider />
            <TagFilterBar />
            <InfiniteCertificateList />
        </div>
    );
};