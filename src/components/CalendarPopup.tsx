import { useState } from 'react';

interface CalendarPopupProps {
  onClose: () => void;
}

export default function CalendarPopup({ onClose }: CalendarPopupProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const today = new Date();

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const daysInMonth = getDaysInMonth(currentDate);
  const firstDay = getFirstDayOfMonth(currentDate);

  const isToday = (day: number) => {
    return (
      day === today.getDate() &&
      currentDate.getMonth() === today.getMonth() &&
      currentDate.getFullYear() === today.getFullYear()
    );
  };

  const renderDays = () => {
    const days = [];
    // Empty cells for days before the first day
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="w-8 h-8" />);
    }
    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(
        <div
          key={day}
          className={`w-8 h-8 flex items-center justify-center text-xs rounded-full cursor-pointer transition-colors ${
            isToday(day)
              ? 'bg-blue-500 text-white font-medium'
              : 'hover:bg-gray-200 text-gray-700'
          }`}
        >
          {day}
        </div>
      );
    }
    return days;
  };

  return (
    <>
      <div className="fixed inset-0 z-[9997]" onClick={onClose} onTouchEnd={onClose} />
      <div
        className="fixed bottom-12 right-0 w-[320px] bg-white border border-gray-300 shadow-2xl z-[9998] start-menu-open"
      >
        {/* Calendar Header */}
        <div className="p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-gray-800">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h3>
            <div className="flex gap-1">
              <button
                onClick={prevMonth}
                onTouchEnd={prevMonth}
                className="w-6 h-6 flex items-center justify-center rounded hover:bg-gray-100 text-gray-500"
              >
                <svg width="8" height="12" viewBox="0 0 8 12" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M6 1L1 6l5 5" />
                </svg>
              </button>
              <button
                onClick={nextMonth}
                onTouchEnd={nextMonth}
                className="w-6 h-6 flex items-center justify-center rounded hover:bg-gray-100 text-gray-500"
              >
                <svg width="8" height="12" viewBox="0 0 8 12" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M2 1l5 5-5 5" />
                </svg>
              </button>
            </div>
          </div>

          {/* Day names */}
          <div className="grid grid-cols-7 gap-0 mb-1">
            {dayNames.map(day => (
              <div key={day} className="w-8 h-6 flex items-center justify-center text-[10px] text-gray-500 font-medium">
                {day}
              </div>
            ))}
          </div>

          {/* Days grid */}
          <div className="grid grid-cols-7 gap-0">
            {renderDays()}
          </div>
        </div>

        {/* Time section */}
        <div className="border-t border-gray-200 p-4 bg-gray-50">
          <div className="text-center">
            <div className="text-2xl font-light text-gray-800">
              {today.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true })}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {today.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
