import React, { useState, useRef, useEffect } from 'react';
import styles from './Calendar.module.css';
import Dropdown from '../dropdown/Dropdown';
import Icon from '../../../media/icon/icons';



const Calendar = ({ isOpen, setIsOpen, onApply, onChange, onClear }) => {
  const [dateRange, setDateRange] = useState(() => {
    const now = new Date();
    const currentHours = now.getHours();
    const currentMinutes = now.getMinutes();
    const currentSeconds = now.getSeconds();
    const currentAmpm = currentHours >= 12 ? 'PM' : 'AM';
    const formattedHours = (currentHours % 12) || 12;
    return {
      startDate: now,
      endDate: now,
      startTime: { hours: 12, minutes: 0, seconds: 0, ampm: 'AM' },
      endTime: { hours: formattedHours, minutes: currentMinutes, seconds: currentSeconds, ampm: currentAmpm }
    };
  });
  const [is24HourFormat, setIs24HourFormat] = useState(false);
  const [showTimeFormatOptionsStart, setShowTimeFormatOptionsStart] = useState(false);
  const [showTimeFormatOptionsEnd, setShowTimeFormatOptionsEnd] = useState(false);
  const timeFormatRefStart = useRef(null);
  const timeFormatRefEnd = useRef(null);
  const [leftMonth, setLeftMonth] = useState(dateRange.startDate ? dateRange.startDate.getMonth() : new Date().getMonth());
  const [leftYear, setLeftYear] = useState(dateRange.startDate ? dateRange.startDate.getFullYear() : new Date().getFullYear());
  const [rightMonth, setRightMonth] = useState(() => {
    const nextMonth = (dateRange.startDate ? dateRange.startDate.getMonth() : new Date().getMonth()) + 1;
    return nextMonth > 11 ? 0 : nextMonth;
  });
  const [rightYear, setRightYear] = useState(() => {
    const nextMonth = (dateRange.startDate ? dateRange.startDate.getMonth() : new Date().getMonth()) + 1;
    return nextMonth > 11
      ? (dateRange.startDate ? dateRange.startDate.getFullYear() : new Date().getFullYear()) + 1
      : (dateRange.startDate ? dateRange.startDate.getFullYear() : new Date().getFullYear());
  });
  const calendarRef = useRef(null);
  const currentYear = new Date().getFullYear();

  const maxYear = Math.max(currentYear, leftYear, rightYear);
  const yearOptions = Array.from({ length: maxYear - 1900 + 5 }, (_, i) => ({
    label: (1900 + i).toString(),
    value: (1900 + i).toString(),
  }));

  const [leftYearScrolled, setLeftYearScrolled] = useState(false);
  const [rightYearScrolled, setRightYearScrolled] = useState(false);
  const [timeInputs, setTimeInputs] = useState({
    startTime: {
      hours: String(dateRange.startTime.hours),
      minutes: String(dateRange.startTime.minutes).padStart(2, '0'),
      seconds: String(dateRange.startTime.seconds).padStart(2, '0'),
    },
    endTime: {
      hours: String(dateRange.endTime.hours),
      minutes: String(dateRange.endTime.minutes).padStart(2, '0'),
      seconds: String(dateRange.endTime.seconds).padStart(2, '0'),
    },
  });

  // Add state to track which input is active
  const [activeInput, setActiveInput] = useState(null); // 'start' | 'end' | null

  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    console.log('useEffect triggered:', { leftMonth, rightMonth, leftYear, rightYear });
    if (leftMonth === rightMonth && leftYear === rightYear) {
      const nextMonth = (leftMonth + 1) % 12;
      const nextYear = leftMonth === 11 ? leftYear + 1 : leftYear;
      console.log('Syncing right to', nextMonth, nextYear);
      setRightMonth(nextMonth);
      setRightYear(nextYear);
    }
  }, [leftMonth, rightMonth, leftYear, rightYear]);
  
  

  useEffect(() => {
    if (isOpen) {
      setLeftYearScrolled(false);
      setRightYearScrolled(false);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (calendarRef.current && !calendarRef.current.contains(event.target)) {
        setIsOpen(false);
      }
      if (timeFormatRefStart.current && !timeFormatRefStart.current.contains(event.target)) {
        setShowTimeFormatOptionsStart(false);
      }
      if (timeFormatRefEnd.current && !timeFormatRefEnd.current.contains(event.target)) {
        setShowTimeFormatOptionsEnd(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [setIsOpen]);

  useEffect(() => {
    setTimeInputs({
      startTime: {
        hours: String(dateRange.startTime.hours),
        minutes: String(dateRange.startTime.minutes).padStart(2, '0'),
        seconds: String(dateRange.startTime.seconds).padStart(2, '0'),
      },
      endTime: {
        hours: String(dateRange.endTime.hours),
        minutes: String(dateRange.endTime.minutes).padStart(2, '0'),
        seconds: String(dateRange.endTime.seconds).padStart(2, '0'),
      },
    });
  }, [dateRange]);

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const monthOptions = months.map((month, index) => ({
    label: month,
    value: index.toString()
  }));
  const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const formatDate = (date) => {
    if (!date) return '';
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const formatTime = (time) => {
    let hours = parseInt(time.hours, 10);
    let minutes = parseInt(time.minutes, 10);
    let seconds = parseInt(time.seconds, 10);
    let ampm = time.ampm;

    if (is24HourFormat) {
      if (ampm === 'PM' && hours < 12) {
        hours = hours + 12;
      } else if (ampm === 'AM' && hours === 12) {
        hours = 0;
      }
      if (hours > 23) hours = 23;
      if (hours < 0) hours = 0;
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    } else {
      if (hours > 12) hours = 12;
      if (hours < 1) hours = 1;
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')} ${ampm}`;
    }
  };

  const getDaysInMonth = (month, year) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (month, year) => {
    const firstDay = new Date(year, month, 1).getDay();
    return firstDay === 0 ? 6 : firstDay - 1;
  };

  const isSameDate = (date1, date2) => {
    if (!date1 || !date2) return false;
    return date1.getDate() === date2.getDate() && 
           date1.getMonth() === date2.getMonth() && 
           date1.getFullYear() === date2.getFullYear();
  };

  const isDateInRange = (date, startDate, endDate) => {
    if (!startDate || !endDate) return false;
    const start = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
    const end = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate());
    const current = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    return current >= start && current <= end;
  };

  const handleDateClick = (day, month, year) => {
    const clickedDate = new Date(year, month, day);

    if (!dateRange.startDate) {
      setDateRange(prev => ({
        ...prev,
        startDate: clickedDate,
        endDate: null
      }));
      return;
    }

    if (dateRange.startDate && !dateRange.endDate) {
      if (isSameDate(clickedDate, dateRange.startDate)) {
        setDateRange(prev => ({
          ...prev,
          startDate: null,
          endDate: null
        }));
        return;
      }

      if (clickedDate < dateRange.startDate) {
        setDateRange(prev => ({
          ...prev,
          startDate: clickedDate,
          endDate: null
        }));
        return;
      }
      if (clickedDate >= dateRange.startDate) {
        setDateRange(prev => ({
          ...prev,
          endDate: clickedDate
        }));
        return;
      }
    }

    if (dateRange.startDate && dateRange.endDate) {
      if (isSameDate(clickedDate, dateRange.startDate)) {
        setDateRange(prev => ({
          ...prev,
          startDate: null,
          endDate: null
        }));
        return;
      }
      if (isSameDate(clickedDate, dateRange.endDate)) {
        setDateRange(prev => ({
          ...prev,
          endDate: null
        }));
        return;
      }
      setDateRange(prev => ({
        ...prev,
        startDate: clickedDate,
        endDate: null
      }));
      return;
    }
  };

  const handleTimeChange = (field, value, isStart) => {
    const timeKey = isStart ? 'startTime' : 'endTime';
    let parsedValue = parseInt(value.toString());

    setDateRange(prev => {
      let newTime = { ...prev[timeKey] };
      if (field === 'ampm') {
        if (value === 'PM' && newTime.ampm === 'AM') {
          if (newTime.hours < 12) newTime.hours = (newTime.hours % 12) + 12;
        } else if (value === 'AM' && newTime.ampm === 'PM') {
          if (newTime.hours >= 12) newTime.hours = newTime.hours - 12;
          if (newTime.hours === 0) newTime.hours = 12;
        }
        newTime.ampm = value;
      } else {
        if (field === 'hours') {
          if (is24HourFormat) {
            if (isNaN(parsedValue) || parsedValue < 0) parsedValue = 0;
            if (parsedValue > 23) parsedValue = 23;
            newTime.hours = parsedValue;
            newTime.ampm = parsedValue >= 12 ? 'PM' : 'AM';
          } else {
            if (isNaN(parsedValue) || parsedValue < 1) parsedValue = 1;
            if (parsedValue > 12) parsedValue = 12;
            newTime.hours = parsedValue;
          }
        } else if (field === 'minutes' || field === 'seconds') {
          if (isNaN(parsedValue) || parsedValue < 0) parsedValue = 0;
          if (parsedValue > 59) parsedValue = 59;
          newTime[field] = String(parsedValue).padStart(2, '0');
        }
      }
      return {
        ...prev,
        [timeKey]: newTime
      };
    });
  };

  const handleTimeFormatChange = (is24Hour, isStart) => {
    setIs24HourFormat(is24Hour);
    setDateRange(prev => {
      const convertTime = (time) => {
        let hours = time.hours;
        let ampm = time.ampm;
        if (is24Hour) {
          if (ampm === 'PM' && hours < 12) hours += 12;
          if (ampm === 'AM' && hours === 12) hours = 0;
          if (hours < 0) hours = 0;
          if (hours > 23) hours = 23;
          return { ...time, hours, ampm: hours >= 12 ? 'PM' : 'AM' };
        } else {
          if (hours === 0) { hours = 12; ampm = 'AM'; }
          else if (hours > 12) { hours = hours - 12; ampm = 'PM'; }
          else if (hours === 12) { ampm = 'PM'; }
          else { ampm = 'AM'; }
          if (hours < 1) hours = 1;
          if (hours > 12) hours = 12;
          return { ...time, hours, ampm };
        }
      };
      return {
        ...prev,
        startTime: convertTime(prev.startTime),
        endTime: convertTime(prev.endTime)
      };
    });
    if (isStart) {
      setShowTimeFormatOptionsStart(false);
    } else {
      setShowTimeFormatOptionsEnd(false);
    }
  };

  const handleTimeInputChange = (field, value, isStart) => {
    const key = isStart ? 'startTime' : 'endTime';
    setTimeInputs(prev => ({
      ...prev,
      [key]: {
        ...prev[key],
        [field]: value,
      },
    }));
  };

  const handleTimeInputBlur = (field, isStart) => {
    const key = isStart ? 'startTime' : 'endTime';
    let value = timeInputs[key][field];
    let parsedValue = parseInt(value, 10);
    if (field === 'hours') {
      if (is24HourFormat) {
        if (isNaN(parsedValue) || parsedValue < 0) parsedValue = 0;
        if (parsedValue > 23) parsedValue = 23;
      } else {
        if (isNaN(parsedValue) || parsedValue < 1) parsedValue = 1;
        if (parsedValue > 12) parsedValue = 12;
      }
    } else if (field === 'minutes' || field === 'seconds') {
      if (isNaN(parsedValue) || parsedValue < 0) parsedValue = 0;
      if (parsedValue > 59) parsedValue = 59;
    }
    handleTimeChange(field, parsedValue, isStart);
  };

  const handleMonthSelect = (newMonth, isLeft) => {
    if (isLeft) {
      setLeftMonth(newMonth);
      if (leftYear === rightYear) {
        // Right month should always be one month ahead in the same year
        let nextMonth = newMonth + 1;
        let nextYear = leftYear;
        if (nextMonth > 11) {
          nextMonth = 0;
          nextYear = leftYear + 1;
        }
        setRightMonth(nextMonth);
        setRightYear(nextYear);
      }
      // If years differ, do not force right month
    } else {
      setRightMonth(newMonth);
      if (leftYear === rightYear) {
        // Left month should always be one month behind in the same year
        let prevMonth = newMonth - 1;
        let prevYear = rightYear;
        if (prevMonth < 0) {
          prevMonth = 11;
          prevYear = rightYear - 1;
        }
        setLeftMonth(prevMonth);
        setLeftYear(prevYear);
      }
      // If years differ, do not force left month
    }
  };

  const renderCalendar = (month, year, isLeft) => {
    const daysInMonth = getDaysInMonth(month, year);
    const firstDay = getFirstDayOfMonth(month, year);
    const days = [];
    
    const prevMonth = month === 0 ? 11 : month - 1;
    const prevYear = month === 0 ? year - 1 : year;
    const daysInPrevMonth = getDaysInMonth(prevMonth, prevYear);
    
    for (let i = firstDay - 1; i >= 0; i--) {
      const day = daysInPrevMonth - i;
      const currentDate = new Date(prevYear, prevMonth, day);
      let dayClass = `${styles.calendarDay} ${styles.prevMonth}`;
      if (isLeft && isSameDate(currentDate, dateRange.startDate)) dayClass += ` ${styles.selected}`;
      days.push(
        <div key={`prev-${day}`} className={dayClass} onClick={() => {
          if (isLeft) {
            // Move left calendar to previous month and select that date
            let newMonth = month - 1;
            let newYear = year;
            if (newMonth < 0) {
              newMonth = 11;
              newYear -= 1;
            }
            setLeftMonth(newMonth);
            setLeftYear(newYear);
            setDateRange(prev => ({
              ...prev,
              startDate: new Date(prevYear, prevMonth, day),
              endDate: null
            }));
          } else {
            // Move left calendar to previous month and select that date
            let newMonth = month - 1;
            let newYear = year;
            if (newMonth < 0) {
              newMonth = 11;
              newYear -= 1;
            }
            setLeftMonth(newMonth);
            setLeftYear(newYear);
            setDateRange(prev => ({
              ...prev,
              startDate: new Date(prevYear, prevMonth, day),
              endDate: null
            }));
          }
        }}>
          {day}
        </div>
      );
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const currentDate = new Date(year, month, day);
      let isSelected = false;
      if (isSameDate(currentDate, dateRange.startDate) || isSameDate(currentDate, dateRange.endDate)) {
        isSelected = true;
      }
      let isInRange = false;
      if (dateRange.startDate && dateRange.endDate) {
        const start = new Date(dateRange.startDate.getFullYear(), dateRange.startDate.getMonth(), dateRange.startDate.getDate());
        const end = new Date(dateRange.endDate.getFullYear(), dateRange.endDate.getMonth(), dateRange.endDate.getDate());
        const current = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());
        isInRange = current >= start && current <= end;
      }
      let dayClass = `${styles.calendarDay} ${styles.currentMonth}`;
      if (isSelected) dayClass += ` ${styles.selected}`;
      if (isInRange) dayClass += ` ${styles.inRange}`;
      if (isInRange && isSameDate(currentDate, dateRange.startDate)) dayClass += ` ${styles['range-start']}`;
      if (isInRange && isSameDate(currentDate, dateRange.endDate)) dayClass += ` ${styles['range-end']}`;
      days.push(
        <div
          key={day}
          className={dayClass}
          onClick={() => {
            // Unselect logic
            if (isSameDate(currentDate, dateRange.startDate) && isSameDate(currentDate, dateRange.endDate)) {
              setDateRange(prev => ({ ...prev, startDate: null, endDate: null }));
            } else if (isSameDate(currentDate, dateRange.startDate)) {
              setDateRange(prev => ({ ...prev, startDate: null }));
            } else if (isSameDate(currentDate, dateRange.endDate)) {
              setDateRange(prev => ({ ...prev, endDate: null }));
            } else {
              // Range selection logic for both sides
              if (!dateRange.startDate || (dateRange.startDate && dateRange.endDate)) {
                // Start a new selection
                setDateRange(prev => ({ ...prev, startDate: currentDate, endDate: null }));
              } else if (dateRange.startDate && !dateRange.endDate) {
                if (currentDate > dateRange.startDate) {
                  setDateRange(prev => ({ ...prev, endDate: currentDate }));
                } else {
                  setDateRange(prev => ({ ...prev, startDate: currentDate, endDate: null }));
                }
              }
            }
            // Optionally update visible month/year
            if (isLeft) {
              setLeftMonth(month);
              setLeftYear(year);
            } else {
              setRightMonth(month);
              setRightYear(year);
            }
          }}
        >
          {day}
        </div>
      );
    }

    const totalCells = 42;
    for (let day = 1; days.length < totalCells; day++) {
      const currentDate = new Date(year, month + 1, day);
      let dayClass = `${styles.calendarDay} ${styles.nextMonth}`;
      if (!isLeft && isSameDate(currentDate, dateRange.endDate)) dayClass += ` ${styles.selected}`;
      days.push(
        <div key={`next-${day}`} className={dayClass} onClick={() => {
          if (!isLeft) {
            // Move right calendar to next month and select that date
            let newMonth = month + 1;
            let newYear = year;
            if (newMonth > 11) {
              newMonth = 0;
              newYear += 1;
            }
            setRightMonth(newMonth);
            setRightYear(newYear);
            setDateRange(prev => ({
              ...prev,
              endDate: new Date(year, month + 1, day)
            }));
          } else {
            // Move right calendar to next month and select that date
            let newMonth = month + 1;
            let newYear = year;
            if (newMonth > 11) {
              newMonth = 0;
              newYear += 1;
            }
            setRightMonth(newMonth);
            setRightYear(newYear);
            setDateRange(prev => ({
              ...prev,
              startDate: new Date(year, month + 1, day),
              endDate: null
            }));
          }
        }}>
          {day}
        </div>
      );
    }

    const currentTime = isLeft ? dateRange.startTime : dateRange.endTime;
    const showTimeFormatOptions = isLeft ? showTimeFormatOptionsStart : showTimeFormatOptionsEnd;
    const timeFormatRef = isLeft ? timeFormatRefStart : timeFormatRefEnd;
    const setShowTimeFormatOptions = isLeft ? setShowTimeFormatOptionsStart : setShowTimeFormatOptionsEnd;

    return (
      <div className={styles.calendarContainer}>
        <div className={styles.calendarHeader}>
          <div className={styles.dropdownContainer}>
            
<Dropdown
  key={month}
  options={monthOptions}
  placeholder={months[month]}
  value={month.toString()}
  onSelect={(option) => {
    if (!option || !option.value) return;
    const newMonth = parseInt(option.value);
    handleMonthSelect(newMonth, isLeft);
  }}
  height="200px"
  multiple={false}
  searchable={false}
  floatingLabel={false}
  className={styles.dropdownContainer}
/>
</div>
          <Dropdown
            key={year}
            options={yearOptions}
            placeholder={year.toString()}
            value={year.toString()}
            onSelect={(option) => {
              if (!option || !option.value) return;
              const newYear = parseInt(option.value);
              if (isLeft) {
                setLeftYear(newYear);
                if (newYear === rightYear && leftMonth === rightMonth) {
                  let nextMonth = rightMonth + 1;
                  let nextYear = rightYear;
                  if (nextMonth > 11) {
                    nextMonth = 0;
                    nextYear += 1;
                  }
                  setRightMonth(nextMonth);
                  setRightYear(nextYear);
                }
              } else {
                setRightYear(newYear);
                if (newYear === leftYear && rightMonth === leftMonth) {
                  let nextMonth = rightMonth + 1;
                  let nextYear = rightYear;
                  if (nextMonth > 11) {
                    nextMonth = 0;
                    nextYear += 1;
                  }
                  setRightMonth(nextMonth);
                  setRightYear(nextYear);
                }
              }
            }}
            height="200px"
            multiple={false}
            searchable={true}
            floatingLabel={false}
            className={styles.dropdownContainer}
            scrollToValue={year.toString()}
            onScrolledToValue={isLeft ? () => setLeftYearScrolled(true) : () => setRightYearScrolled(true)}
          />
           
        </div>
        <div className={styles.dayNames}>
          {dayNames.map(day => (
            <div key={day} className={styles.dayName}>
              {day}
            </div>
          ))}
        </div>
        <div className={styles.calendarGrid}>
          {days}
        </div>
        <div className={styles.timePicker}>
          <div className={styles.timeHeader}>
            <span className={styles.timeLabel}>Time</span>
            <span className={styles.defaultLabel}>Default</span>
          </div>
          
          <div className={styles.timeMainControls}>
            <div className={styles.timeInputGroup}>
              <div className={styles.timeInputs}>
                <input
                  type="number"
                  value={timeInputs[isLeft ? 'startTime' : 'endTime'].hours}
                  onChange={e => handleTimeInputChange('hours', e.target.value, isLeft)}
                  onBlur={() => handleTimeInputBlur('hours', isLeft)}
                  className={styles.timeInput}
                  min={is24HourFormat ? "0" : "1"}
                  max={is24HourFormat ? "23" : "12"}
                />
                <span className={styles.timeSeparator}>:</span>
                <input
                  type="number"
                  value={timeInputs[isLeft ? 'startTime' : 'endTime'].minutes}
                  onChange={e => handleTimeInputChange('minutes', e.target.value, isLeft)}
                  onBlur={() => handleTimeInputBlur('minutes', isLeft)}
                  className={styles.timeInput}
                  min="0"
                  max="59"
                />
                <span className={styles.timeSeparator}>:</span>
                <input
                  type="number"
                  value={timeInputs[isLeft ? 'startTime' : 'endTime'].seconds}
                  onChange={e => handleTimeInputChange('seconds', e.target.value, isLeft)}
                  onBlur={() => handleTimeInputBlur('seconds', isLeft)}
                  className={styles.timeInput}
                  min="0"
                  max="59"
                />
              </div>
              {!is24HourFormat && (
                <div className={styles.ampmContainer}>
                  <button
                    onClick={() => handleTimeChange('ampm', 'AM', isLeft)}
                    className={`${styles.ampmButton} ${currentTime.ampm === 'AM' ? styles.active : ''}`}
                  >
                    AM
                  </button>
                  <button
                    onClick={() => handleTimeChange('ampm', 'PM', isLeft)}
                    className={`${styles.ampmButton} ${currentTime.ampm === 'PM' ? styles.active : ''}`}
                  >
                    PM
                  </button>
                </div>
              )}
            </div>
            
            <div className={styles.timeFormatGroup}>
              <div className={styles.timeDisplayContainer}>
                <div className={styles.timeDisplay} onClick={() => setShowTimeFormatOptions(prev => !prev)}>
                  {is24HourFormat ? '24h' : '12h'}
                  <div className={styles.dropdownArrow}>▼</div>
                  
                  {showTimeFormatOptions && (
                    <div ref={timeFormatRef} className={styles.timeFormatOptions}>
                      <div 
                        onClick={(e) => {
                          e.stopPropagation();
                          setIs24HourFormat(false);
                          if (isLeft) {
                            setShowTimeFormatOptionsStart(false);
                          } else {
                            setShowTimeFormatOptionsEnd(false);
                          }
                          handleTimeFormatChange(false, isLeft);
                        }} 
                        className={!is24HourFormat ? styles.active : ''}
                      >
                        12h
                      </div>
                      <div 
                        onClick={(e) => {
                          e.stopPropagation();
                          setIs24HourFormat(true);
                          if (isLeft) {
                            setShowTimeFormatOptionsStart(false);
                          } else {
                            setShowTimeFormatOptionsEnd(false);
                          }
                          handleTimeFormatChange(true, isLeft);
                        }} 
                        className={is24HourFormat ? styles.active : ''}
                      >
                        24h
                      </div>
                    </div>
                  )}
                  
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
    );
   
  };
 
  const clearDates = () => {
    setDateRange(prev => ({
      ...prev,
      startDate: null,
      endDate: null,
    }));
    const now = new Date();
    setLeftMonth(now.getMonth());
    setLeftYear(now.getFullYear());
    const nextMonth = now.getMonth() + 1;
    setRightMonth(nextMonth > 11 ? 0 : nextMonth);
    setRightYear(nextMonth > 11 ? now.getFullYear() + 1 : now.getFullYear());
    if (typeof onClear === 'function') onClear();
  };

  const formatDateTime = (date, time) => {
    if (!date || !time) return '';
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    let hours = time.hours;
    if (!is24HourFormat) {
      if (time.ampm === 'PM' && hours < 12) hours += 12;
      if (time.ampm === 'AM' && hours === 12) hours = 0;
    }
    hours = String(hours).padStart(2, '0');
    const minutes = String(time.minutes).padStart(2, '0');
    const seconds = String(time.seconds).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  };

  const handleCloseCalendar = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsOpen(false);
      setIsClosing(false);
      if (typeof onClear === 'function') onClear();
    }, 250); // match close animation duration
  };

  // Add this helper to format date and time together
  const formatDateWithTime = (date, time) => {
    if (!date || !time) return '';
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    let hours = time.hours;
    let minutes = String(time.minutes).padStart(2, '0');
    let seconds = String(time.seconds).padStart(2, '0');
    if (is24HourFormat) {
      hours = String(hours).padStart(2, '0');
      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    } else {
      let ampm = time.ampm || (hours >= 12 ? 'PM' : 'AM');
      let displayHours = hours;
      if (typeof hours === 'string') displayHours = parseInt(hours, 10);
      if (displayHours === 0) displayHours = 12;
      else if (displayHours > 12) displayHours = displayHours - 12;
      displayHours = String(displayHours).padStart(2, '0');
      return `${year}-${month}-${day} ${displayHours}:${minutes}:${seconds} ${ampm}`;
    }
  };

  // Add this handler for the Apply button
  const handleApply = () => {
    if (onApply) {
      onApply(dateRange);
    }
    setIsOpen(false);
    setIsClosing(false);
  };

  if (!isOpen) return null;
  return (
    <div className={styles.appContainer}>
      <div className={styles.dateInputRow}>
        {/* Calendar Popup */}
        <div
          ref={calendarRef}
          className={styles.calendarPopup + (isClosing ? ' ' + styles.closing : '')}
          style={{ left: 0, top: '0', position: 'absolute', zIndex: 1000 }}
        >
          <div className={styles.popupHeader}>
            <div className={styles.popupActions}>
              <button className={`${styles.applyButton} ${styles.clearButton}`} onClick={handleApply}>Apply</button>
              <button onClick={clearDates} className={styles.clearButton}>
                Clear
              </button>
              <button onClick={(e) => {
                e.stopPropagation();
                clearDates();
                handleCloseCalendar();
              }} className={styles.closeButton}>
                <Icon name="cross" width={16} height={16} ></Icon>
              </button>
            </div>
          </div>
          <div key={dateRange.startDate ? dateRange.startDate.getTime() : 'no-date'} className={styles.calendarsContainer}>
            {renderCalendar(leftMonth, leftYear, true)}
            <div className={styles.calendarSeparator}></div>
            {renderCalendar(rightMonth, rightYear, false)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calendar;