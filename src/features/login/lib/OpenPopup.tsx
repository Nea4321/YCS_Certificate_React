/**
 *  팝업창 띄우는 함수
 *  @returns 열리면 Window 객체 안 열리면 null
 */
export function OpenPopup(url: string, options: string): Window | null {
    return window.open(url, '_blank', options)
}

