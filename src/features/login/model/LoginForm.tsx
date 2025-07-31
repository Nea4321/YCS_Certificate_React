import React, {useState} from "react";
import {useNavigate} from "react-router-dom";
import {GoogleLogin} from "@/features/login";

// 로그인 추가해야 할 기능들
// 1. 로그인 api 추가 (백엔드)
// 1-1. 로그인 한 정보가 유저 DB에 있는지 확인
// 1-2. 없으면 유저 DB에 등록
// 1-3. 유저 DB에 입력한 정보 (이메일,비밀번호)가 맞는지 확인 후 안 맞으면 에러 전달
// 1-4. 로그인 되면 세션 or 쿠키 or jwt 를 이용해 값 전달하기
// 2. 깃허브,카카오,네이버 등등 다른 소셜 로그인 구현
// 3. 소셜 로그인 하면 유저 DB에 등록하기
// 4. 진짜 시간 남으면 아이디,비번 찾기 구현하기 ( 안 할 듯 )


export const LoginForm = () => {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    })
    const [error, setError] = useState("")
    const navigate = useNavigate()

    /// 입력이 발생하면 { ex) cjh@55 -> email : cjh@55 } 로 변환 후 formData에 최신화
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }))
        if (error) setError("")
    }

    /**
     * 로그인 정보 전달.
     *
     * 기존 : 로그인 하면 처리기능 대신 1.5초 대기함.<br>
     * 개선 예정 : 로그인 처리 기능 (입력한 정보가 DB에 있는지 확인) 넣은 후 기다리는 함수 삭제
     * */
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!formData.email || !formData.password) {
            setError("이메일과 비밀번호를 입력해주세요.")
            return
        }

        setError("")

        try {
            // 실제 로그인 API 넣어야댐
            console.log("로그인 성공:", { email: formData.email })
            // 로그인 하면 임시적으로 email값 전달 -> 쿠키로 임시 사용중 개선 예정
            document.cookie = `user-key=${formData.email}; path=/`
            navigate("/");
        } catch (error) {
            console.error("login error : " + error)
            setError("로그인에 실패했습니다. 이메일과 비밀번호를 확인해주세요.")
        }
    }

    /// 소셜 로그인 하는 곳.
    const handleSocialLogin = async (provider: string) => {
        setError("")

        try {
            console.log(`${provider} 로그인 시도`)
            if (provider === "google") GoogleLogin()
            if (provider === "kakao") GoogleLogin()
            if (provider === "github") GoogleLogin()

            console.log(`${provider} 로그인 성공`)
        } catch (error) {
            console.error(error)
            setError(`${provider} 로그인에 실패했습니다.`)
        }
    }
    return {formData, error, handleInputChange, handleSocialLogin, handleSubmit}

}