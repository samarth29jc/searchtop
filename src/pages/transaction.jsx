import React, { useState } from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import styles from './transaction.module.css';
import Dropdown from '../components/utilitis/dropdown/Dropdown';
import { Input } from '../components/utilitis/Input';
import { TextInput } from '../components/utilitis/inputs/Input.jsx';
import Icon from '../media/icon/icons.jsx';
import Calendar from '../components/utilitis/calender/Calender.jsx';

function formatDateTime(date, time) {
  if (!date || !time) return '';
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  let hours = time.hours;
  let minutes = String(time.minutes).padStart(2, '0');
  let ampm = time.ampm || (hours >= 12 ? 'PM' : 'AM');
  let displayHours = hours;
  if (typeof hours === 'string') displayHours = parseInt(hours, 10);
  if (displayHours === 0) displayHours = 12;
  else if (displayHours > 12) displayHours = displayHours - 12;
  displayHours = String(displayHours).padStart(2, '0');
  return `${yyyy}-${mm}-${dd} ${displayHours}:${minutes} ${ampm}`;
}

const Transaction = () => {
  const [showMore, setShowMore] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [startDateValue, setStartDateValue] = useState('');
  const [endDateValue, setEndDateValue] = useState('');
  // Simulate role (replace with real sessionStorage in real app)
  const role = sessionStorage.getItem('role') || 'client';

  // Dummy options for dropdowns
  const statusOptions = ['Success', 'Pending', 'Failed'];
  const merchantOptions = ['Merchant 1', 'Merchant 2'];
  const gatewayOptions = ['Gateway 1', 'Gateway 2'];
  const quickSearchOptions = ['Today', 'Yesterday', 'This Week', 'Last Week'];
  const midOptions = ['MID 1', 'MID 2'];
  const countryOptions = ['USA', 'India'];
  const cardTypeOptions = ['Visa', 'MasterCard'];

  // Handle date selection from calendar
  const handleCalendarApply = (range) => {
    if (range && range.startDate && range.startTime) {
      setStartDateValue(formatDateTime(range.startDate, range.startTime));
    }
    if (range && range.endDate && range.endTime) {
      setEndDateValue(formatDateTime(range.endDate, range.endTime));
    }
    setIsCalendarOpen(false);
  };

  // Handle clear from calendar
  const handleCalendarClear = () => {
    setStartDateValue('');
    setEndDateValue('');
    setIsCalendarOpen(false);
  };

  // Render search form fields
  const renderSearchFields = () => (
    <div className={styles.searchContainer}>
      {/* Row 1 */}
      <div className={styles.flexRow}>
        <div className={styles.inputWrapperTxnId}>
          <TextInput placeholder="Txn ID/Merchant Txn ID/Email" onChange={() => {}} />
        </div>
        <div className={styles.inputWrapperStatus + ' ' + styles.ml18}>
          <Dropdown className={styles.inputStatus} options={statusOptions} placeholder="Select Status" />
        </div>
        <div className={styles.inputWrapperMerchant + ' ' + styles.ml18}>
          <Dropdown className={styles.inputMerchant} options={merchantOptions} placeholder="Select Client" />
        </div>
        <div className={styles.inputWrapperGateway + ' ' + styles.ml18}>
          <Dropdown className={styles.inputGateway} options={gatewayOptions} placeholder="Select Acquirer" />
        </div>
      </div>
      {/* Row 2 */}
      <div className={styles.flexRow}>
        <div className={styles.dateRangeContainer}>
          <div className={styles.dateRangeWrapper}>
            <div className={styles.inputWrapperStartDate}>
              <TextInput
                type="text"
                placeholder="Start date"
                value={startDateValue}
                onChange={() => {}}
                readOnly
              />
            </div>
            <div className={styles.inputWrapperArrow}>
              <span className={styles.inputArrow}>&rarr;</span>
            </div>
            <div className={styles.inputWrapperEndDate}>
              <TextInput
                type="text"
                placeholder="End date"
                value={endDateValue}
                onChange={() => {}}
                readOnly
              />
            </div>
            <div className={styles.inputWrapperCalendarIcon + ' ' + styles.ml18}>
              <button
                type="button"
                onClick={() => setIsCalendarOpen(true)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
                aria-label="Open calendar"
              >
                <Icon name="calendar" />
              </button>
            </div>
          </div>
          {isCalendarOpen && (
            <div className={styles.calendarPopupBelow}>
              <Calendar isOpen={isCalendarOpen} setIsOpen={setIsCalendarOpen} onApply={handleCalendarApply} onClear={handleCalendarClear} />
            </div>
          )}
        </div>
        <div className={styles.inputWrapperQuickSearch + ' ' + styles.ml18}>
          <Dropdown className={styles.inputQuickSearch} options={quickSearchOptions} placeholder="Quick Search" />
        </div>
      </div>
      {/* Animated Rows: 3rd and 4th rows */}
      <div className={`${styles.animatedRows} ${showMore ? styles.show : styles.hide}`}>
        {/* Row 3 */}
        <div className={styles.flexRow}>
          <div className={styles.inputWrapperCountry}>
            <Dropdown className={styles.inputCountry} options={countryOptions} placeholder="Select Country" />
          </div>
          <div className={styles.inputWrapperCardType + ' ' + styles.ml18}>
            <Dropdown className={styles.inputCardType} options={cardTypeOptions} placeholder="Select Card Type" />
          </div>
          <div className={styles.inputWrapperCardNo + ' ' + styles.ml18}>
            <Dropdown className={styles.inputCurrency} options={['USD', 'EUR', 'INR']} placeholder="Select Currency" />
          </div>
          <div className={styles.inputWrapperMID + ' ' + styles.ml18}>
            <Dropdown className={styles.inputMID} options={midOptions} placeholder="Select MID" />
          </div>
        </div>
        {/* Row 4: Email below Country, Message below Card Type, other columns empty for alignment */}
        <div className={styles.flexRow}>
          <div className={styles.smallInputWrapper}>
            <TextInput placeholder="Enter first 6 digit or last 4 digit" onChange={() => {}} />
          </div>
          <div className={styles.smallInputWrapper + ' ' + styles.ml18}>
            <TextInput placeholder="Message" onChange={() => {}} />
          </div>
          <div style={{ flex: 1 }} />
          <div style={{ flex: 1 }} />
        </div>
      </div>
      {/* Action Row */}
      <div className={styles.flexRow}>
        <div className={styles.showMoreLessWrapper}>
          <button
            className={styles.showMoreBtn}
            onClick={() => setShowMore((prev) => !prev)}
          >
            {showMore ? 'Show Less ' : 'Show More '}
          </button>
        </div>
        <div className={styles.actionButtonsWrapper}>
          <button className={styles.searchBtn}><span role="img" aria-label="search"></span> Search Now</button>
          <button className={styles.clearBtn}>Clear</button>
        </div>
      </div>
    </div>
  );

  return (
    <div className={styles.transactionPageWrapper}>
      <Header />
      <Sidebar />
      <div className={styles.transactionContentWrapper}>
        <h2 className={styles.pageTitle}>Transaction Monitoring</h2>
        {renderSearchFields()}
      </div>
    </div>
  );
};

export default Transaction;
