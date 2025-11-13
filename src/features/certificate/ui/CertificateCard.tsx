import type React from "react";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import type { Certificate } from "@/entities/certificate/model/types";
import { getImageForCertificate } from "@/entities/certificate/lib/getImageForCertificate";
import { mainStyles } from "../../../pages/main/styles";
import { Link, useNavigate } from "react-router-dom";
import { TagBadge } from "@/shared/ui/tag";
import type { RootState } from "@/app/store/store";

interface Props {
    cert: Certificate;
}

export const CertificateCard: React.FC<Props> = ({ cert }) => {
    const imageUrl = getImageForCertificate(cert.certificate_name);
    const navigate = useNavigate();

    const tag_Map = useSelector((s: RootState) => s.tag.list);

    const tagMap = useMemo(() => {
        return new Map(tag_Map.map(t => [t.tag_id, { name: t.tag_Name, color: t.tag_color }]));
    }, [tag_Map]);

    const tagIds: number[] = useMemo(() => {
        const anyCert = cert as Certificate;
        return (
            anyCert?.tag ??
            []
        ) as number[];
    }, [cert]);

    const handleTagClick = (id: number, e: React.MouseEvent<HTMLSpanElement>) => {
        e.stopPropagation();
        e.preventDefault();
        const name = tagMap.get(id)?.name;
        if (!name) return;
        navigate(`/search?keyword=${encodeURIComponent("#" + name)}`);
    };

    return (
        <Link to={`/certificate/${cert.certificate_id}`} className={mainStyles.certificateLink}  state={{ tag: cert.tag }}>
            <div className={mainStyles.certificateCard}>
                <div className={mainStyles.cardImageBox}>
                    <img
                        src={imageUrl || "/placeholder.svg"}
                        alt={`${cert.certificate_name} 이미지`}
                        className={mainStyles.cardImage}
                    />
                </div>

                <div className={mainStyles.cardTextBox}>
                    <h4 className={mainStyles.cardTitle}>{cert.certificate_name}</h4>
                </div>

                {/* 🔹 태그 뱃지 (Redux 기반, 최대 3개) */}
                <div className={mainStyles.tagBox}>
                    {tagIds
                        .filter((id) => tagMap.has(id))   // Redux에 존재하는 태그만
                        .slice(0, 3)
                        .map((id) => (
                            <TagBadge key={id} id={id} onClick={(e) => handleTagClick(id, e)} />
                        ))}
                </div>
            </div>
        </Link>
    );
};

export default CertificateCard;
