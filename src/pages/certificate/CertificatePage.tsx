// pages/certificate/CertificatePage.tsx
import { Certificate } from './ui';
import { certificateStyles } from './styles';

export default function CertificatePage() {
    return (
        <div className={certificateStyles.container /* 실제 있는 클래스명 사용 */}>
            <Certificate />
        </div>
    );
}
