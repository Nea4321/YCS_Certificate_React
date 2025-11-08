import React, {useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "@/app/store";
import axios from "axios";
import {setUser} from "@/shared/slice";

// 대시보드에 들어가야할 기능들
// 2. 개인 정보들 수정 가능 하게 하기
// 2-1. 수정 버튼 눌렀을 때 비밀번호도 수정 가능하게
// 3. 계정삭제 기능 구현 하기
// 5. 즐겨찾기 기능들 추가하기 ( 이건 제일 나중에 로그인,회원가입,소셜 로그인 기능 다끝나고 만들 예정 )

/**
 * 마이페이지 처리 기능 모은 곳.
 *
 * 현재 미완성임.
 * 아마 카카오,네이버,깃허브 소셜 로그인 구현 후 마이페이지 만들 듯.
 * */
export const MyPageForm =()=>{
    const dispatch = useDispatch();
    const user = useSelector((state: RootState) => state.user);

    const [isEditing, setIsEditing] = useState(false)
    const [editData, setEditData] = useState({name: user.userName,})
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
        setEditData({name:  user.userName,})
    }

    const handleCancel = () => {
        setIsEditing(false)
        setEditData({name:  user.userName,})
        setMessage("")
    }

    const handleSave = async () => {
        if (!editData.name) {
            setMessage("이름을 입력해주세요.")
            return
        }
        setMessage("")

        try {
            const response = await axios.post('/api/auth/update',  { name: editData.name }, { withCredentials: true, headers: { 'Content-Type': 'application/json' } });
            dispatch(setUser({
                ...user, // 기존 user 상태 유지
                userName: editData.name || '', // 이름만 덮어쓰기
            }))
            console.log("이름 업데이트:", response)
            setMessage("프로필이 성공적으로 업데이트되었습니다.")
            setIsEditing(false)

        } catch (error) {
            console.log(error)
            setMessage("이름 업데이트 중 오류가 발생했습니다.")
        }
    }
    return{user,isEditing,editData,message,handleInputChange,handleEdit,handleCancel,handleSave}
}