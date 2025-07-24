/// 팝업창 옵션 설정하는 함수
export function GetPopupOptions(width: number, height: number): string {
    const left = window.screenX + (window.innerWidth - width) / 2
    const top = window.screenY + (window.innerHeight - height) / 2

    return `height=${height},width=${width},left=${left},top=${top},scrollbars=yes,resizable=yes`
}

