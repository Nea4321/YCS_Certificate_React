import { useState } from 'react';
import Calendar from 'react-calendar';

type ExamEvent = {
    startdate: string;
    enddate: string;
    label: string;
    type: string;
    certificate: '정보처리기사' | '정보보안기사';
};

const infoProcessingEvents: ExamEvent[] = [
    { startdate: '2025-07-20', enddate: '2025-07-26', label: '필기접수 시작', type: 'doc-reg', certificate: '정보처리기사' },
    { startdate: '2025-08-10', enddate: '2025-08-16', label: '필기시험', type: 'doc-exam', certificate: '정보처리기사' },
    { startdate: '2025-08-25', enddate: '2025-08-31', label: '필기합격', type: 'doc-pass', certificate: '정보처리기사' },
    { startdate: '2025-09-01', enddate: '2025-09-07', label: '실기접수 시작', type: 'prac-reg', certificate: '정보처리기사' },
    { startdate: '2025-09-20', enddate: '2025-09-27', label: '실기시험', type: 'prac-exam', certificate: '정보처리기사' },
    { startdate: '2025-10-10', enddate: '2025-10-16', label: '실기합격', type: 'prac-pass', certificate: '정보처리기사' },
];

const infoSecurityEvents: ExamEvent[] = [
    { startdate: '2025-07-25', enddate: '2025-07-31', label: '필기접수 시작', type: 'doc-reg', certificate: '정보보안기사' },
    { startdate: '2025-08-15', enddate: '2025-08-21', label: '필기시험', type: 'doc-exam', certificate: '정보보안기사' },
    { startdate: '2025-08-30', enddate: '2025-09-05', label: '필기합격', type: 'doc-pass', certificate: '정보보안기사' },
    { startdate: '2025-09-05', enddate: '2025-09-11', label: '실기접수 시작', type: 'prac-reg', certificate: '정보보안기사' },
    { startdate: '2025-09-25', enddate: '2025-10-01', label: '실기시험', type: 'prac-exam', certificate: '정보보안기사' },
    { startdate: '2025-10-15', enddate: '2025-10-21', label: '실기합격', type: 'prac-pass', certificate: '정보보안기사' },
];

const allEvents = [...infoProcessingEvents, ...infoSecurityEvents];

export const DepartmentCalendar = () => {

    // 클릭한 날짜를 저장 및 상태 관리 하는 것
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);

    //
    const formatDate = (date: Date): string => {
        const y = date.getFullYear();
        const m = ('0' + (date.getMonth() + 1)).slice(-2);
        const d = ('0' + date.getDate()).slice(-2);
        return `${y}-${m}-${d}`;
    };

    // 시작일 종료일 사이에 포함되는지 확인
    const isDateInRange = (date: Date, startStr: string, endStr: string) => {
        const target = formatDate(date);
        return startStr <= target && target <= endStr;
    };

    // 주어진 날짜에 해당하는 자격증 시험 일정을 나타냄
    const getEventsForDate = (date: Date) => {
        return allEvents.filter((event) => isDateInRange(date, event.startdate, event.enddate));
    };

    // 날짜 바꿨을 때 상태 업데이트
    const onDateChange = (date: Date) => {
        setSelectedDate(date);
    };

    // 각 날짜의 이벤트를 표시
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
