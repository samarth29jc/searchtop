import React from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import styles from './transaction.module.css';
import Dropdown from '../components/utilitis/dropdown/Dropdown';
import { Input } from '../components/utilitis/Input';

const Transaction = () => {
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

  // Render search form fields
  const renderSearchFields = () => (
    <div className={styles.searchContainer}>
      {/* Row 1 */}
      <div className={styles.flexRow}>
        <div className={styles.inputWrapperTxnId}>
          <Input className={styles.inputTxnId} placeholder="Txn ID/Merchant Txn ID/Email" />
        </div>
        <div className={styles.inputWrapperStatus}>
          <Dropdown className={styles.inputStatus} options={statusOptions} placeholder="Select Status" />
        </div>
        <div className={styles.inputWrapperMerchant}>
          <Dropdown className={styles.inputMerchant} options={merchantOptions} placeholder="Select Merchant" />
        </div>
        <div className={styles.inputWrapperGateway}>
          <Dropdown className={styles.inputGateway} options={gatewayOptions} placeholder="Select Payment Gateway" />
        </div>
      </div>
      {/* Row 2 */}
      <div className={styles.flexRow}>
        <div className={styles.inputWrapperStartDate}>
          <Input className={styles.inputStartDate} type="date" placeholder="Start date" />
        </div>
        <div className={styles.inputWrapperArrow}>
          <span className={styles.inputArrow}>&rarr;</span>
        </div>
        <div className={styles.inputWrapperEndDate}>
          <Input className={styles.inputEndDate} type="date" placeholder="End date" />
        </div>
        <div className={styles.inputWrapperQuickSearch}>
          <Dropdown className={styles.inputQuickSearch} options={quickSearchOptions} placeholder="Quick Search" />
        </div>
      </div>
      {/* Row 3 */}
      <div className={styles.flexRow}>
        <div className={styles.inputWrapperCountry}>
          <Dropdown className={styles.inputCountry} options={countryOptions} placeholder="Select Country" />
        </div>
        <div className={styles.inputWrapperCardType}>
          <Dropdown className={styles.inputCardType} options={cardTypeOptions} placeholder="Select Card Type" />
        </div>
        <div className={styles.inputWrapperCardNo}>
          <Input className={styles.inputCardNo} placeholder="Card No." />
        </div>
        <div className={styles.inputWrapperMID}>
          <Dropdown className={styles.inputMID} options={midOptions} placeholder="Select MID" />
        </div>
      </div>
      {/* Row 4 */}
      <div className={styles.flexRow}>
        <div className={styles.emailMessageWrapper}>
          <Input className={styles.inputEmail} placeholder="Email" />
        </div>
        {/* <div className={styles.spacer} />
        <div className={styles.spacer} /> */}
        <div className={styles.emailMessageWrapper}>
          <Input className={styles.inputMessage} placeholder="Message" />
        </div>
      </div>
      {/* Action Row */}
      <div className={styles.flexRow}>
        <button className={styles.searchBtn}><span role="img" aria-label="search">🔍</span> Search Now</button>
        <button className={styles.clearBtn}>Clear</button>
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
