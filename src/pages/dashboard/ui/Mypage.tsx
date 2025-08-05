import { myPageStyles } from "../styles"
import {MyPageForm} from "@/features/login";

export const MyPage = () => {
    const {userInfo,isEditing,message,editData,handleEdit,handleSave,handleCancel,handleInputChange}=MyPageForm()
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
                            </div>
                        </div>
                    </div>

                    {/* 정보 수정 섹션 */}
                    <div className={myPageStyles.infoCard}>
                        <div className={myPageStyles.cardHeader}>
                            <h3 className={myPageStyles.cardTitle}>개인정보</h3>
                            {!isEditing && (
                                <button onClick={handleEdit} className={myPageStyles.editButton} >
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
                                {isEditing ? (
                                    <input
                                        name="email"
                                        type="email"
                                        value={editData.email ?? ""}
                                        onChange={handleInputChange}
                                        className={myPageStyles.input}
                                    />
                                ) : (
                                    <span className={myPageStyles.infoValue}>{userInfo.email}</span>
                                )}
                            </div>

                            <div className={myPageStyles.infoItem}>
                                <label className={myPageStyles.infoLabel}>가입일</label>
                                <span className={myPageStyles.infoValue}>{userInfo.joinDate}</span>
                            </div>

                            <div className={myPageStyles.infoItem}>
                                <label className={myPageStyles.infoLabel}>최근 로그인</label>
                                <span className={myPageStyles.infoValue}>{userInfo.lastLogin}</span>
                            </div>
                            <div className={myPageStyles.infoItem}>
                                <label className={myPageStyles.infoLabel}>소셜 타입</label>
                                <span className={myPageStyles.infoValue}>{userInfo.socialType}</span>
                            </div>
                        </div>

                        {isEditing && (
                            <div className={myPageStyles.actionButtons}>
                                <button onClick={handleSave} className={myPageStyles.saveButton}>저장</button>
                                <button onClick={handleCancel} className={myPageStyles.cancelButton}>취소</button>
                            </div>
                        )}
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
                </div>
            </main>
        </div>
    )
}
