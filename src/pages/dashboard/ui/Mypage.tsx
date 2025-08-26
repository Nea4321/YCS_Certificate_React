import { myPageStyles } from "../styles"
import { MyPageForm } from "@/features/login"
import { useState } from "react"
import {useNavigate} from "react-router-dom";

export const MyPage = () => {
    const { userInfo, isEditing, message, editData, handleEdit, handleSave, handleCancel, handleInputChange } = MyPageForm()
    const navigate = useNavigate()
    const [isAdmin] = useState(true) // 관리자 여부 (실제로는 userInfo에서 가져와야 함)
    const [members] = useState([
        { id: 1, name: "김철수", email: "kim@example.com"},
        { id: 2, name: "이영희", email: "lee@example.com" },
        { id: 3, name: "박민수", email: "park@example.com"},
    ])

    const [favorites] = useState([
        { id: 1, name: "정보처리기사", category: "IT", url: "certificate/273" },
        { id: 2, name: "컴활 1급", category: "Office", url: "/certificates/computer-activity" },
        { id: 3, name: "SQLD", category: "Database", url: "/certificates/sqld" },
        { id: 4, name: "토익", category: "Language", url: "/certificates/toeic" },
    ])

    const handleMemberAction = (memberId: number, action: "delete" | "suspend" | "activate") => {
        console.log(`${action} member with ID: ${memberId}`)
        // 실제 구현에서는 API 호출
    }

    const handleFavoriteClick = (url: string) => {
        console.log(`Navigate to: ${url}`)
        navigate(`/${url}`)
        // 실제 구현에서는 router.push(url) 사용
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
                                <span className={myPageStyles.avatarText}>{userInfo.name.charAt(0)}</span>
                            </div>
                            <div className={myPageStyles.profileInfo}>
                                <h2 className={myPageStyles.profileName}>{userInfo.name}</h2>
                                <p className={myPageStyles.profileEmail}>{userInfo.email}</p>
                                {isAdmin && <span className={myPageStyles.adminBadge}>관리자</span>}
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
                                    <span className={myPageStyles.infoValue}>{userInfo.name}</span>
                                )}
                            </div>

                            <div className={myPageStyles.infoItem}>
                                <label className={myPageStyles.infoLabel}>이메일</label>
                                <span className={myPageStyles.infoValue}>{userInfo.email}</span>
                            </div>
                            <div className={myPageStyles.infoItem}>
                                <label className={myPageStyles.infoLabel}>소셜 타입</label>
                                <span className={myPageStyles.infoValue}>{userInfo.socialType}</span>
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
                        </div>
                        <div className={myPageStyles.favoritesGrid}>
                            {favorites.map((favorite) => (
                                <div
                                    key={favorite.id}
                                    className={myPageStyles.favoriteItem}
                                    onClick={() => handleFavoriteClick(favorite.url)}
                                >
                                    <div className={myPageStyles.favoriteIcon}>📋</div>
                                    <div className={myPageStyles.favoriteInfo}>
                                        <h4 className={myPageStyles.favoriteName}>{favorite.name}</h4>
                                        <p className={myPageStyles.favoriteCategory}>{favorite.category}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* 계정 관리 섹션 */}
                    <div className={myPageStyles.accountCard}>
                        <div className={myPageStyles.cardHeader}>
                            <h3 className={myPageStyles.cardTitle}>계정 관리</h3>
                        </div>
                        <div className={myPageStyles.accountActions}>
                            <button className={myPageStyles.deleteButton}>계정 삭제</button>
                        </div>
                    </div>

                    {/* 관리자 회원 관리 섹션 */}
                    {isAdmin && (
                        <div className={myPageStyles.infoCard}>
                            <div className={myPageStyles.cardHeader}>
                                <h3 className={myPageStyles.cardTitle}>회원 관리</h3>
                            </div>
                            <div className={myPageStyles.membersList}>
                                {members.map((member) => (
                                    <div key={member.id} className={myPageStyles.memberItem}>
                                        <div className={myPageStyles.memberInfo}>
                                            <div className={myPageStyles.memberAvatar}>
                                                <span className={myPageStyles.avatarText}>{member.name.charAt(0)}</span>
                                            </div>
                                            <div className={myPageStyles.memberDetails}>
                                                <h4 className={myPageStyles.memberName}>{member.name}</h4>
                                                <p className={myPageStyles.memberEmail}>{member.email}</p>
                                            </div>
                                            <div className={myPageStyles.memberStatus}>

                                            </div>
                                        </div>
                                        <div className={myPageStyles.memberActions}>
                                            <button
                                                onClick={() => handleMemberAction(member.id, "delete")}
                                                className={myPageStyles.deleteButton}
                                            >
                                                삭제
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    )
}
