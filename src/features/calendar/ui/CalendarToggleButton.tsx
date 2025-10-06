import { flushSync } from 'react-dom';
import { ChevronDown, ChevronUp } from 'lucide-react';
import * as dateUtils from '@/shared/lib/date';
import { calendarStyles } from '@/widgets/calendar/';
import React from "react";

interface Props {
    isExpanded: boolean;
    setIsExpanded: (value: React.SetStateAction<boolean>) => void;
    setCurrentDate: (date: Date) => void;
    setVisibleMonth: (date: Date) => void;
}

export function CalendarToggleButton({ isExpanded, setIsExpanded, setCurrentDate, setVisibleMonth }: Props) {
    const handleToggle = () => {
        setIsExpanded(prev => {
            const next = !prev;
            if (!next) { // 접히는 순간
                const today = new Date();
                flushSync(() => {
                    setCurrentDate(today);
                    setVisibleMonth(dateUtils.startOfMonth(today));
                });
            }
            return next;
        });
    };

    return (
        <div className={calendarStyles.expandIconWrapper}>
            <button className={calendarStyles.expandIconButton} onClick={handleToggle}>
                {isExpanded ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
            </button>
        </div>
    );
}