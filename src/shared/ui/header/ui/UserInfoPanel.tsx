import { User, X, Trash2 } from "lucide-react"

import { useSelector } from "react-redux"
import type { RootState } from "@/app/store"
import { userInfoPanelStyles } from "./styles"
import {FavoriteInfoRequest} from "@/features/favorite";
import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";

interface UserInfoPanelProps {
    isOpen: boolean
    onToggle: () => void
}

interface FavoriteInfoRequest {
    type: string;
    type_id: number;
    name: string;
}

const MOCK_USER_DATA = {
    name: "김자격",
    role: "일반 회원",
    social: {
        email: "user@example.com",
        provider: "Google",
    },
    favoriteDepartments: [
        { id: 1, name: "컴퓨터공학과" },
        { id: 2, name: "전자공학과" },
        { id: 3, name: "경영학과" },
    ],
    favoriteCertificates: [
        { id: 1, name: "정보처리기사", examDate: "2025-03-15" },
        { id: 2, name: "네트워크관리사", examDate: "2025-04-20" },
        { id: 3, name: "리눅스마스터", examDate: "2025-05-10" },
    ],
}

export const UserInfoPanel = ({ isOpen, onToggle }: UserInfoPanelProps) => {
    const navigate = useNavigate()
    const userEmail = useSelector((state: RootState) => state.user.userEmail)
    const userName = useSelector((state: RootState) => state.user.userName)
    const socialType = useSelector((state: RootState) => state.user.socialType)
    const [favorite, setFavorite] = useState<FavoriteInfoRequest[]>([]);

    console.log("favorite", favorite);
    const handleDelete = (type: "department" | "certificate", id: number) => {
        console.log(`Delete ${type} with id: ${id}`)
        // 실제로는 여기서 Redux action이나 API 호출을 통해 삭제 처리
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                const favorite_data = await FavoriteInfoRequest();
                setFavorite(favorite_data);
            } catch (err) {console.error(err);}
        };
        fetchData();
    }, []);


    return (
        <>
            {/* 유저 정보 패널 버튼 */}
            <button className={userInfoPanelStyles.userInfoButton} onClick={onToggle} aria-label="유저 정보 열기">
                <User size={24} />
            </button>

            {/* 유저 정보 패널 */}
            <div className={`${userInfoPanelStyles.userInfoPanel} ${isOpen ? userInfoPanelStyles.userInfoPanelOpen : ""}`}>
                <div className={userInfoPanelStyles.panelHeader}>
                    <h2 className={userInfoPanelStyles.panelTitle}>유저 정보</h2>
                    <button className={userInfoPanelStyles.closeButton} onClick={onToggle} aria-label="닫기">
                        <X size={24} />
                    </button>
                </div>

                <div className={userInfoPanelStyles.panelContent}>
                    {!userName ? (
                        <div className={userInfoPanelStyles.loginPrompt}>
                            <p className={userInfoPanelStyles.loginMessage}>로그인이 필요합니다</p>
                            <button className={userInfoPanelStyles.loginButton} onClick={()=>navigate("/auth")}>로그인</button>
                        </div>
                    ) : (
                        <>
                            {/* 기본 정보 섹션 */}
                            <section className={userInfoPanelStyles.section}>
                                <h3 className={userInfoPanelStyles.sectionTitle}>기본 정보</h3>
                                <div className={userInfoPanelStyles.infoItem}>
                                    <span className={userInfoPanelStyles.infoLabel}>이름:</span>
                                    <span className={userInfoPanelStyles.infoValue}>{userName}</span>
                                </div>
                                <div className={userInfoPanelStyles.infoItem}>
                                    <span className={userInfoPanelStyles.infoLabel}>이메일:</span>
                                    <span className={userInfoPanelStyles.infoValue}>{userEmail}</span>
                                </div>
                                <div className={userInfoPanelStyles.infoItem}>
                                    <span className={userInfoPanelStyles.infoLabel}>연동:</span>
                                    <span className={userInfoPanelStyles.infoValue}>{socialType}</span>
                                </div>
                            </section>

                            {/* 캘린더 섹션 */}
                            <section className={userInfoPanelStyles.section}>
                                <h3 className={userInfoPanelStyles.sectionTitle}>시험 일정</h3>
                                <div className={userInfoPanelStyles.calendarTable}>
                                    <table>
                                        <thead>
                                        <tr>
                                            <th>자격증</th>
                                            <th>시험일</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {MOCK_USER_DATA.favoriteCertificates.map((cert) => (
                                            <tr key={cert.id}>
                                                <td>{cert.name}</td>
                                                <td>{cert.examDate}</td>
                                            </tr>
                                        ))}
                                        </tbody>
                                    </table>
                                </div>
                            </section>

                            {/* 즐겨찾기 학과 섹션 */}
                            <section className={userInfoPanelStyles.section}>
                                <h3 className={userInfoPanelStyles.sectionTitle}>즐겨찾기 학과</h3>
                                <ul className={userInfoPanelStyles.favoriteList}>
                                    {favorite
                                        .filter(favorite=>favorite.type==="department")
                                        .map((favorite) => (
                                        <li key={favorite.type_id} className={userInfoPanelStyles.favoriteItem}>
                                            <span>{favorite.name}</span>
                                            <button
                                                className={userInfoPanelStyles.deleteButton}
                                                onClick={() => handleDelete("department", favorite.type_id)}
                                                aria-label={`${favorite.name} 삭제`}
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </section>

                            {/* 즐겨찾기 자격증 섹션 */}
                            <section className={userInfoPanelStyles.section}>
                                <h3 className={userInfoPanelStyles.sectionTitle}>즐겨찾기 자격증</h3>
                                <ul className={userInfoPanelStyles.favoriteList}>
                                    {favorite
                                        .filter(favorite=>favorite.type==="certificate")
                                        .map((cert) => (
                                        <li key={cert.type_id} className={userInfoPanelStyles.favoriteItem}>
                                            <span>{cert.name}</span>
                                            <button
                                                className={userInfoPanelStyles.deleteButton}
                                                onClick={() => handleDelete("certificate", cert.type_id)}
                                                aria-label={`${cert.name} 삭제`}
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </section>
                        </>
                    )}
                </div>
            </div>

            {/* 오버레이 */}
            {isOpen && <div className={userInfoPanelStyles.overlay} onClick={onToggle} />}
        </>
    )
}
