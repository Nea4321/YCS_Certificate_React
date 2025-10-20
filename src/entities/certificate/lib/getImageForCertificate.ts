import { imageKeywordMap } from './imageKeywordMap.ts';

const defaultImage = 'https://www.yuhan.ac.kr/ibuilder/template/theme_skin/theme900/images/introduce/img_sbmark_large.png';

export const getImageForCertificate = (name: string): string => {
    for (const keyword in imageKeywordMap) {
        if (name.includes(keyword)) {
            return imageKeywordMap[keyword];
        }
    }
    return defaultImage;
};
