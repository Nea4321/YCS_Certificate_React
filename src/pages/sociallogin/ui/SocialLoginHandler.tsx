import {useCallback, useEffect, useRef, useState} from 'react'
import { useSearchParams, useParams } from 'react-router-dom'
import {SocialLoginRequest} from "@/features/login";

/**
 * 소셜 로그인 후 콜백 처리하는 컴포넌트
 *
 * 팝업창에서 로그인을 하고나면 정상적으로 처리가 됬는지 확인이 필요함 -> 클라이언트 리다이렉트 주소가 그 역할을 함. (.env 안에 있는 거)
 * 확인하려면 어디에서 로그인 했는지, 거기에서 제공하는 코드 [ socialType(string), code(string) ] 이 필요함.
 * url 에서 해당  `socialType`과 `code`를 얻어서 확인을 하는 함수(hadlelogin)에 전달을 함.
 * 함수의 반환값("status")에 따라 로그인 처리 상태를 렌더링 하는게 이 컴포넌트의 최종 목적.
 *
 *  @component
 *  @example
 *  // 라우팅 예시
 *  <Route path="/social_login/:socialType" element={<SocialLogin />} />
 *  // 해당 사이트를 이용하는 url 예시
 *  localhost:5173/social_login/google?code=adskjf...
 *  url 에서 socialType = google,  code = adskjf... 을 등록하게 됨.
 */
export const SocialLoginHandler = () => {
    //소셜 로그인 후 리다이렉트 되는 주소 에서 socialType을 가져옴.
    const { socialType } = useParams<{ socialType: string }>()
    // ? 뒤에 붙는 파라미터를 읽음
    const [searchParams] = useSearchParams()
    // ?code=~~ 형태에서 code 값 추출
    const code = searchParams.get('code')

    // 로그인 상태 관리 함수
    const [status, setStatus] = useState<'IDLE' | 'SUCCESS' | 'FAIL'>('IDLE')

    // 1회 실행 체크용 useRef
    const hasRun = useRef(false)
    /**
     * 로그인 정상 처리 확인 함수
     *
     * 기존 : feature/login/api 안에 Checklogin.tsx 컴포넌트를 만들어 위 함수랑 아래 함수를 사용하는 컴포넌트를 만듬.
     * 문제 : Checklogin.tsx를 불러서 사용하면 아래 useEffect() 에 문제 발생 ( 아래 useEffect() 에다가 문제 생기는 이유 적어놓음 )
     * 해결 : Checklogin.tsx 파일 없애고 해당 코드를 여기에다가 옮김.
     *
     * @param socialType(string), code(string)
     * */
    const handleLogin = useCallback(async (socialType: string, code: string) => {
        try {
            const data = await SocialLoginRequest({ code, socialType })
            setStatus('SUCCESS')
            document.cookie = `user-key=${data.email}; path=/`
            window.opener.location.replace('/')
            window.close()
        } catch (error) {
            console.error('Login error:', error)
            setStatus('FAIL')
        }
    }, [])


    /**
     * code,socialType,handleLogin 이 바뀌면 ( google 로그인 했다가 kakao 로그인을 하면 ) handleLogin 실행.
     *
     * 문제점 : [code,social~~] 값이 바뀔 때 마다 함수 handleLogin() 생성 -> 기능은 같은데 참조값이 다른 쓸모없는 함수 발생 -> 경고 생성
     * 개선 : handleLogin에다가 useCallback() 을 사용해 한번만 생성 되게끔 만듬
     * .catch() 쓴 이유 -> handleLogin() 이 async(비동기) 함수임 -> promise객체를 반환 -> promise 처리가 없음 -> 예외 처리로 경고 제거
     *
     * */

    useEffect(() => {
        if (!hasRun.current && code && socialType) {
            hasRun.current = true
            handleLogin(socialType, code).catch(console.error)
        }
    }, [code, socialType, handleLogin])

    return (
        <div>
            {status === 'IDLE' && <p>로그인 처리 중...</p>}
            {status === 'SUCCESS' && <p>로그인 성공</p>}
            {status === 'FAIL' && <p>로그인 실패</p>}
        </div>
    )
}
