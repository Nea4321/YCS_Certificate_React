import { InfiniteCertificateList } from '@/features/certificate/ui/InfiniteCertificateList';
import { CertificateCategorySlider } from '@/features/certificate/ui/CertificateCategorySlider';
import { TagFilterBar } from '@/shared/ui/header/ui/TagFilterBar.tsx';

export const Main = () => {
    return (
        <div>
            <CertificateCategorySlider />
            <TagFilterBar />
            <InfiniteCertificateList />
        </div>
    );
};