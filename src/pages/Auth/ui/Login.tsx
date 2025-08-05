import { authStyles } from "../styles"
import {LoginForm} from "@/features/login";



interface LoginProps {
    onSwitchToSignup: () => void
}

export const Login = ({ onSwitchToSignup }: LoginProps) => {
    const { formData, error, handleInputChange, handleSocialLogin, handleSubmit } = LoginForm()
    return (
        <div className={authStyles.formWrapper}>
            <form onSubmit={handleSubmit} className={authStyles.form}>
                <div className={authStyles.formHeader}>
                    <h1 className={authStyles.title}>로그인</h1>
                    <p className={authStyles.subtitle}>로그인하고 자격지신을 100% 이용해보세요!</p>
                </div>

                {error && <div className={`${authStyles.message} ${authStyles.error}`}>{error}</div>}

                <div className={authStyles.formFields}>
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
                </div>

                <button type="submit" className={authStyles.submitButton} >로그인</button>

                <div className={authStyles.divider}>
                    <span className={authStyles.dividerText}>또는</span>
                </div>

                <div className={authStyles.socialButtons}>
                    <button
                        type="button"
                        onClick={() => handleSocialLogin("google")}
                        className={`${authStyles.socialButton} ${authStyles.googleButton}`}
                    >
                        <svg className={authStyles.socialIcon} viewBox="0 0 24 24">
                            <path
                                fill="#4285F4"
                                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                            />
                            <path
                                fill="#34A853"
                                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                            />
                            <path
                                fill="#FBBC05"
                                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                            />
                            <path
                                fill="#EA4335"
                                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                            />
                        </svg>
                        Google로 로그인
                    </button>

                    <button
                        type="button"
                        onClick={() => handleSocialLogin("github")}
                        className={`${authStyles.socialButton} ${authStyles.githubButton}`}
                    >
                        <svg className={authStyles.socialIcon} viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                        </svg>
                        GitHub로 로그인
                    </button>

                    <button
                        type="button"
                        onClick={() => handleSocialLogin("kakao")}
                        className={`${authStyles.socialButton} ${authStyles.kakaoButton}`}
                    >
                        <svg className={authStyles.socialIcon} viewBox="0 0 24 24">
                            <path
                                fill="currentColor"
                                d="M12 3c5.799 0 10.5 3.664 10.5 8.185 0 4.52-4.701 8.184-10.5 8.184a13.5 13.5 0 0 1-1.727-.11l-4.408 2.883c-.501.265-.678.236-.472-.413l.892-3.678c-2.88-1.46-4.785-3.99-4.785-6.866C1.5 6.665 6.201 3 12 3z"
                            />
                        </svg>
                        카카오로 로그인
                    </button>
                </div>

                <div className={authStyles.signupPrompt}>
                    <p className={authStyles.signupText}>계정이 없으신가요?</p>
                    <button type="button" onClick={onSwitchToSignup} className={authStyles.signupLink}>
                        회원가입
                    </button>
                </div>
            </form>
        </div>
    )
}
