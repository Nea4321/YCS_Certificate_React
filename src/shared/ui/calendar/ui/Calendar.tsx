import BaseCalendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import type { CalendarProps as BaseCalendarProps } from "react-calendar";
import {CalView} from "@/features/calendar/model/useCollapseToMonth.ts";

interface CalendarProps extends BaseCalendarProps {
    isExpanded: boolean;
    view?: CalView;
    onViewChange?: (payload: { view: CalView }) => void;
}

const navigationLabel = ({ date, view }: { date: Date; view: string }) =>
    view === 'month' ? `${date.getFullYear()}년 ${date.getMonth() + 1}월` : null;

export function Calendar({ isExpanded, ...props }: CalendarProps) {
    return (
        <BaseCalendar
            {...props}
            locale="ko-KR"
            view={props.view}
            onViewChange={props.onViewChange as any}
            minDetail={isExpanded ? undefined : 'month'}
            showNavigation={isExpanded}
            formatDay={(_loc, d) => d.getDate().toString()}
            showNeighboringMonth
            next2Label={null}
            prev2Label={null}
            nextLabel="다음 >"
            prevLabel="< 이전"
            navigationLabel={navigationLabel}
        />
    );
}