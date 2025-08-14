import { useState } from 'react';
import Calendar from 'react-calendar';

/**캘린더 일정 구분 타입
 *
 * @property {string} startdate - 일정 시작 일자
 * @property {string} enddate - 일정 종료 일자
 * @property {string} label - 일정의 종류
 * @property {string} type - 일정 색상 구분을 위한 식별자
 * @property certificate - 자격증 종류
 * - '정보처리기사'
 * - '정보보안기사'
 */
type ExamEvent = {
    startdate: string;
    enddate: string;
    label: string;
    type: string;
    certificate: '정보처리기사' | '정보보안기사';
};

/**정보처리기사의 startdate, enddate, label, type, certificate 데이터*/
const infoProcessingEvents: ExamEvent[] = [
    { startdate: '2025-07-20', enddate: '2025-07-26', label: '필기접수 시작', type: 'doc-reg', certificate: '정보처리기사' },
    { startdate: '2025-08-10', enddate: '2025-08-16', label: '필기시험', type: 'doc-exam', certificate: '정보처리기사' },
    { startdate: '2025-08-25', enddate: '2025-08-31', label: '필기합격', type: 'doc-pass', certificate: '정보처리기사' },
    { startdate: '2025-09-01', enddate: '2025-09-07', label: '실기접수 시작', type: 'prac-reg', certificate: '정보처리기사' },
    { startdate: '2025-09-20', enddate: '2025-09-27', label: '실기시험', type: 'prac-exam', certificate: '정보처리기사' },
    { startdate: '2025-10-10', enddate: '2025-10-16', label: '실기합격', type: 'prac-pass', certificate: '정보처리기사' },
];

/**정보보안기사의 startdate, enddate, label, type, certificate 데이터*/
const infoSecurityEvents: ExamEvent[] = [
    { startdate: '2025-07-25', enddate: '2025-07-31', label: '필기접수 시작', type: 'doc-reg', certificate: '정보보안기사' },
    { startdate: '2025-08-15', enddate: '2025-08-21', label: '필기시험', type: 'doc-exam', certificate: '정보보안기사' },
    { startdate: '2025-08-30', enddate: '2025-09-05', label: '필기합격', type: 'doc-pass', certificate: '정보보안기사' },
    { startdate: '2025-09-05', enddate: '2025-09-11', label: '실기접수 시작', type: 'prac-reg', certificate: '정보보안기사' },
    { startdate: '2025-09-25', enddate: '2025-10-01', label: '실기시험', type: 'prac-exam', certificate: '정보보안기사' },
    { startdate: '2025-10-15', enddate: '2025-10-21', label: '실기합격', type: 'prac-pass', certificate: '정보보안기사' },
];

const allEvents = [...infoProcessingEvents, ...infoSecurityEvents];

/**자격증 캘린더 컴포넌트
 * 사용자가 선택한 학과에 관련된 자격증의 여러 일정 정보가 담긴 캘린더 UI를 배치
 * 필기접수, 필기시험, 필기합격, 실기접수, 실기시험, 실기합격 6개의 일정이 존재한다
 */
export const DepartmentCalendar = () => {

    // 클릭한 날짜를 저장 및 상태 관리 하는 것
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);

    /**사용자가 클릭한 캘린더 타일 날짜를 'YYYY-MM-DD' 형식으로 변환하여 반환하는 함수
     *
     * @param date - 변환할 Date 객체
     *
     * @returns 'YYYY-MM-DD'
     */
    const formatDate = (date: Date): string => {
        const y = date.getFullYear();
        const m = ('0' + (date.getMonth() + 1)).slice(-2);
        const d = ('0' + date.getDate()).slice(-2);
        return `${y}-${m}-${d}`;
    };

    // 시작일 종료일 사이에 포함되는지 확인
    /**Date 객체가 일정 시작 일자와 종료 일자에 포함되는 날짜인지 확인하는 함수
     *
     * @param date - 검사할 Date 객체
     * @param {string} startStr - 일정 시작 일자
     * @param {String} endStr - 일정 종료 일자
     *
     * @returns 날짜가 범위 내에 있다면 true, 범위 내에 없다면 false
     */
    const isDateInRange = (date: Date, startStr: string, endStr: string) => {
        const target = formatDate(date);
        return startStr <= target && target <= endStr;
    };

    // 주어진 날짜에 해당하는 자격증 시험 일정을 나타냄
    /**특정 날짜에 해당하는 자격증 시험 일정을 반환한다
     *
     * @param {Date} date - 검사할 Date 객체
     *
     * @returns 해당 날짜에 포함된 ExamEvent 배열 내용
     */
    const getEventsForDate = (date: Date) => {
        return allEvents.filter((event) => isDateInRange(date, event.startdate, event.enddate));
    };

    // 날짜 바꿨을 때 상태 업데이트
    /**사용자가 날짜 클릭 시 선택한 날짜 상태로 업데이트
     *
     * @param {Date} date - 선택한 날짜
     */
    const onDateChange = (date: Date) => {
        setSelectedDate(date);
    };

    // 각 날짜의 이벤트를 표시
    /**캘린더에 일정을 표시
     *
     * @param date - 타일 날짜
     * @param {string} view - 달력의 뷰 타입 ('month')
     *
     * @returns 해당 날짜에 일정이 존재한다면 라벨과 자격증 표시*/
    const tileContent = ({ date, view }: { date: Date; view: string }) => {
        if (view === 'month') {
            const events = getEventsForDate(date);
            return (
                <div>
                    {events.map((ev, idx) => (
                        <div
                            key={idx}
                            style={{
                                fontSize: '0.75rem',
                                color: ev.certificate === '정보처리기사' ? 'blue' : 'green',
                            }}
                        >
                            {ev.label} ({ev.certificate})
                        </div>
                    ))}
                </div>
            );
        }
        return null;
    };

    return (
        <div>
            <Calendar onClickDay={onDateChange} tileContent={tileContent} />
            {selectedDate && (
                <div style={{ marginTop: 20 }}>
                    <strong>{formatDate(selectedDate)} 이벤트</strong>
                    <ul>
                        {getEventsForDate(selectedDate).length > 0 ? (
                            getEventsForDate(selectedDate).map((ev, idx) => (
                                <li key={idx} style={{ color: ev.certificate === '정보처리기사' ? 'blue' : 'green' }}>
                                    {ev.label} ({ev.certificate})
                                </li>
                            ))
                        ) : (
                            <li>해당 날짜에 자격증 일정이 없습니다.</li>
                        )}
                    </ul>
                </div>
            )}
        </div>
    );
};
