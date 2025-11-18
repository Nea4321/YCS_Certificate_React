import { User, X} from "lucide-react"
import ReactDOM from "react-dom"
import {useDispatch, useSelector} from "react-redux"
import type { RootState } from "@/app/store"
import { userInfoPanelStyles } from "./styles"
import {
    FavoriteDeleteRequest,
    FavoriteInfoRequest, FavoriteModal,
    FavoriteScheduleRequest
} from "@/features/favorite";
import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {setFavoriteInfo, setFavoriteSchedule} from "@/shared/slice";
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

    const [showFavoriteModal, setShowFavoriteModal] = useState(false);
    const favoriteInfo = useSelector((state: RootState) => state.favorite.list);
    const favoriteSchedule = useSelector((state: RootState) => state.favorite_schedule.list);

    // 즐찾 삭제 버튼 -> 삭제한 후 즐찾 목록 들고와서 redux에 저장.
    const handleDelete = async (type: "department" | "certificate", id: number) => {
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
    const allEvents: UiEvent[] = favoriteSchedule.flatMap((cert) =>
        cert.schedule
            //  유효한 시험 일정만 필터링
            //   sch["시험일"]이 문자열이며, "~" 구분자를 포함하는 항목만 남김.
            //   - 일부 데이터에는 "시험일"이 없거나 잘못된 형식일 수 있으므로 방어 코드임.
            //   @example : "2025.03.02~2025.03.05" 같은 형태만 통과.
            .filter((sch) => typeof sch["시험일"] === "string" && sch["시험일"].includes("~"))
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
                    certificate: cert.certificate_name,
                    phase: sch.phase,
                    round: sch.round,
                    type,
                };
            })
    );

    // 유저 정보 페이지 렌더링 할 때 즐찾 목록 가져와서 redux에 저장(한번만 실행)
    useEffect(() => {
        const fetchFavorites = async () => {
            try {
                if(userName) {
                    const favorite_data = await FavoriteInfoRequest();
                    const favorite_schedule = await FavoriteScheduleRequest();
                    // Redux에 저장
                    dispatch(setFavoriteInfo(favorite_data));
                    dispatch(setFavoriteSchedule(favorite_schedule));
                }
            } catch (err) {
                console.error(err);
            }
        };

        fetchFavorites();
    }, [dispatch, userName]); //  한 번만 실행

    const panelContent = (
        <>
            {/* 유저 정보 패널 */}
            <div
                className={`${userInfoPanelStyles.userInfoPanel} ${
                    isOpen ? userInfoPanelStyles.userInfoPanelOpen : ""
                }`}
            >
                <div className={userInfoPanelStyles.panelHeader}>
                    <div className={userInfoPanelStyles.userSummary}>
                        <div className={userInfoPanelStyles.userText}>
                            <h2 className={userInfoPanelStyles.panelTitle}>
                                {userName ? userName : ""}
                            </h2>
                            <p className={userInfoPanelStyles.emailText}>
                                {userEmail ? userEmail : "로그인되지 않음"}
                            </p>
                        </div>
                    </div>

                    <button
                        className={userInfoPanelStyles.closeButton}
                        onClick={onToggle}
                        aria-label="닫기"
                    >
                        <X size={24} />
                    </button>
                </div>

                <div className={userInfoPanelStyles.panelContent}>
                    {!userName ? (
                        <div className={userInfoPanelStyles.loginPrompt}>
                            <p className={userInfoPanelStyles.loginMessage}>로그인이 필요합니다</p>
                            <button
                                className={userInfoPanelStyles.loginButton}
                                onClick={() => navigate("/auth")}
                            >
                                로그인
                            </button>
                        </div>
                    ) : (
                        <>
                            {/* 시험 일정 섹션 */}
                            <section className={userInfoPanelStyles.section}>
                                <div className={userInfoPanelStyles.sectionHeader}>
                                    <h3 className={userInfoPanelStyles.sectionTitle}>시험 일정</h3>
                                    <button
                                        className={userInfoPanelStyles.favoriteToggleButton}
                                        onClick={() => setShowFavoriteModal(true)}
                                    >
                                        즐겨찾기 목록 보기
                                    </button>
                                </div>

                                <div>
                                    <CalendarWidget
                                        events={allEvents}
                                        loading={false}
                                        certName="즐겨찾기 전체 일정"
                                        isUserPanel
                                    />
                                </div>
                            </section>
                        </>
                    )}
                </div>
            </div>

            {/* 오버레이 */}
            {isOpen && (
                <div className={userInfoPanelStyles.overlay} onClick={onToggle} />
            )}

            {/* 즐겨찾기 모달 */}
            <FavoriteModal
                show={showFavoriteModal}
                onClose={() => setShowFavoriteModal(false)}
                favoriteInfo={favoriteInfo}
                handleDelete={handleDelete}
            />
        </>
    )

    return (
        <>
            {/* 유저 정보 열기 버튼은 Header 안에 그대로 둠 */}
            <button
                className={userInfoPanelStyles.userInfoButton}
                onClick={onToggle}
                aria-label="유저 정보 열기"
            >
                <User size={24} />
            </button>

            {/* 포털을 이용해 panel과 overlay를 body에 렌더링 */}
            {ReactDOM.createPortal(panelContent, document.body)}
        </>
    )
}
