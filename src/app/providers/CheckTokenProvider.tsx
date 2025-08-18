import {useSelector} from "react-redux";
import {RootState} from "@/app/store";
import {CheckTokenRequest} from "@/features/login";
import {useEffect, ReactNode} from "react";

/**
 * 토큰을 체크하는 곳.
 *
 * 설명 : 최상위 컴포넌트에 토큰 체크 기능을 집어 넣음으로써 페이지에서 변화가 생길 때 마다 토큰을 체크함.
 * 토큰 체크 기능 - 타이머를 사용해서 액세스 토큰 만료 시간이 지나면 저장소를 초기화 함.
 *
 * 1. 매번 redux에 저장된 데이터를 가져옴
 * 2. redux에 저장된 토큰 만료 시간으로 토큰 체크 기능(타이머)를 실행함
 * 3. 만약 redux에 토큰 만료 시간이 없으면 ( ex) 로그아웃 상태 ) 이 함수는 return; 으로 바로 패스
 * */

export function CheckTokenProvider({ children }: { children: ReactNode }) {
    const user = useSelector((state: RootState) => state.user); // 유저 slice
    const { checkAccessTokenExpired } = CheckTokenRequest();

    useEffect(() => {
        if (!user?.tokenExp) return;
        void checkAccessTokenExpired(user?.tokenExp);
    },[checkAccessTokenExpired,user?.tokenExp]);

    return <>{children}</>
}



/**
 * TMI 부가설명
 *
 * 처음 로직 : 로그인 버튼을 눌렀을 때 토큰 체크 기능을 실행 시켜서 한번에 해결하려고 했음.
 * 문제점 : 자잘한 오류 + 새로고침 (랜더링) 이 발생 할 떄 마다 기존에 흐르는 타이머가 초기화됨. -> 토큰 체크 기능 작동 안함
 *
 * 지금 로직 : 최상위 컴포넌트에 넣어서 페이지 자체가 랜더링 될 때 마다 토큰 체크 기능을 실행함.
 * 해결 :
 *
 * */