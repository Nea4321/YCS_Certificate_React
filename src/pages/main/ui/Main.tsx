import { InfiniteCertificateList } from '@/features/certificate/ui/InfiniteCertificateList';
import { CertificateCategorySlider } from '@/features/certificate/ui/CertificateCategorySlider';
import { TagFilterBar } from '@/shared/ui/tag/TagFilterBar.tsx';
import { useOrganizations } from "@/shared";

export const Main = () => {
    useOrganizations();
    return (
        <div>
            <CertificateCategorySlider />
            <TagFilterBar />
            <InfiniteCertificateList />
        </div>
    );
};