import { useState, useEffect } from 'react';
import { certificateApi, NationalSchedule } from '@/entities/certificate';
import { NewsTickerStyles } from "@/widgets/newsticker/styles";

export const NewsTicker = () => {
    const [schedules, setSchedules] = useState<NationalSchedule[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [ isExpanded, setIsExpanded] = useState(false);

    useEffect(() => {
        const fetchSchedules = async () => {
            try {
                const data = await certificateApi.getNationalSchedule();
                if (data && data.length > 0) {
                    setSchedules(data);
                }

            } catch (error) {
                console.error("Failed to fetch NationalSchedule", error);
            }
        };

        fetchSchedules().then(r => {
            console.log('NationalSchedule 가져옴', r);
        })
            .catch(error => {
                console.error("NationalSchedule 가져오는 중 오류 발생", error);
            });
    }, []);

    useEffect(() => {
        if (schedules.length > 0) {
            const timer = setInterval(() => {
                setCurrentIndex((prevIndex) => (prevIndex + 1) % schedules.length);
            }, 4000);

            return () => clearInterval(timer);
        }
    }, [schedules]);

    const handleToggle = () => {
        setIsExpanded(!isExpanded);
    };

    if (schedules.length === 0) {
        return null;
    }

    const currentSchedule = schedules[currentIndex];

    return (
        <div className={NewsTickerStyles.widgetContainer}>
            <div className={NewsTickerStyles.tickerItem}>
                    <div key={currentIndex} className={NewsTickerStyles.tickerContent}>
                        <span className={NewsTickerStyles.name}>{currentSchedule.name}</span>
                        <span className={NewsTickerStyles.content}>{currentSchedule.content}</span>
                    </div>
            </div>

            <div className={NewsTickerStyles.toggleButtonContainer}>
                <button onClick={handleToggle} className={NewsTickerStyles.toggleButton}>
                    {isExpanded ? '▲ 접기' : '▼ 전체보기'}
                </button>
            </div>

            <div className={isExpanded ? `${NewsTickerStyles.expandedContainer} ${NewsTickerStyles.show}` : NewsTickerStyles.expandedContainer}>
                <div className={NewsTickerStyles.scheduleCount}>
                    현재 진행중인 일정이 {schedules.length}개 있습니다
                </div>
                {schedules.map((schedule, index) => (
                    <div key={index} className={NewsTickerStyles.expandedItem}>
                        <span className={NewsTickerStyles.expandedName}>{schedule.name}</span>
                        <span className={NewsTickerStyles.expandedContent}>{schedule.content}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};