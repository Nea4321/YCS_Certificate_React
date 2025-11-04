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

    // 켈린더 위젯 활성화 변수
    const [selectedCertificate, setSelectedCertificate] = useState<FavoriteSchedule | null>(null);

    console.log("favorite", favoriteInfo);
    console.log("schedule", favoriteSchedule);

    // 즐찾 삭제 버튼 -> 삭제한 후 즐찾 목록 들고와서 redux에 저장.
    const handleDelete = async (type: "department" | "certificate", id: number) => {
        console.log(`Delete ${type} with id: ${id}`)
        await FavoriteDeleteRequest(type, id);
        const favorite_data = await FavoriteInfoRequest();
        const favorite_schedule = await FavoriteScheduleRequest();
        dispatch(setFavoriteInfo(favorite_data))
        dispatch(setFavoriteSchedule(favorite_schedule))
    }

    /**
     * 선택된 자격증(selectedCertificate)의 시험 일정(schedule)을
     * CalendarWidget에서 사용할 수 있는 UiEvent 형식으로 변환하는 로직.
     *
     * 각 일정(sch)은 '시험일' 속성에서 시작일/종료일을 추출하고,
     * phase(단계)에 따라 이벤트 타입(UiEventType)을 지정한다.
     */
    const selectedEvents: UiEvent[] =
        selectedCertificate?.schedule
            //  유효한 시험 일정만 필터링
            //   sch["시험일"]이 문자열이며, "~" 구분자를 포함하는 항목만 남김.
            //   - 일부 데이터에는 "시험일"이 없거나 잘못된 형식일 수 있으므로 방어 코드임.
            //   @example : "2025.03.02~2025.03.05" 같은 형태만 통과.
            .filter((sch) => typeof sch["시험일"] === "string" && sch["시험일"].includes("~")) // ✅ 안전 필터
            .map((sch) => {

                // "시험일"은 "YYYY.MM.DD ~ YYYY.MM.DD" 형태의 문자열.
                //  → "~" 기준으로 분리 후 trim()으로 공백 제거.
                const [startStr, endStr] = sch["시험일"].split("~").map((s) => s.trim());

                 // '.' 구분자를 '-'로 바꿔서 Date 생성자에서 인식 가능하게 만듦.
                 // 예: "2025.03.02" → "2025-03-02"
                const start = new Date(startStr.replace(/\./g, "-"));
                const end = endStr ? new Date(endStr.replace(/\./g, "-")) : start;

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
                        type = "doc-exam";
                }
                /**
                 * ✅ CalendarWidget에 필요한 형식으로 변환하여 반환
                 * - startdate, enddate: ISO 포맷 "YYYY-MM-DD"
                 * - certificate: 자격증 이름
                 * - phase: 단계명 (예: 필기, 실기 등)
                 * - round: 회차
                 * - type: 위에서 결정한 UiEventType
                 */
                return {
                    startdate: start.toISOString().split("T")[0],
                    enddate: end.toISOString().split("T")[0],
                    certificate: selectedCertificate.certificate_name,
                    phase: sch.phase,
                    round: sch.round,
                    type,
                };
            })
                 // optional chaining이 undefined일 경우 빈 배열 반환
                 // (selectedCertificate가 null일 때도 안전하게 동작)
                ?? [];

    // 유저 정보 페이지 렌더링 할 때 즐찾 목록 가져와서 redux에 저장(한번만 실행)
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
    }, [dispatch]); //  한 번만 실행

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
                                        {/**
                                         *  즐겨찾기한 자격증 목록(favoriteSchedule)을 순회하며
                                         * 각 자격증의 "가장 가까운 시험 일정"을 테이블로 렌더링한다.
                                         */}
                                        {favoriteSchedule.map((cert) => {
                                            const today = new Date();
                                            /**
                                             *  "YYYY.MM.DD ~ YYYY.MM.DD" 형태의 문자열에서
                                             * 시작일(YYYY.MM.DD)만 Date 객체로 변환하는 함수
                                             */
                                            const parseExamStart = (rangeStr: string) => {
                                                const [startStr] = rangeStr.split("~").map((s) => s.trim());
                                                const [y, m, d] = startStr.split(".").map(Number);
                                                return new Date(y, m - 1, d);
                                            };
                                            /**
                                             *  cert.schedule에서 가장 가까운(오늘 이후) 시험 일정 계산
                                             * 1. 각 일정에 start(시작일) 필드 추가
                                             * 2. 오늘 이전 일정은 필터링
                                             * 3. 시작일 기준 오름차순 정렬 → 가장 가까운 일정 하나만 선택
                                             */
                                            const nearest = cert.schedule
                                                .map((sch) => ({ ...sch, start: parseExamStart(sch["시험일"]) }))
                                                .filter((sch) => sch.start >= today)
                                                .sort((a, b) => a.start.getTime() - b.start.getTime())[0];

                                            /**
                                             *  자격증명 클릭 → 캘린더 위젯으로 표시되도록 setSelectedCertificate(cert) 호출
                                             *  시험일은 "시작일"만 보여줌 (예: "2025.03.02 ~ 2025.03.05")
                                             */
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
                                                    <td>{nearest?.["시험일"] ?? "-"}</td>
                                                </tr>
                                            );
                                        })}
                                        </tbody>
                                    </table>
                                </div>

                                {/* 클릭 시 바로 캘린더 위젯 렌더링 */}
                                {selectedCertificate && (
                                    <div style={{ marginTop: 32, position: "relative" }}>
                                        <button
                                            onClick={() => setSelectedCertificate(null)}
                                            style={{position: "absolute", top: 0, right: 0, background: "#000000", color: "white", border: "none", borderRadius: 4, padding: "4px 8px", cursor: "pointer", zIndex: 10,}}>
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
                                    {/**
                                     * favoriteInfo 배열 중 type이 "department"인 항목만 필터링
                                     */}
                                    {favoriteInfo
                                        .filter((f) => f.type === "department")
                                        .map((favorite) => (
                                            <li key={favorite.type_id} className={userInfoPanelStyles.favoriteItem}>
                                                {/**
                                                 *  학과 이름 표시
                                                 * - 클릭 시 /departments/:id 경로로 이동
                                                 * - 파란색 텍스트 + 커서 포인터 적용
                                                 */}
                                               <span style={{ cursor: "pointer", color: "#2563eb" }}
                                                     onClick={() => navigate(`/departments/${favorite.type_id}`)}>
                                                    {favorite.name}
                                                </span>
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
                                                 <span style={{ cursor: "pointer", color: "#2563eb" }}
                                                        onClick={() => navigate(`/certificate/${cert.type_id}`)}>
                                                    {cert.name}
                                                </span>
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
