import { useState, useEffect } from "react";
import "./VerifyEmail.css"; // ✅ 팝업 스타일 적용
import axios from "axios";

interface VerifyEmailModalProps {
    email: string;
    onClose: () => void; // 닫기 이벤트
    onVerified: () => void; // 인증 성공 시 실행
}

export const VerifyEmail = ({ email, onClose, onVerified }: VerifyEmailModalProps) => {
    const [code, setCode] = useState("");
    const [error, setError] = useState("");
    const [timeLeft, setTimeLeft] = useState(180); // 3분 (초 단위)
    const [isResending, setIsResending] = useState(false);

    // 3분 타이머 동작
    useEffect(() => {
        if (timeLeft <= 0) return;
        const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
        return () => clearInterval(timer);
    }, [timeLeft]);

    const handleVerify = async () => {
        try {
            await axios.post("/api/auth/verify-code", null, {params: { email, code },});
            alert("이메일 인증이 완료되었습니다!");
            onVerified(); // 인증 성공 시 호출
            onClose();
        } catch (err) {
            setError("인증 코드가 올바르지 않습니다.");
        }
    };

    const handleResend = async () => {
        setIsResending(true);
        try {
            await axios.post("/api/auth/send-email", null, { params: { email } });
            setTimeLeft(180);
            alert("인증 코드가 재전송되었습니다.");
        } catch (err) {
            setError("재전송 실패 : ");
            console.log("이메일 재전송 에러 : ",err);
        } finally {
            setIsResending(false);
        }
    };

    return (
        <div className="modalOverlay">
            <div className="modalContent">
                <h2>이메일 인증</h2>
                <p>{email} 로 인증 코드를 보냈습니다.</p>
                <input
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="인증 코드를 입력하세요"
                />
                {error && <p className="error">{error}</p>}
                <p>
                    남은 시간: {Math.floor(timeLeft / 60)}:
                    {String(timeLeft % 60).padStart(2, "0")}
                </p>

                <button onClick={handleVerify}>인증 확인</button>
                <button onClick={handleResend} disabled={isResending}>
                    {isResending ? "전송 중..." : "코드 재전송"}
                </button>
                <button onClick={onClose}>닫기</button>
            </div>
        </div>
    );
};