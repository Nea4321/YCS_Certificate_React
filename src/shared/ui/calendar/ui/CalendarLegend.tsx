import { calendarStyles } from "@/widgets/calendar/";

export function CalendarLegend() {
    return (
        <div className={calendarStyles.legendSection}>
            <h3 className={calendarStyles.legendTitle}>일정 구분</h3>
            <div className={calendarStyles.legendGrid}>
                <div className={calendarStyles.legendItem}>
                    <span className={`${calendarStyles.legendColor} ${calendarStyles.legendColorDocReg}`}/>
                    필기접수
                </div>
                <div className={calendarStyles.legendItem}>
                    <span className={`${calendarStyles.legendColor} ${calendarStyles.legendColorDocExam}`}/>
                    필기시험
                </div>
                <div className={calendarStyles.legendItem}>
                    <span className={`${calendarStyles.legendColor} ${calendarStyles.legendColorDocPass}`}/>
                    필기합격
                </div>
                <div className={calendarStyles.legendItem}>
                    <span className={`${calendarStyles.legendColor} ${calendarStyles.legendColorPracReg}`}/>
                    실기접수
                </div>
                <div className={calendarStyles.legendItem}>
                    <span className={`${calendarStyles.legendColor} ${calendarStyles.legendColorPracExam}`}/>
                    실기시험
                </div>
                <div className={calendarStyles.legendItem}>
                    <div className={`${calendarStyles.legendColor} ${calendarStyles.legendColorPracPass}`}/>
                    <span>실기합격</span>
                </div>
            </div>
        </div>
    );
}