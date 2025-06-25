import React from 'react';
import { Certificate } from '@/entities/certificate/model/types';
import { getImageForCertificate } from '@/entities/certificate/lib/getImageForCertificate.ts';
import '@/pages/main/styles/CertificateCard.css';
import { Link } from 'react-router-dom';

interface Props {
    cert: Certificate;
}

export const CertificateCard: React.FC<Props> = ({ cert }) => {
    const imageUrl = getImageForCertificate(cert.certificate_name);
    return (
        <Link to={`/certificate/${cert.certificate_id}`} className="certificate-link">
        <div className="certificate-card">
            <div className="card-image-box">
                <img
                    src={imageUrl}
                    alt={`${cert.certificate_name} 이미지`}
                    className="card-image"
                />
            </div>
            <div className="card-text-box">
                <h4 className="card-title">{cert.certificate_name}</h4>
            </div>
        </div>
        </Link>
    );
};

export default CertificateCard;
