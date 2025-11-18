import { myPageStyles } from "../styles"
import {CbtHistoryList, MyPageForm} from "@/features/login"
import {useEffect, useState} from "react"
import {useNavigate} from "react-router-dom";
import {FavoriteDeleteRequest, FavoriteInfoRequest, FavoriteModal, FavoriteScheduleRequest} from "@/features/favorite";
import {setFavoriteInfo, setFavoriteSchedule} from "@/shared/slice";
import {useDispatch, useSelector} from "react-redux";
import type {RootState} from "@/app/store";

export const MyPage = () => {
    const { user, isEditing, message, editData, handleEdit, handleSave, handleCancel, handleInputChange } = MyPageForm()
    const [showFavoriteModal, setShowFavoriteModal] = useState(false);
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const isAdmin =  useSelector((state: RootState) => state.user.userRole);

    useEffect(() => {
        FavoriteInfoRequest()
            .then((a) => dispatch(setFavoriteInfo(a)))
            .catch((err) => console.error("즐겨찾기 정보 로드 실패:", err));
    }, [dispatch]); // 처음 마운트 시 1번만 실행

    const favoriteInfo = useSelector((state: RootState) => state.favorite.list);

    const handleDelete = async (type: "department" | "certificate", id: number) => {
        await FavoriteDeleteRequest(type, id);
        const favorite_data = await FavoriteInfoRequest();
        const favorite_schedule = await FavoriteScheduleRequest();
        dispatch(setFavoriteInfo(favorite_data))
        dispatch(setFavoriteSchedule(favorite_schedule))
    }


    return (
        <div className={myPageStyles.container}>
            {/* 메인 컨텐츠 */}
            <main className={myPageStyles.main}>
                <div className={myPageStyles.content}>
                    {/* 프로필 카드 */}
                    <div className={myPageStyles.profileCard}>
                        <div className={myPageStyles.profileHeader}>
                            <div className={myPageStyles.avatar}>
                                <span className={myPageStyles.avatarText}>{user.userName}</span>
                            </div>
                            <div className={myPageStyles.profileInfo}>
                                <h2 className={myPageStyles.profileName}>{user.userName}</h2>
                                <p className={myPageStyles.profileEmail}>{user.userEmail}</p>
                                {isAdmin ==="admin" && <span className={myPageStyles.adminBadge}>관리자</span>}
                            </div>
                        </div>
                    </div>

                    {/* 정보 수정 섹션 */}
                    <div className={myPageStyles.infoCard}>
                        <div className={myPageStyles.cardHeader}>
                            <h3 className={myPageStyles.cardTitle}>개인정보</h3>
                            {!isEditing && (
                                <button onClick={handleEdit} className={myPageStyles.editButton}>
                                    수정
                                </button>
                            )}
                        </div>

                        {message && (
                            <div
                                className={`${myPageStyles.message} ${
                                    message.includes("성공") ? myPageStyles.success : myPageStyles.error
                                }`}
                            >
                                {message}
                            </div>
                        )}

                        <div className={myPageStyles.infoGrid}>
                            <div className={myPageStyles.infoItem}>
                                <label className={myPageStyles.infoLabel}>이름</label>
                                {isEditing ? (
                                    <input
                                        name="name"
                                        type="text"
                                        value={editData.name}
                                        onChange={handleInputChange}
                                        className={myPageStyles.input}
                                    />
                                ) : (
                                    <span className={myPageStyles.infoValue}>{user.userName}</span>
                                )}
                            </div>

                            <div className={myPageStyles.infoItem}>
                                <label className={myPageStyles.infoLabel}>이메일</label>
                                <span className={myPageStyles.infoValue}>{user.userEmail}</span>
                            </div>
                            <div className={myPageStyles.infoItem}>
                                <label className={myPageStyles.infoLabel}>소셜 타입</label>
                                <span className={myPageStyles.infoValue}>{user.socialType}</span>
                            </div>
                        </div>

                        {isEditing && (
                            <div className={myPageStyles.actionButtons}>
                                <button onClick={handleSave} className={myPageStyles.saveButton}>
                                    저장
                                </button>
                                <button onClick={handleCancel} className={myPageStyles.cancelButton}>
                                    취소
                                </button>
                            </div>
                        )}
                    </div>

                    {/* 즐겨찾기 자격증 섹션 */}
                    <div className={myPageStyles.infoCard}>
                        <div className={myPageStyles.cardHeader}>
                            <h3 className={myPageStyles.cardTitle}>즐겨찾기 자격증</h3>
                            <button className={myPageStyles.viewButton}  onClick={() => setShowFavoriteModal(true)}>목록 확인</button>
                        </div>
                        <div className={myPageStyles.favoritesGrid}>
                            {favoriteInfo.map((favorite) => (
                                <div
                                    key={favorite.type_id}
                                    className={myPageStyles.favoriteItem}
                                    onClick={() => navigate(`/${favorite.type === "department" ? "departments" : favorite.type}/${favorite.type_id}`)}

                                >
                                    <div className={myPageStyles.favoriteIcon}>📋</div>
                                    <div className={myPageStyles.favoriteInfo}>
                                        <h4 className={myPageStyles.favoriteName}>{favorite.name}</h4>
                                        <p className={myPageStyles.favoriteCategory}>{favorite.type}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/*cbt 기록 컴포넌트 */}
                   <CbtHistoryList/>


                    <FavoriteModal
                        show={showFavoriteModal}
                        onClose={() => setShowFavoriteModal(false)}
                        favoriteInfo={favoriteInfo}
                        handleDelete={handleDelete}
                    />


                    {/*/!* 계정 관리 섹션 *!/*/}
                    {/*<div className={myPageStyles.accountCard}>*/}
                    {/*    <div className={myPageStyles.cardHeader}>*/}
                    {/*        <h3 className={myPageStyles.cardTitle}>계정 관리</h3>*/}
                    {/*    </div>*/}
                    {/*    <div className={myPageStyles.accountActions}>*/}
                    {/*        <button className={myPageStyles.deleteButton}>계정 삭제</button>*/}
                    {/*    </div>*/}
                    {/*</div>*/}

                    {/*/!* 관리자 회원 관리 섹션 *!/*/}
                    {/*{isAdmin && (*/}
                    {/*    <div className={myPageStyles.infoCard}>*/}
                    {/*        <div className={myPageStyles.cardHeader}>*/}
                    {/*            <h3 className={myPageStyles.cardTitle}>회원 관리</h3>*/}
                    {/*        </div>*/}
                    {/*        <div className={myPageStyles.membersList}>*/}
                    {/*            {members.map((member) => (*/}
                    {/*                <div key={member.id} className={myPageStyles.memberItem}>*/}
                    {/*                    <div className={myPageStyles.memberInfo}>*/}
                    {/*                        <div className={myPageStyles.memberAvatar}>*/}
                    {/*                            <span className={myPageStyles.avatarText}>{member.name.charAt(0)}</span>*/}
                    {/*                        </div>*/}
                    {/*                        <div className={myPageStyles.memberDetails}>*/}
                    {/*                            <h4 className={myPageStyles.memberName}>{member.name}</h4>*/}
                    {/*                            <p className={myPageStyles.memberEmail}>{member.email}</p>*/}
                    {/*                        </div>*/}
                    {/*                        <div className={myPageStyles.memberStatus}>*/}

                    {/*                        </div>*/}
                    {/*                    </div>*/}
                    {/*                    <div className={myPageStyles.memberActions}>*/}
                    {/*                        <button*/}
                    {/*                            onClick={() => handleMemberAction(member.id, "delete")}*/}
                    {/*                            className={myPageStyles.deleteButton}*/}
                    {/*                        >*/}
                    {/*                            삭제*/}
                    {/*                        </button>*/}
                    {/*                    </div>*/}
                    {/*                </div>*/}
                    {/*            ))}*/}
                    {/*        </div>*/}
                    {/*    </div>*/}
                    {/*)}*/}
                </div>
            </main>
        </div>
    )
}
