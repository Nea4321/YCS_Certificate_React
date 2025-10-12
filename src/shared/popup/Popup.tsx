import React from "react";

interface PopupProps {
    isOpen: boolean;
    children: React.ReactNode;
}

/**
 * @example <Popup> <팝업으로 표시할 컴포넌트> </Popup>
 * */
export const Popup = ({ isOpen, children }: PopupProps) => {
    if (!isOpen) return null;


    return (
        <div style={{
            position: "fixed",
            top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center"
        }}>
            <div
                style={{
                    background: "white",
                    padding: 20,
                    borderRadius: 8,
                    width: "600px",   // ✅ 팝업 너비
                    height: "400px",  // ✅ 팝업 높이
                    maxWidth: "90vw", // 반응형 (화면 넘치지 않게)
                    maxHeight: "80vh",
                    overflowY: "auto", // 내용이 넘칠 경우 스크롤
                }}
            >
                {children}
            </div>
        </div>
    );
};
