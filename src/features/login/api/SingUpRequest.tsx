import axios from "axios";

interface userInfo {
    email: string;
    password: string;
    name: string;
    socialType: string;
}

export const SingUpRequest = async ({ email,name,password,socialType }: userInfo) => {
    return axios.post('/api/auth/singup', {
        userName: name,
        userEmail: email,
        userPassword: password,
        socialType: socialType,
    })
}