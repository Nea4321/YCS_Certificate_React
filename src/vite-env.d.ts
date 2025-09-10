/// .d.ts -> 타입스크리트가 자동으로 인식 함.

declare module '*.css' {
    const classes: { [key: string]: string };
    export = classes;
}

declare module '*.scss' {
    const classes: { [key: string]: string };
    export = classes;
}

declare module '*.sass' {
    const classes: { [key: string]: string };
    export = classes;
}

declare module '*.less' {
    const classes: { [key: string]: string };
    export = classes;
}

/**
 * env 타입 지정 오류 해결
 * readonly - 읽기전용
 * 각 환경변수들은 string 으로 타입 선언됨.
  */

interface ImportMetaEnv {
    readonly VITE_GOOGLE_CLIENT_ID: string
    readonly VITE_GOOGLE_REDIRECT_URI: string
    readonly VITE_NAVER_CLIENT_ID: string
    readonly VITE_NAVER_REDIRECT_URI: string
    readonly VITE_GITHUB_CLIENT_ID: string
    readonly VITE_GITHUB_REDIRECT_URI: string
}

/**
 * ImportMetaEnv를 env 타입으로 연결
 * 타입 선언 안 할 때 -> 환경 변수 타입 기본값 any 로 지정 -> 오타,값 없어도 컴파일 됨 -> 경고 생성
 * 타입 선언 할 때 -> 오타, 값 없으면 컴파일 에러 남 -> 경고 알아서 삭제
  */

interface ImportMeta {
    readonly env: ImportMetaEnv
}