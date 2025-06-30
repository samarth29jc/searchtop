import React, { useState } from "react";
import Icon from "../../media/icon/icons";

const Calendar = () => {
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [selectedMonth, setSelectedMonth] = useState(startDate.getMonth());
    const [selectedYear, setSelectedYear] = useState(startDate.getFullYear());

    const renderDays = (month, year) => {
        const date = new Date(year, month, 1);
        const days = [];

        const firstDayIndex = date.getDay();

        for (let i = 0; i < firstDayIndex; i++) {
            days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
        }

        while (date.getMonth() === month) {
            days.push(
                <div key={date.toString()} className="calendar-day">
                    {date.getDate()}
                </div>
            );
            date.setDate(date.getDate() + 1);
        }

        return days;
    };
    const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    return (
        <div className="calendar-container">
            <div className="calendar-header">
                <div className="date-display">
                    <span>Start date: </span>
                    <strong>{startDate.toDateString()}</strong>
                    <span> → </span>
                    <span>End date: </span>
                    <strong>{endDate.toDateString()}</strong>
                </div>
                <button className="calendar-clear-button">Clear</button>
            </div>
            <div className="calendar">

                <div className="calendar-section">
                    <div className="calendar-header">
                        <select className="month-selector">
                            {Array.from({ length: 12 }).map((_, i) => (
                                <option key={i} value={i}>
                                    {new Date(2024, i, 1).toLocaleString("default", {
                                        month: "long",
                                    })}
                                </option>
                            ))}
                        </select>
                        <select
                            className="year-selector"
                            value={selectedYear}
                            onChange={(e) => setSelectedYear(parseInt(e.target.value, 10))}
                        >
                            {Array.from({ length: 10 }).map((_, i) => (
                                <option key={i} value={2025 - i}>
                                    {2025 - i}
                                </option>
                            ))}
                        </select>
                    </div>
                    <hr className="separator-line" />
                    <div className="weekdays">
                        {weekdays.map((day) => (
                            <div key={day} className="weekday">
                                {day}
                            </div>
                        ))}
                    </div>
                    <div className="calendar-grid">{renderDays(11, 2024)}</div>
                    <div className="time-selector">
                        <div>
                            <label className="calender-label">Time</label>
                            <div className="time-input">
                                <div>
                                    <input type="number" defaultValue="12" min="1" max="12" className="time-field" /> :
                                    <input type="number" defaultValue="30" min="0" max="59" className="time-field" /> :
                                    <input type="number" defaultValue="00" min="0" max="59" className="time-field" />
                                </div>
                                <div className="ampm-selector">
                                    <span>AM</span>
                                    <span>PM</span>
                                </div>

                                <span className="watch-icon" role="img" aria-label="watch">
                                    <Icon name="watch" width={20} height={20}></Icon>
                                </span>
                            </div>
                        </div>
                        <div>
                            <label className="calender-label">Default</label>
                            <div className="default-date-dropdown">
                                <select className="date-dropdown">
                                    <option value="default">Default</option>
                                    <option value="2024-01-01">2024-01-01</option>
                                    <option value="2024-02-01">2024-02-01</option>
                                    <option value="2024-03-01">2024-03-01</option>
                                </select>
                            </div>
                        </div>
                    </div>

                </div>

                <div className="calendar-section">
                    <div className="calendar-header">
                        <select className="month-selector">
                            {Array.from({ length: 12 }).map((_, i) => (
                                <option key={i} value={i}>
                                    {new Date(2025, i, 1).toLocaleString("default", {
                                        month: "long",
                                    })}
                                </option>
                            ))}
                        </select>
                        <select
                            className="year-selector"
                            value={selectedYear}
                            onChange={(e) => setSelectedYear(parseInt(e.target.value, 10))}
                        >
                            {Array.from({ length: 10 }).map((_, i) => (
                                <option key={i} value={2025 - i}>
                                    {2025 - i}
                                </option>
                            ))}
                        </select>
                    </div>
                    <hr className="separator-line" />
                    <div className="weekdays">
                        {weekdays.map((day) => (
                            <div key={day} className="weekday">
                                {day}
                            </div>
                        ))}
                    </div>
                    <div className="calendar-grid">{renderDays(0, 2025)}</div>
                    <div className="time-selector">
                        <div>
                            <label className="calender-label">Time</label>
                            <div className="time-input">
                                <input type="number" defaultValue="12" min="1" max="12" className="time-field" /> :
                                <input type="number" defaultValue="30" min="0" max="59" className="time-field" /> :
                                <input type="number" defaultValue="00" min="0" max="59" className="time-field" />

                                <div className="ampm-selector">
                                    <span>AM</span>
                                    <span>PM</span>
                                </div>

                                <span className="watch-icon" role="img" aria-label="watch">
                                    <Icon name="watch" width={20} height={20}></Icon>
                                </span>
                            </div>
                        </div>
                        <div>
                            <label className="calender-label">Default</label>
                            <div className="default-date-dropdown">
                                <select className="date-dropdown">
                                    <option value="default">Default</option>
                                    <option value="2024-01-01">2024-01-01</option>
                                    <option value="2024-02-01">2024-02-01</option>
                                    <option value="2024-03-01">2024-03-01</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Calendar;
