import React, {useState} from "react";
import {GetCookie} from "@/features/login/cookie/GetCooKie.ts";

// 대시보드에 들어가야할 기능들
// 1. 로그인한 정보(아이디,이메일,비밀번호,가입일,소셜타입(구글,기본,카카오...)) 표시하기
// 2. 개인 정보들 수정 가능 하게 하기
// 2-1. 수정 버튼 눌렀을 때 비밀번호도 수정 가능하게
// 3. 계정삭제 기능 구현 하기
// 3-1. 삭제 하면 자동으로 메인페이지 이동 후 세션 or 쿠키 or jwt 등 다 유저정보 다 삭제 ( 로그아웃 로직 사용? )
// 4. 로그인을 안 했으면 마이페이지 못 들어가게 -> 현재 : 주소로 입력하면 들어가짐.
// 5. 즐겨찾기 기능들 추가하기 ( 이건 제일 나중에 로그인,회원가입,소셜 로그인 기능 다끝나고 만들 예정 )
// 6. 기본 로그인 정보랑 소셜 로그인 정보랑 동일한 정보 띄우기


export const MyPageForm =()=>{
    const [userInfo] = useState({
        name: "조재현(하드코딩)",
        email: GetCookie("user-key"),
        joinDate: "2024.01.15(하드코딩)",
        lastLogin: "2024.07.31 10:30(하드코딩)",
        socialType: "google(하드코딩)"
    })
    const [isEditing, setIsEditing] = useState(false)
    const [editData, setEditData] = useState({
        name: userInfo.name,
        email: userInfo.email,
    })
    const [message, setMessage] = useState("")

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setEditData((prev) => ({
            ...prev,
            [name]: value,
        }))
        if (message) setMessage("")
    }

    const handleEdit = () => {
        setIsEditing(true)
        setEditData({
            name: userInfo.name,
            email: userInfo.email,
        })
    }

    const handleCancel = () => {
        setIsEditing(false)
        setEditData({
            name: userInfo.name,
            email: userInfo.email,
        })
        setMessage("")
    }

    const handleSave = async () => {
        if (!editData.name || !editData.email) {
            setMessage("이름과 이메일을 입력해주세요.")
            return
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(editData.email)) {
            setMessage("올바른 이메일 형식을 입력해주세요.")
            return
        }
        setMessage("")

        try {
            //API 호출 해야댐

            console.log("프로필 업데이트:", editData)
            setMessage("프로필이 성공적으로 업데이트되었습니다.")
            setIsEditing(false)

        } catch (error) {
            console.log(error)
            setMessage("프로필 업데이트 중 오류가 발생했습니다.")
        }
    }
    return{userInfo,isEditing,editData,message,handleInputChange,handleEdit,handleCancel,handleSave}
}