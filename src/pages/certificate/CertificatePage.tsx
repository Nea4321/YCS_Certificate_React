// import { Certificate } from "./ui"
// import { certificateStyles } from "./styles"
//
// export const CertificatePage = () => {
//     return (
//         <div className={certificateStyles.container}>
//             <Certificate />
//         </div>
//     )
// }

// pages/certificate/CertificatePage.tsx
import { certificateStyles } from './styles';
import {Certificate} from './ui';

export const CertificatePage = () => {
    return (
        <div className={certificateStyles.container}>
            <Certificate />
        </div>
    );
};

export default CertificatePage;
