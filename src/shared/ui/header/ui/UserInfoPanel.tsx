import { User, X, Trash2 } from "lucide-react"

import {useDispatch, useSelector} from "react-redux"
import type { RootState } from "@/app/store"
import { userInfoPanelStyles } from "./styles"
import {
    FavoriteDeleteRequest,
    FavoriteInfoRequest,
    FavoriteScheduleRequest
} from "@/features/favorite";
import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {FavoriteSchedule, setFavoriteInfo, setFavoriteSchedule} from "@/shared/slice";
import {CalendarWidget} from "@/widgets/calendar";
import {UiEvent, UiEventType} from "@/features/calendar";

interface UserInfoPanelProps {
    isOpen: boolean
    onToggle: () => void
}

export const UserInfoPanel = ({ isOpen, onToggle }: UserInfoPanelProps) => {
    const navigate = useNavigate()
    const dispatch = useDispatch();
    const userEmail = useSelector((state: RootState) => state.user.userEmail)
    const userName = useSelector((state: RootState) => state.user.userName)
    const socialType = useSelector((state: RootState) => state.user.socialType)

    const favoriteInfo = useSelector((state: RootState) => state.favorite.list);
    const favoriteSchedule = useSelector((state: RootState) => state.favorite_schedule.list);

    const [selectedCertificate, setSelectedCertificate] = useState<FavoriteSchedule | null>(null);

    console.log("favorite", favoriteInfo);
    console.log("schedule", favoriteSchedule);

    const handleDelete = async (type: "department" | "certificate", id: number) => {
        console.log(`Delete ${type} with id: ${id}`)
        await FavoriteDeleteRequest(type, id);
        const favorite_data = await FavoriteInfoRequest();
        const favorite_schedule = await FavoriteScheduleRequest();
        dispatch(setFavoriteInfo(favorite_data))
        dispatch(setFavoriteSchedule(favorite_schedule))
    }
    const selectedEvents: UiEvent[] =
        selectedCertificate?.schedule.map((sch: any) => {
            const [startStr, endStr] = sch.exam_date.split("~").map((s) => s.trim());
            const start = new Date(startStr.replace(/\./g, "-"));
            const end = endStr ? new Date(endStr.replace(/\./g, "-")) : start;

            // phase 기반 type 지정
            let type: UiEventType;
            switch (sch.phase) {
                case "필기":
                    type = "doc-exam";
                    break;
                case "실기":
                    type = "prac-exam";
                    break;
                case "서류접수":
                    type = "doc-reg";
                    break;
                case "합격발표":
                    type = "doc-pass";
                    break;
                default:
                    type = "doc-exam"; // 기타
            }

            return {
                startdate: start.toISOString().split("T")[0],
                enddate: end.toISOString().split("T")[0],
                certificate: selectedCertificate.certificate_name,
                phase: sch.phase,
                round: sch.round,
                type, // 필수
            };
        }) ?? [];

    useEffect(() => {
        const fetchFavorites = async () => {
            try {
                const favorite_data = await FavoriteInfoRequest();
                const favorite_schedule = await FavoriteScheduleRequest();
                // Redux에 저장
                dispatch(setFavoriteInfo(favorite_data));
                dispatch(setFavoriteSchedule(favorite_schedule));
            } catch (err) {
                console.error(err);
            }
        };

        fetchFavorites();
    }, [dispatch]); // 마운트 시 한 번만 실행

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
                            <button className={userInfoPanelStyles.loginButton} onClick={() => navigate("/auth")}>
                                로그인
                            </button>
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
                                        {favoriteSchedule.map((cert) => {
                                            const today = new Date();
                                            const parseExamStart = (rangeStr: string) => {
                                                const [startStr] = rangeStr.split("~").map((s) => s.trim());
                                                const [y, m, d] = startStr.split(".").map(Number);
                                                return new Date(y, m - 1, d);
                                            };
                                            const nearest = cert.schedule
                                                .map((sch) => ({ ...sch, start: parseExamStart(sch["시험일"]) }))
                                                .filter((sch) => sch.start >= today)
                                                .sort((a, b) => a.start.getTime() - b.start.getTime())[0];

                                            if (!nearest) return null;

                                            return (
                                                <tr key={cert.certificate_id}>
                                                    <td>
                                                          <span
                                                              style={{ cursor: "pointer", color: "#2563eb" }}
                                                              onClick={() => setSelectedCertificate(cert)}
                                                          >
                                                            {cert.certificate_name}
                                                          </span>
                                                        </td>
                                                    <td>{nearest["시험일"].split("~")[0].trim()}</td>
                                                </tr>
                                            );
                                        })}
                                        </tbody>
                                    </table>
                                </div>

                                {/* 클릭 시 바로 CalendarWidget 렌더 */}
                                {selectedCertificate && (
                                    <div style={{ marginTop: 32, position: "relative" }}>
                                        <button
                                            onClick={() => setSelectedCertificate(null)}
                                            style={{position: "absolute", top: 0, right: 0,
                                                background: "#000000", color: "white",
                                                border: "none", borderRadius: 4,
                                                padding: "4px 8px", cursor: "pointer", zIndex: 10,
                                            }}
                                        >
                                            닫기
                                        </button>
                                        <CalendarWidget
                                            events={selectedEvents}
                                            loading={false}
                                            certName={selectedCertificate.certificate_name}
                                        />
                                    </div>
                                )}
                            </section>

                            {/* 즐겨찾기 학과 섹션 */}
                            <section className={userInfoPanelStyles.section}>
                                <h3 className={userInfoPanelStyles.sectionTitle}>즐겨찾기 학과</h3>
                                <ul className={userInfoPanelStyles.favoriteList}>
                                    {favoriteInfo
                                        .filter((f) => f.type === "department")
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
                                    {favoriteInfo
                                        .filter((f) => f.type === "certificate")
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
