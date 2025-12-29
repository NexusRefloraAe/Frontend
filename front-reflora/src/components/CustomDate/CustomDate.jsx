import React, { useState, useRef, useEffect } from "react";
import "./CustomDateStyle.css";

const CustomDate = ({ name, value, onChange, placeholder = "Selecione a data", disabled = false }) => {
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedDate, setSelectedDate] = useState(value || "");
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const calendarRef = useRef(null);

  const openCalendar = () => {
    if (!disabled) setShowCalendar(!showCalendar);
  };

  // Fecha o calendário se clicar fora
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (calendarRef.current && !calendarRef.current.contains(e.target)) {
        setShowCalendar(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleDayClick = (day) => {
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    setSelectedDate(date.toISOString().split("T")[0]);
    onChange && onChange({ target: { name, value: date.toISOString().split("T")[0] } });
    setShowCalendar(false);
  };

  const daysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const monthDays = Array.from({ length: daysInMonth(currentMonth.getFullYear(), currentMonth.getMonth()) }, (_, i) => i + 1);

  const prevMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  const nextMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));

  return (
    <div className={`custom-date ${disabled ? "disabled" : ""}`}>
      <div className="custom-date__display" onClick={openCalendar}>
        <span className={selectedDate ? "has-value" : "placeholder"}>
          {selectedDate ? new Date(selectedDate).toLocaleDateString("pt-BR") : placeholder}
        </span>
        <svg
          className="custom-date__icon"
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
      </div>

      {showCalendar && (
        <div className="custom-date__calendar" ref={calendarRef}>
          <div className="calendar-header">
            <button type="button" onClick={prevMonth}>&lt;</button>
            <span>{currentMonth.toLocaleString("pt-BR", { month: "long", year: "numeric" })}</span>
            <button type="button" onClick={nextMonth}>&gt;</button>
          </div>
          <div className="calendar-body">
            {monthDays.map((day) => (
              <div key={day} className="calendar-day" onClick={() => handleDayClick(day)}>
                {day}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomDate;
