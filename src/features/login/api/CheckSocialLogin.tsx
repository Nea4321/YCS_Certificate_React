import { useState } from 'react'
import { GetToken } from '../api/GetToken.tsx'

/**
 * 소셜(구글..) 로그인 정상 처리 됬는지 확인하는 함수.
 * @returns IDLE (기본값, 기능 동작 안할 때), SUCCESS(성공), FAIL(연결 실패)
 */

export const CheckSocialLogin = () => {
  const [status, setStatus] = useState<'IDLE' | 'SUCCESS' | 'FAIL'>('IDLE')

  /// 로그인 처리 확인 함수
  const handleLogin = async (socialType: string, code: string) => {
    try {
      const data = await GetToken({ code, socialType })
      setStatus('SUCCESS')
      //document.cookie = `user-key=${data.id}; path=/`
      window.opener.location.replace('/')
      window.close()
    } catch (error) {
      /// 이 아래 두줄 코드는 로그인이 완료되면 팝업창이 닫히고 메인페이지로 이동되는 코드 임.
      /// 현재 백엔드 구현 안돼서 실패해도 닫히고 이동되게 함. 백엔드 구현하면 수정 예정 
      window.opener.location.replace('/')
      window.close()
      
      console.error('Login error:', error)
      setStatus('FAIL')
    }
  }

  return { status, handleLogin }
}
