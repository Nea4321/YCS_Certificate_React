import React, {useState} from "react";
import {useNavigate} from "react-router-dom";
import {GithubLogin, GoogleLogin, LoginRequest, NaverLogin} from "@/features/login";
import {setUser} from "@/shared/slice";
import {useDispatch} from "react-redux";

// 추가 해야 하는것들
// 1. 깃허브,카카오,네이버 등등 다른 소셜 로그인 구현
// 2. 진짜 시간 남으면 아이디,비번 찾기 구현하기 ( 안 할 듯 )

/**
 * 로그인 처리 기능 모아 놓은 곳.
 *
 * @returns formData (입력한 데이터)
 * @returns error
 * @returns handleInputChange (formdata에 최신화)
 * @returns handleSocialLogin (소셜 로그인 기능)
 * @returns handleSubmit (일반 로그인 기능)
 * */
export const LoginForm = () => {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    })
    const [error, setError] = useState("")
    const navigate = useNavigate()
    const dispatch = useDispatch()
    // const { checkAccessTokenExpired } = CheckTokenRequest()

    /**
     * 입력 정보를 formData에 최신화
     *
     * 입력이 발생하면 { ex) cjh@55 -> email : cjh@55 } 로 변환 후 formData에 최신화*/
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }))
        if (error) setError("")
    }

    /**
     * 로그인 정보 전달.
     *
     * 1. 로그인 정보 백엔드에 전달
     * 2. 백엔드에서 토큰을 전달함.
     * 2-1. 오류 생기면 에러 전달하고
     * 2-2. 정상 작동하면 토큰전달
     * 3. 받은 토큰으로 redux에 저장
     * 4. 그 후 메인 페이지로 이동
     * */
    const handleSubmit = async (e: React.FormEvent) => {

        e.preventDefault()

        if (!formData.email || !formData.password) {
            setError("이메일과 비밀번호를 입력해주세요.")
            return
        }

        setError("")

        try {
            // 로그인 api 호출 -> db 값 맞는지 확인 후 유저정보 넘겨줌.
            const data = await LoginRequest({
                email: formData.email,
                password: formData.password,
            });

            //slice 에 유저 데이터 저장
            if (data) {
                dispatch(setUser({
                    userName: data.userName || '',
                    userEmail: data.email || '',
                    socialType: data.socialType || 'NORMAL',
                    tokenExp: data.exp || 0,
                }))
                console.log("exp : " , data.exp)
                // // 액세스 토큰 만료 기간 체크 (타이머 설정 으로 자동으로 체크 후 갱신함.)
                // await checkAccessTokenExpired(data.exp)

                console.log("로그인 성공:")
                navigate("/")

            }

        } catch (error) {
            if (error instanceof Error) {
                setError(error.message);
            } else setError("알 수 없는 로그인 에러")
        }
    }


        /**
         *  소셜 로그인 하는 곳.
         *
         *  여긴 그저 소셜 로그인 팝업 창을 여는 곳임.
         *  리다이렉트 되는 사이트 에서 소셜 로그인 관련 처리를함 (SocialLoginHandler.tsx).
         * */
        const handleSocialLogin = async (provider: string) => {
            setError("")

            try {
                console.log(`${provider} 로그인 시도`)
                if (provider === "google") GoogleLogin()
                if (provider === "naver") NaverLogin()
                if (provider === "github") GithubLogin()

                console.log(`${provider} 로그인 성공`)
            } catch (error) {
                console.error(error)
                setError(`${provider} 로그인에 실패했습니다.`)
            }
        }
        return {formData, error, handleInputChange, handleSocialLogin, handleSubmit}

    }