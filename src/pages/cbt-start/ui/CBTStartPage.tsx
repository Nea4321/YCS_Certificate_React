// CBT 시험 시작 전 문제 유형, 시험 일자 결정하는 페이지

import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CBTStartStyles } from '../styles';

// 시험 날짜 하드코딩
const examDates = [
    '2018/03/18',
    '2019/06/23',
    '2020/10/11',
    '2021/11/07',
    '2022/04/17',
    '2023/07/30'
];

/**사용자가 CBTExamPage에서 선택한 자격증의 CBT 초기 설정을 결정하는 페이지*/
export const CBTStartPage: React.FC = () => {
    const navigate = useNavigate(); // CBT 테스트 페이지 이동을 위한 navigate
    const location = useLocation();

    const [selectedMode, setSelectedMode] = useState<'past' | 'random' | null>(null); // 문제 유형 상태
    const [selectedDate, setSelectedDate] = useState<string>(''); // 기출문제 일자
    const [startDate, setStartDate] = useState<string>(''); // 랜덤문제 시작일자
    const [endDate, setEndDate] = useState<string>(''); // 랜덤문제 종료일자

    /** 추가: 연습/시험 UI 모드 (연습 practice / 시험 exam) */
    const [selectedUi, setSelectedUi] = useState<'practice' | 'exam'>('exam');

    /**사용자가 문제 유형, 시험일자, 시작일자, 종료일자, UI 모드를 선택하고
     * 선택한 조건을 쿼리스트링에 담아 CBTTestPage 에 전달하는 함수
     *
     * - mode 는 필수이며 값은 'past' 또는 'random'
     * - ui 는 필수이며 값은 'practice' 또는 'exam'
     * - past mode 라면 selectedDate 를 선택
     * - random mode 라면 startDate, endDate 를 선택
     *
     * @example
     * selectedMode: past, selectedUi: practice
     * selectedDate: 2024/07/21
     * navigate(`/cbt/test?mode=past&date=2024/07/21&ui=practice`)
     *
     * selectedMode: random, selectedUi: exam
     * startDate: 2023/03/12, endDate: 2024/07/21
     * navigate(`/cbt/test?mode=random&start=2023/03/12&end=2024/07/21&ui=exam`)
     */
    const handleStart = () => {
        if (!selectedMode) return;

        const params = new URLSearchParams(location.search);
        params.set('mode', selectedMode); // 문제 유형(기출문제, 랜덤문제)

        // UI 모드(연습/시험) 추가
        params.set('ui', selectedUi);

        if (selectedMode === 'past') {
            if (!selectedDate) return alert('시험 일자를 선택해주세요');
            params.set('date', selectedDate); // 기출 시험 일자
        }

        if (selectedMode === 'random') {
            if (!startDate || !endDate) return alert('시작일자와 종료일자를 모두 선택해주세요');
            params.set('start', startDate); // 랜덤 시작
            params.set('end', endDate);     // 랜덤 종료
        }

        navigate(`/cbt/test?${params.toString()}`, {
            state: { ui: selectedUi },
            replace: false,
        }); // 쿼리스트링으로 테스트 페이지 이동
    };

    return (
        <div className={CBTStartStyles.page}>
            <h2 className={CBTStartStyles.title}>CBT 시험 시작</h2>
            <p className={CBTStartStyles.subtitle}>원하는 시험 유형을 선택해주세요</p>

            <div className={CBTStartStyles.cardWrapper}>
                <div
                    className={`${CBTStartStyles.card} ${selectedMode === 'past' ? CBTStartStyles.selected : ''}`}
                    onClick={() => {
                        setSelectedMode('past'); // 기출 선택
                        setSelectedDate(examDates[0]);
                        setStartDate('');
                        setEndDate('');
                    }}
                >
                    <div className={CBTStartStyles.icon}>📘</div>
                    <h3 className={CBTStartStyles.cardTitle}>기출문제</h3>
                    <p className={CBTStartStyles.cardDesc}>실제 시험에 출제되었던 문제들로 연습하세요</p>
                    <div className={CBTStartStyles.tags}>
                        <span className={CBTStartStyles.tagBlue}>실전 대비</span>
                        <span className={CBTStartStyles.tagGreen}>출제 경향 파악</span>
                    </div>
                    <ul className={CBTStartStyles.bullets}>
                        <li>최근 5년간 기출문제</li>
                        <li>난이도별 분류</li>
                        <li>상세한 해설 제공</li>
                    </ul>
                </div>

                <div
                    className={`${CBTStartStyles.card} ${selectedMode === 'random' ? CBTStartStyles.selected : ''}`}
                    onClick={() => {
                        setSelectedMode('random'); // 랜덤 선택
                        setSelectedDate('');
                        setStartDate(examDates[0]);
                        setEndDate(examDates[1]);
                    }}
                >
                    <div className={CBTStartStyles.icon}>🔄</div>
                    <h3 className={CBTStartStyles.cardTitle}>랜덤문제</h3>
                    <p className={CBTStartStyles.cardDesc}>다양한 유형의 문제를 무작위로 풀어보세요</p>
                    <div className={CBTStartStyles.tags}>
                        <span className={CBTStartStyles.tagPurple}>빠른 학습</span>
                        <span className={CBTStartStyles.tagOrange}>시간 단축</span>
                    </div>
                    <ul className={CBTStartStyles.bullets}>
                        <li>전체 문제 풀에서 선별</li>
                        <li>약점 보완 문제 추천</li>
                        <li>맞춤형 난이도 조절</li>
                    </ul>
                </div>
            </div>

            {selectedMode && (
                <div className={CBTStartStyles.optionsContainer}>
                    <h4 className={CBTStartStyles.optionsTitle}>시험 설정</h4>

                    {selectedMode === 'past' && (
                        <div className={CBTStartStyles.optionRow}>
                            <label>시험 일자</label> {/*기출문제 선택 시 시험 일자 선택 드롭다운*/}
                            <select
                                value={selectedDate}
                                onChange={(e) => setSelectedDate(e.target.value)}
                            >
                                {examDates.map((date) => (
                                    <option key={date} value={date}>{date}</option>
                                ))}
                            </select>
                        </div>
                    )}

                    {selectedMode === 'random' && (
                        <>
                            <div className={CBTStartStyles.optionRow}>
                                <label>시작 일자</label> {/*랜덤문제 선택 시 시작 일자 선택 드롭다운*/}
                                <select
                                    value={startDate}
                                    onChange={(e) => {
                                        setStartDate(e.target.value);
                                        setEndDate(e.target.value + 1);
                                    }}
                                >
                                    {examDates.map((date) => (
                                        <option key={date} value={date}>{date}</option>
                                    ))}
                                </select>
                            </div>

                            <div className={CBTStartStyles.optionRow}>
                                <label>종료 일자</label> {/*랜덤문제 선택 시 종료 일자 선택 드롭다운*/}
                                <select
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value + 1)}
                                    disabled={!startDate}
                                >
                                    {examDates
                                        .filter((date) => date > startDate)
                                        .map((date) => (
                                            <option key={date} value={date}>{date}</option>
                                        ))}
                                </select>
                            </div>
                        </>
                    )}

                    {/* 추가: 연습/시험 UI 모드 라디오 */}
                    <div className={CBTStartStyles.optionRow} style={{ marginTop: 8 }}>
                        <label>화면 모드</label>
                        <div>
                            <label style={{ marginRight: 12 }}>
                                <input
                                    type="radio"
                                    name="ui"
                                    value="exam"
                                    checked={selectedUi === 'exam'}
                                    onChange={() => setSelectedUi('exam')}
                                />{' '}
                                시험 모드
                            </label>
                            <label>
                                <input
                                    type="radio"
                                    name="ui"
                                    value="practice"
                                    checked={selectedUi === 'practice'}
                                    onChange={() => setSelectedUi('practice')}
                                />{' '}
                                연습 모드
                            </label>
                        </div>
                    </div>
                </div>
            )}

            <button
                className={CBTStartStyles.footerButton}
                onClick={handleStart}
                disabled={ // 문제 유형 및 날짜 선택이 완료된 경우만 활성화
                    !selectedMode ||
                    (selectedMode === 'past' && !selectedDate) ||
                    (selectedMode === 'random' && (!startDate || !endDate))
                }
            >
                CBT 시험 시작하기
            </button>
        </div>
    );
};
