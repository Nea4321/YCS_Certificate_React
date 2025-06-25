import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Certificate } from '@/entities/certificate/model/types.ts';
import { certificateApi } from '@/entities/certificate/api/certificate-api.ts';
import CertificateCard from '@/pages/main/ui/CertificateCard.tsx';


const PAGE_SIZE = 20;

export const InfiniteCertificateList: React.FC = () => {
    const [allCertificates, setAllCertificates] = useState<Certificate[]>([]);
    const [displayedCertificates, setDisplayedCertificates] = useState<Certificate[]>([]);
    const [page, setPage] = useState(1);
    const observerRef = useRef<IntersectionObserver | null>(null);


    useEffect(() => {
        const controller = new AbortController();
        const fetchData = async () => {
            try {
                const data = await certificateApi.getCertificate(controller.signal);
                setAllCertificates(data);
                setDisplayedCertificates(data.slice(0, PAGE_SIZE));
            } catch (error) {
                console.error('자격증 목록을 불러오는 데 실패했습니다:', error);
            }
        };

        fetchData();
        return () => controller.abort();
    }, []);

    useEffect(() => {
        if (page === 1) return;


        setDisplayedCertificates(allCertificates.slice(0, page * PAGE_SIZE));
        setTimeout(() => {

        }, 300);
    }, [page, allCertificates]);

    const observer = useCallback((node: HTMLDivElement | null) => {
        if (!node) return;
        if (observerRef.current) observerRef.current.disconnect();

        observerRef.current = new IntersectionObserver(
            entries => {
                if (
                    entries[0].isIntersecting &&
                    displayedCertificates.length < allCertificates.length
                ) {
                    setPage(prev => prev + 1);
                }
            },
            {
                root: null,
                rootMargin: '0px 0px 200px 0px',
                threshold: 0.1
            }
        );

        observerRef.current.observe(node);
    }, [displayedCertificates, allCertificates]);

    return (
        <>
            <div className="grid-container">
                {displayedCertificates.map((cert, idx) => {
                    const isLast = idx === displayedCertificates.length - 1;
                    return (
                        <div key={cert.certificate_id} ref={isLast ? observer : null}>
                            <CertificateCard cert={cert} />
                        </div>
                    );
                })}
            </div>


        </>
    );

};

export default InfiniteCertificateList;
