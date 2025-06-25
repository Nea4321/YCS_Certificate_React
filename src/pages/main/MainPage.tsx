import React from 'react';
import InfiniteCertificateList from '../../features/certificate/ui/InfiniteCertificateList.tsx';
import Slider from '@/features/certificate/ui/CertificateCategorySlider.tsx';

export const MainPage: React.FC = () => {
    return (
        <React.StrictMode>
            <Slider />
            <InfiniteCertificateList />
        </React.StrictMode>
    );
};

export default MainPage;
