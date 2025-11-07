import React, {useEffect, useState} from "react";
import {SingUpRequest} from "@/features/login";
import axios from "axios";

/**
 * 회원가입 처리 기능 모음.
 * */
export const SingupForm =(onSwitchToLogin: () => void)=>{
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
    })
    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")

    const [showVerify, setShowVerify] = useState(false); // 이메일 인증 모달 표시 여부
    const [verifiedEmail, setVerifiedEmail] = useState(""); // 인증 완료된 이메일 저장
    const closeVerifyModal = () => {setShowVerify(false);};
    // 작동 방식은 LoginForm.tsx 에 있는것과 비슷함.
    // 그래서 주석 생략
    useEffect(() => {
        if (verifiedEmail && verifiedEmail !== formData.email) {
            console.log("이메일 변경 감지 → 인증 초기화");
            setVerifiedEmail("");
        }
    }, [formData.email, verifiedEmail]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }))
        if (error) setError("")
        if (success) setSuccess("")
    }

    const validateForm = () => {
        if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
            setError("모든 필드를 입력해주세요.")
            return false
        }

        if (formData.password !== formData.confirmPassword) {
            setError("비밀번호가 일치하지 않습니다.")
            return false
        }

        if (formData.password.length < 1) {
            setError("비밀번호는 1자 이상이어야 합니다.")
            return false
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(formData.email)) {
            setError("올바른 이메일 형식을 입력해주세요.")
            return false
        }

        return true
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!validateForm()) return
        if (!verifiedEmail || verifiedEmail !== formData.email) {
            setError("이메일 인증이 필요합니다.");
            try {
                setShowVerify(true);
                await axios.post("/api/auth/send-email", null, { params: { email: formData.email } });
                console.log("이메일 인증 요청 전송됨");
            } catch (err) {
                console.error("이메일 전송 실패:", err);
                setError("이메일 인증 요청 실패");
            }
            return;
        }

        setError("")
        setSuccess("");

        try
        {
            // 백엔드에 회원정보 저장 요청
               await SingUpRequest({
                email: formData.email,
                name: formData.name,
                password: formData.password,
                socialType: "normal"
            });

            console.log("회원가입 성공:", {
                name: formData.name,
                email: formData.email,
            })
            setSuccess("회원가입이 완료되었습니다! 로그인 페이지로 이동합니다.")
            // 2초 후 로그인 페이지로 이동
            setTimeout(() => {
                onSwitchToLogin()
            }, 2000)

        } catch (error) {
            if (axios.isAxiosError(error)) {
                setError(error.response?.data || "회원가입 중 오류 발생");
            } else {setError("알 수 없는 오류 발생");}
        }
    }
    return{formData, error, success, handleSubmit, handleInputChange, showVerify, closeVerifyModal,setShowVerify,setVerifiedEmail,verifiedEmail}
}