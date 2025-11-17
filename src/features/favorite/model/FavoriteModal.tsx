import React from "react";
import { X, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { userInfoPanelStyles } from "@/shared";

interface Favorite {
    type: string;
    type_id: number;
    name: string;
}

interface FavoriteModalProps {
    show: boolean;
    onClose: () => void;
    favoriteInfo: Favorite[];
    handleDelete: (type: "department" | "certificate", id: number)  => void;
}

export const FavoriteModal: React.FC<FavoriteModalProps> = ({
                                                         show,
                                                         onClose,
                                                         favoriteInfo,
                                                         handleDelete,
                                                     }) => {
    const navigate = useNavigate();

    if (!show) return null;

    return (
        <div className={userInfoPanelStyles.modalOverlay}>
            <div className={userInfoPanelStyles.modal}>
                <div className={userInfoPanelStyles.modalHeader}>
                    <h3>즐겨찾기 목록</h3>
                    <button className={userInfoPanelStyles.modalClose} onClick={onClose}>
                        <X size={20} />
                    </button>
                </div>

                <div className={userInfoPanelStyles.modalContent}>
                    {/* 학과 */}
                    <section>
                        <h4>학과</h4>
                        <ul className={userInfoPanelStyles.favoriteList}>
                            {favoriteInfo
                                .filter((f) => f.type === "department")
                                .map((f) => (
                                    <li key={f.type_id} className={userInfoPanelStyles.favoriteItem}>
                                        <span
                                            style={{ cursor: "pointer", color: "#2563eb" }}
                                            onClick={() => navigate(`/departments/${f.type_id}`)}
                                        >
                                            {f.name}
                                        </span>
                                        <button
                                            className={userInfoPanelStyles.deleteButton}
                                            onClick={() => handleDelete("department", f.type_id)}
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </li>
                                ))}
                        </ul>
                    </section>

                    {/* 자격증 */}
                    <section style={{ marginTop: 16 }}>
                        <h4>자격증</h4>
                        <ul className={userInfoPanelStyles.favoriteList}>
                            {favoriteInfo
                                .filter((f) => f.type === "certificate")
                                .map((f) => (
                                    <li key={f.type_id} className={userInfoPanelStyles.favoriteItem}>
                                        <span
                                            style={{ cursor: "pointer", color: "#2563eb" }}
                                            onClick={() => navigate(`/certificate/${f.type_id}`)}
                                        >
                                            {f.name}
                                        </span>
                                        <button
                                            className={userInfoPanelStyles.deleteButton}
                                            onClick={() => handleDelete("certificate", f.type_id)}
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </li>
                                ))}
                        </ul>
                    </section>
                </div>
            </div>
        </div>
    );
};