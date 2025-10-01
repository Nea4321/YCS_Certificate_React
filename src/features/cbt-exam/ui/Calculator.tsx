import React, { useState } from "react";
import { ExamStyles } from "@/widgets/cbt-exam/styles";

type BinOp = "+" | "-" | "*" | "/";

export function Calculator({ onClose }: { onClose: () => void }) {
    const [display, setDisplay] = useState<string>("0");
    const [acc, setAcc] = useState<number | null>(null);
    const [op, setOp] = useState<BinOp | null>(null);
    const [justEval, setJustEval] = useState(false);
    const [awaitingRight, setAwaitingRight] = useState(false); // ✅ 우항 입력 대기
    const [memory, setMemory] = useState<number | null>(null);

    const asNum = (s: string) => {
        if (s === "." || s === "-.") return 0;
        const n = Number(s);
        return Number.isFinite(n) ? n : 0;
    };

    const setError = () => {
        setDisplay("INFINITY");
        setAcc(null);
        setOp(null);
        setJustEval(true);
        setAwaitingRight(false);
    };

    const inputDigit = (d: string) => {
        setDisplay((prev) => {
            if (prev === "INFINITY") return d === "." ? "0." : d;

            // ✅ 연산자 직후(우항 첫 입력)이면 새로 시작
            if (awaitingRight) {
                setAwaitingRight(false);
                setJustEval(false);
                return d === "." ? "0." : d;
            }

            if (justEval) {
                setJustEval(false);
                return d === "." ? "0." : d;
            }
            if (d === ".") {
                if (prev.includes(".")) return prev;
                return prev === "" ? "0." : prev + ".";
            }
            if (prev === "0") return d; // 선행 0 제거
            return prev + d;
        });
    };

    const toggleSign = () => {
        setDisplay((prev) => {
            if (prev === "INFINITY") return prev;
            if (prev.startsWith("-")) return prev.slice(1);
            if (prev === "0") return "0";
            return "-" + prev;
        });
    };

    const percent = () => {
        if (display === "INFINITY") return;
        const cur = asNum(display);
        const base = acc ?? 0;
        const r = op ? base * (cur / 100) : cur / 100;
        setDisplay(String(r));
        setJustEval(false);
        setAwaitingRight(false);
    };

    const reciprocal = () => {
        if (display === "INFINITY") return;
        const cur = asNum(display);
        if (cur === 0) return setError();
        setDisplay(String(1 / cur));
        setJustEval(false);
        setAwaitingRight(false);
    };

    const sqrt = () => {
        if (display === "INFINITY") return;
        const cur = asNum(display);
        if (cur < 0) return setError();
        setDisplay(String(Math.sqrt(cur)));
        setJustEval(false);
        setAwaitingRight(false);
    };

    const clearEntry = () => {
        setDisplay("0");
        setJustEval(false);
        setAwaitingRight(false); // ✅ CE 후 바로 이어서 입력 가능
    };

    const clearAll = () => {
        setDisplay("0");
        setAcc(null);
        setOp(null);
        setJustEval(false);
        setAwaitingRight(false); // ✅ 완전 초기화
    };

    const compute = (a: number, b: number, oper: BinOp) => {
        switch (oper) {
            case "+":
                return a + b;
            case "-":
                return a - b;
            case "*":
                return a * b;
            case "/":
                return b === 0 ? NaN : a / b;
        }
    };

    const backspace = () => {
        if (display === "INFINITY") return;

        setDisplay((prev) => {

            if (prev === "0") return prev;

            let next = prev.slice(0, -1);

            if (next === "" || next === "-" || next === "-0") next = "0";

            setJustEval(false);

            if (awaitingRight) {
                setAcc(asNum(next));
            }

            return next;
        });
    };

    const pushOp = (next: BinOp) => {
        const cur = display === "INFINITY" ? 0 : asNum(display);

        if (acc === null) {
            setAcc(cur);
        } else if (!justEval && op) {
            const r = compute(acc, cur, op);
            if (!Number.isFinite(r)) return setError();
            setAcc(r as number);
            setDisplay(String(r));
        }

        setOp(next);
        setJustEval(false);
        setAwaitingRight(true);
    };

    const equals = () => {
        if (op == null || acc == null) {
            setJustEval(true);
            setAwaitingRight(false);
            return;
        }
        const cur = asNum(display);
        const r = compute(acc, cur, op);
        if (!Number.isFinite(r)) return setError();
        setDisplay(String(r));
        setAcc(null);
        setOp(null);
        setJustEval(true);
        setAwaitingRight(false);
    };

    // 메모리 기능
    const memClear = () => setMemory(0);
    const memRecall = () => {
        if (memory == null) return;

        if (op && awaitingRight) {
            setDisplay(String(memory));
            setAwaitingRight(false);
            setJustEval(false);
        } else {
            setDisplay(String(memory));
            setJustEval(true);
        }
    };
    const memStore = () => setMemory(asNum(display));
    const memPlus = () => setMemory((m) => (m ?? 0) + asNum(display));
    const memMinus = () => setMemory((m) => (m ?? 0) - asNum(display));

    const Btn = ({
                     label,
                     onClick,
                     variant = "normal",
                     ariaLabel,
                 }: {
        label: React.ReactNode;
        onClick: () => void;
        variant?: "normal" | "op" | "mem" | "act" | "eq";
        ariaLabel?: string;
    }) => (
        <button
            type="button"
            className={`${ExamStyles.calcBtn} ${
                variant === "op"
                    ? ExamStyles.calcBtnOp
                    : variant === "mem"
                        ? ExamStyles.calcBtnMem
                        : variant === "act"
                            ? ExamStyles.calcBtnAct
                            : variant === "eq"
                                ? ExamStyles.calcBtnEq
                                : ""
            }`}
            onClick={onClick}
            aria-label={ariaLabel ?? undefined}
        >
            {label}
        </button>
    );

    return (
        <div
            className={ExamStyles.calcPanel}
            role="group"
            aria-label="계산기"
            style={{
                backgroundImage: "url('/CBTExamView/calc_bg.png')",
                backgroundRepeat: "repeat-x",
                backgroundPosition: "center",
                backgroundSize: "center",
            }}
        >
            {/* 제목줄 */}
            <div className={ExamStyles.calcHeader}>
                <span className={ExamStyles.calcTitle}>계산기</span>
                <button
                    className={ExamStyles.calcClose}
                    onClick={onClose}
                    aria-label="닫기"
                    style={{
                        backgroundImage: "url('/CBTExamView/calc_close.png')",
                        backgroundRepeat: "no-repeat",
                        backgroundPosition: "center",
                    }}
                />
            </div>

            {/* 표시창 */}
            <div className={ExamStyles.calcDisplay} aria-live="polite">
                {display}
            </div>

            {/* 키패드 */}
            <div className={ExamStyles.calcGrid}>
                {/* 1행 */}
                <Btn label="MC" onClick={memClear} variant="mem" />
                <Btn label="%" onClick={percent} variant="act" />
                <Btn label="√" onClick={sqrt} variant="act" ariaLabel="제곱근" />
                <Btn label="±" onClick={toggleSign} variant="act" ariaLabel="부호 변경" />
                <Btn label="1/x" onClick={reciprocal} variant="act" ariaLabel="역수" />
                <Btn label="←" onClick={backspace} variant="act" ariaLabel="한 글자 지우기" />

                {/* 2행 */}
                <Btn label="MR" onClick={memRecall} variant="mem" />
                <Btn label="7" onClick={() => inputDigit("7")} />
                <Btn label="8" onClick={() => inputDigit("8")} />
                <Btn label="9" onClick={() => inputDigit("9")} />
                <Btn label="+" onClick={() => pushOp("+")} variant="op" />
                <Btn label="CE" onClick={clearEntry} variant="act" />

                {/* 3행 */}
                <Btn label="MS" onClick={memStore} variant="mem" />
                <Btn label="4" onClick={() => inputDigit("4")} />
                <Btn label="5" onClick={() => inputDigit("5")} />
                <Btn label="6" onClick={() => inputDigit("6")} />
                <Btn label="−" onClick={() => pushOp("-")} variant="op" />
                <Btn label="CA" onClick={clearAll} variant="act" />

                {/* 4행 */}
                <Btn label="M+" onClick={memPlus} variant="mem" />
                <Btn label="1" onClick={() => inputDigit("1")} />
                <Btn label="2" onClick={() => inputDigit("2")} />
                <Btn label="3" onClick={() => inputDigit("3")} />
                <Btn label="*" onClick={() => pushOp("*")} variant="op" />
                <Btn label="=" onClick={equals} variant="eq" />

                {/* 5행 */}
                <Btn label="M−" onClick={memMinus} variant="mem" />
                <Btn label="0" onClick={() => inputDigit("0")} />
                <Btn label="." onClick={() => inputDigit(".")} ariaLabel="소수점" />
                <Btn label="÷" onClick={() => pushOp("/")} variant="op" />
                <div />
            </div>
        </div>
    );
}
