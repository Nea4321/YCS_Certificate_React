import { authStyles } from "../styles"
import {SingupForm} from "@/features/login";

interface SignupProps {
    onSwitchToLogin: () => void
}

export const Signup = ({ onSwitchToLogin }: SignupProps) => {
    const { formData,error,success,handleInputChange,handleSubmit } = SingupForm(onSwitchToLogin)
    return (
        <div className={authStyles.formWrapper}>
            <form onSubmit={handleSubmit} className={authStyles.form}>
                <div className={authStyles.formHeader}>
                    <h1 className={authStyles.title}>회원가입</h1>
                    <p className={authStyles.subtitle}>새 계정을 만들어 자격지신을 이용해 보세요!</p>
                </div>

                {error && <div className={`${authStyles.message} ${authStyles.error}`}>{error}</div>}
                {success && <div className={`${authStyles.message} ${authStyles.success}`}>{success}</div>}

                <div className={authStyles.formFields}>
                    <div className={authStyles.fieldGroup}>
                        <label htmlFor="name" className={authStyles.label}>
                            이름
                        </label>
                        <input
                            id="name"
                            name="name"
                            type="text"
                            value={formData.name}
                            onChange={handleInputChange}
                            className={authStyles.input}
                            placeholder="이름을 입력하세요"
                        />
                    </div>

                    <div className={authStyles.fieldGroup}>
                        <label htmlFor="email" className={authStyles.label}>
                            이메일
                        </label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            className={authStyles.input}
                            placeholder="이메일을 입력하세요"
                        />
                    </div>

                    <div className={authStyles.fieldGroup}>
                        <label htmlFor="password" className={authStyles.label}>
                            비밀번호
                        </label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            className={authStyles.input}
                            placeholder="비밀번호를 입력하세요"
                        />
                    </div>

                    <div className={authStyles.fieldGroup}>
                        <label htmlFor="confirmPassword" className={authStyles.label}>
                            비밀번호 확인
                        </label>
                        <input
                            id="confirmPassword"
                            name="confirmPassword"
                            type="password"
                            value={formData.confirmPassword}
                            onChange={handleInputChange}
                            className={authStyles.input}
                            placeholder="비밀번호를 다시 입력하세요"
                        />
                    </div>
                </div>

                <button type="submit" className={authStyles.submitButton}>회원가입</button>

                <div className={authStyles.signupPrompt}>
                    <p className={authStyles.signupText}>이미 계정이 있으신가요?</p>
                    <button type="button" onClick={onSwitchToLogin} className={authStyles.signupLink} >
                        로그인
                    </button>
                </div>
            </form>
        </div>
    )
}
