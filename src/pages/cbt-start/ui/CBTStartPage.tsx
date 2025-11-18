import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CBTStartStyles } from '../styles';

type QuestionInfoOption = {
    question_info_id: number;
    question_info_name: string;
    main: boolean;
};

/** CBT 시작 전 화면 모드 / 정답 시연, 회차 선택 페이지 */
export const CBTStartPage: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // 화면 모드: 시험 / 연습
    const [selectedUi, setSelectedUi] = useState<'practice' | 'exam'>('exam');
    // 정답 시연(모두 정답) 옵션
    const [showCorrect, setShowCorrect] = useState<boolean>(false);

    // 🔹 /api/cbt?cert_id= 에서 가져올 question_info 리스트
    const [questionInfos, setQuestionInfos] = useState<QuestionInfoOption[]>([]);
    const [selectedQuestionInfoId, setSelectedQuestionInfoId] = useState<number | null>(null);

    // 필요하면 로딩/에러 상태도 관리 가능
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // URL 쿼리에서 certificateId 가져오기
    const searchParams = new URLSearchParams(location.search);
    const certificateId = searchParams.get('certificateId');
    const certName = searchParams.get('certName') ?? ''; // 썸네일/타이틀에 쓸 수도 있음

    /** 컴포넌트 마운트 시 해당 자격증의 question_info 목록 조회 */
    useEffect(() => {
        if (!certificateId) return; // 잘못 들어온 경우

        setLoading(true);
        setError(null);

        fetch(`/api/cbt?cert_id=${certificateId}`)
            .then((res) => {
                if (!res.ok) {
                    throw new Error(`Failed to fetch /api/cbt?cert_id=${certificateId}`);
                }
                return res.json();
            })
            .then((data: QuestionInfoOption[]) => {
                setQuestionInfos(data);

                if (data.length > 0) {
                    // main == true 인 항목이 있으면 기본 선택, 없으면 첫 번째 선택
                    const mainItem = data.find((d) => d.main);
                    setSelectedQuestionInfoId(
                        (mainItem ?? data[0]).question_info_id
                    );
                }
            })
            .catch((e) => {
                console.error(e);
                setError('시험 회차 정보를 불러오지 못했습니다.');
            })
            .finally(() => setLoading(false));
    }, [certificateId]);

    /** 선택한 옵션을 쿼리스트링에 담아서 CBTTestPage로 이동 */
    const handleStart = () => {
        if (!certificateId) {
            alert('자격증 정보가 없습니다. 목록에서 다시 진입해 주세요.');
            return;
        }

        if (!selectedQuestionInfoId) {
            alert('시험 회차를 선택해 주세요.');
            return;
        }

        const params = new URLSearchParams(location.search);

        // 화면 모드
        params.set('ui', selectedUi);

        // 정답 시연
        if (showCorrect) {
            params.set('showCorrect', '1');
        } else {
            params.delete('showCorrect');
        }

        // 🔹 선택한 question_info_id 도 같이 전달
        params.set('questionInfoId', selectedQuestionInfoId.toString());

        navigate(`/cbt/test?${params.toString()}`, {
            state: { ui: selectedUi },
            replace: false,
        });
    };

    return (
        <div className={CBTStartStyles.page}>
            <h2 className={CBTStartStyles.title}>CBT 시험 시작</h2>
            {certName && (
                <p className={CBTStartStyles.subtitle}>
                    <strong>{certName}</strong> 시험 설정을 선택해주세요
                </p>
            )}
            {!certName && (
                <p className={CBTStartStyles.subtitle}>
                    원하는 시험 설정을 선택해주세요
                </p>
            )}

            {/* 시험 설정 카드 */}
            <div className={CBTStartStyles.optionsContainer}>
                <div className={CBTStartStyles.optionsHeader}>
                    <div className={CBTStartStyles.optionsIcon}>📝</div>
                    <div>
                        <h4 className={CBTStartStyles.optionsTitle}>시험 설정</h4>
                        <p className={CBTStartStyles.optionsSubtitle}>
                            CBT 환경과 정답 시연 방식을 선택한 뒤 시험을 시작해 보세요.
                        </p>
                    </div>
                </div>

                {/* 🔹 시험 회차(QuestionInfo 선택) 드롭다운 */}
                <div className={CBTStartStyles.optionRow} style={{ marginTop: 8 }}>
                    <label>시험 회차</label>
                    <div>
                        {loading ? (
                            <span>회차 정보를 불러오는 중입니다...</span>
                        ) : error ? (
                            <span style={{ color: 'red' }}>{error}</span>
                        ) : (
                            <select
                                className={CBTStartStyles.select}
                                value={selectedQuestionInfoId ?? ''}
                                onChange={(e) =>
                                    setSelectedQuestionInfoId(
                                        e.target.value
                                            ? Number(e.target.value)
                                            : null
                                    )
                                }
                            >
                                {/* 기본 안내 옵션 */}
                                {questionInfos.length === 0 && (
                                    <option value="">
                                        선택 가능한 시험 회차가 없습니다
                                    </option>
                                )}
                                {questionInfos.length > 0 && (
                                    <>
                                        {questionInfos.map((info) => (
                                            <option
                                                key={info.question_info_id}
                                                value={info.question_info_id}
                                            >
                                                {info.question_info_name}
                                            </option>
                                        ))}
                                    </>
                                )}
                            </select>
                        )}
                    </div>
                </div>

                {/* 화면 모드 */}
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

                {/* 정답 시연 */}
                <div className={CBTStartStyles.optionRow} style={{ marginTop: 8 }}>
                    <label>정답 시연</label>
                    <label>
                        <input
                            type="checkbox"
                            checked={showCorrect}
                            onChange={(e) => setShowCorrect(e.target.checked)}
                        />{' '}
                        모두 정답
                    </label>
                </div>
            </div>

            <button
                className={CBTStartStyles.footerButton}
                onClick={handleStart}
                disabled={loading}
            >
                CBT 시험 시작하기
            </button>
        </div>
    );
};
