import { useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import {CheckSocialLogin} from "@/features/login";


interface Props {
    socialType: string
}

/**
 *
 * @param socialType(string)
 * @constructor
 */
export const SocialLoginHandler = ({ socialType }: Props) => {
    // ? 뒤에 붙는 파라미터를 읽음
    const [searchParams] = useSearchParams()
    // ?code=~~ 형태에서 code 값 추출
    const code = searchParams.get('code')
    const { status, handleLogin } = CheckSocialLogin()

    useEffect(() => {
        if (code) { handleLogin(socialType, code) }
    }, [code, socialType])

    return (
        <div>
            {status === 'IDLE' && <p>로그인 처리 중...</p>}
            {status === 'SUCCESS' && <p>로그인 성공</p>}
            {status === 'FAIL' && <p>로그인 실패</p>}
        </div>
    )
}
