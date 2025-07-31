import React, {useState} from "react";

// 회원가입에 들어가야 하는 기능
// 1. 회원 가입 하면 유저 DB에 등록하기


export const SingupForm =(onSwitchToLogin: () => void)=>{
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
    })
    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")

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

        setError("")
        setSuccess("")

        try {
            //  회원가입 API 넣어야댐
            // 유저정보 백엔드로 넘기기 -> 백엔드에서 유저DB에 정보 저장하기

            console.log("회원가입 성공:", {
                name: formData.name,
                email: formData.email,
            })

            setSuccess("회원가입이 완료되었습니다! 로그인 페이지로 이동합니다.")

            // 2초 후 로그인 페이지로 이동
            setTimeout(() => {
                onSwitchToLogin()
            }, 2000)

        } catch (err) {
            console.log("auth err : " + err)
            setError("회원가입 중 오류가 발생했습니다. 다시 시도해주세요.")
        }
    }
    return{formData,error,success,handleSubmit,handleInputChange}
}