import { useState, useEffect } from "react";
import { certificateApi, NationalSchedule } from "@/entities/certificate";
import { NewsTickerStyles } from "@/widgets/newsticker/styles";

export const NewsTicker = () => {
    const [schedules, setSchedules] = useState<NationalSchedule[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isExpanded, setIsExpanded] = useState(false);
    const [showExpanded, setShowExpanded] = useState(false);

    useEffect(() => {
        const fetchSchedules = async () => {
            try {
                const data = await certificateApi.getNationalSchedule();
                if (data && data.length > 0) setSchedules(data);
            } catch (error) {
                console.error("Failed to fetch NationalSchedule", error);
            }
        };
        fetchSchedules().catch((error) =>
            console.error("NationalSchedule 가져오는 중 오류 발생", error)
        );
    }, []);

    useEffect(() => {
        if (schedules.length === 0 || isExpanded) return;

        const timer = setInterval(
            () => setCurrentIndex((prev) => (prev + 1) % schedules.length),
            4000
        );
        return () => clearInterval(timer);
    }, [schedules, isExpanded]);

    useEffect(() => {
        if (isExpanded) {
            setShowExpanded(true);
        } else {
            const timer = setTimeout(() => {
                setShowExpanded(false);
            }, 350);
            return () => clearTimeout(timer);
        }
    }, [isExpanded]);

    const handleToggle = () => setIsExpanded((prev) => !prev);

    if (schedules.length === 0) return null;

    const currentSchedule = schedules[currentIndex];

    return (
        <div className={NewsTickerStyles.widgetContainer}>
            <div
                className={`${NewsTickerStyles.tickerItem} ${
                    isExpanded ? NewsTickerStyles.tickerItemExpanded : ""
                }`}
            >
                {!isExpanded && (
                    <div
                        key={currentIndex}
                        className={`${NewsTickerStyles.tickerContent} ${NewsTickerStyles.tickerContentAnimated}`}
                    >
                        <span className={NewsTickerStyles.name}>
                            {currentSchedule.name}
                        </span>
                        <span className={NewsTickerStyles.content}>
                            {currentSchedule.content}
                        </span>
                    </div>
                )}
                {showExpanded && (
                    <div
                        className={`${NewsTickerStyles.expandedContainer} ${
                            isExpanded
                                ? NewsTickerStyles.expandedContainerOpen
                                : NewsTickerStyles.expandedContainerClose
                        }`}
                    >
                        <div className={NewsTickerStyles.scheduleCount}>
                            현재 진행중인 일정이 {schedules.length}개 있습니다
                        </div>

                        <div className={NewsTickerStyles.expandedList}>
                            {schedules.map((schedule, index) => (
                                <div
                                    key={index}
                                    className={NewsTickerStyles.expandedItem}
                                >
                                    <span className={NewsTickerStyles.expandedName}>
                                        {schedule.name}
                                    </span>
                                    <span className={NewsTickerStyles.expandedContent}>
                                        {schedule.content}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
                <button
                    onClick={handleToggle}
                    className={NewsTickerStyles.toggleButton}
                >
                    {isExpanded ? "▲ 접기" : "▼ 전체보기"}
                </button>
            </div>
        </div>
    );
};
