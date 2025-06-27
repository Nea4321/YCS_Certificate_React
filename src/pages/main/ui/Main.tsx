import { InfiniteCertificateList } from '@/features/certificate/ui/InfiniteCertificateList';
import { CertificateCategorySlider } from '@/features/certificate/ui/CertificateCategorySlider';

export const Main = () => {
    return (
        <div>
            <CertificateCategorySlider />
            <InfiniteCertificateList />
        </div>
    );
};