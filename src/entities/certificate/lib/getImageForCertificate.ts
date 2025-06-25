import { imageKeywordMap } from './imageKeywordMap.ts';

const defaultImage = 'https://i.namu.wiki/i/FYU32qsho4Zx4femUmKQBJLF-mZ1wuo9ZRQpUYpDc3IypISt4wiYO_dB_RtNetJaZkOs0Q82fMl_Mwm0c8A6zV2DCWkD8PuyKBGxUP0IArPMaZV7PUlmSBSqJVlEEzwNulOIXdcxeYtUmxO8TwYwyw.svg';

export const getImageForCertificate = (name: string): string => {
    for (const keyword in imageKeywordMap) {
        if (name.includes(keyword)) {
            return imageKeywordMap[keyword];
        }
    }
    return defaultImage;
};
