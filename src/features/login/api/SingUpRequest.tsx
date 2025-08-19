import axios from "axios";

/**
 * 백엔드에 전달할 유저정보 인터페이스
 * */
interface userInfo {
    email: string;
    password: string;
    name: string;
    socialType: string;
}

/**
 * 회원가입 하는 곳.
 *
 * 1. 백엔드에서 유저 정보를 받으면 DB에서 체크함
 * 1-1. 유저 정보가 있으면 에러 메시지 전달
 * 1-2 . 없으면 성공 메시지 전달 (200 상태코드)
 *
 * @param email (string)
 * @param name (string)
 * @param password (string)
 * @param socialType (string)
 * @returns Response<?>
 * */
export const SingUpRequest = async ({ email,name,password,socialType }: userInfo) => {
        return axios.post('/api/auth/singup', {
            userName: name,
            userEmail: email,
            userPassword: password,
            socialType: socialType,
        })
}