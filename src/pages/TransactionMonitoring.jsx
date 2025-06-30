import React, { useState, useEffect } from "react";

import * as XLSX from 'xlsx';

import "../styles/pages.css";

// utilities
import Button from "../components/utilitis/Button";
import { Input, Select } from "../components/utilitis/Input";
import { TextInput } from "../components/utilitis/inputs/Input.jsx";
import Dropdown from "../components/utilitis/dropdown/Dropdown.jsx";
// import Calendar from "../components/utilitis/Calendar";
import TransactionTable from "../components/Table";
import ViewTransaction from "../pages/ViewTransaction";

import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import { apiRequest } from "../services/apiService";

//icon
import Icon from "../media/icon/icons";
import Loader from "../components/utilitis/Loader";
import Heading, { headings } from "../components/utilitis/Heading.jsx";

const TransactionMonitoring = () => {
	const role = sessionStorage.getItem("role");
	const currentYear = new Date().getFullYear();
	const [clientId, setClientId] = useState(null);
	const fetchDistinctValuesEndpoint = "api/v1/utility/fetch_distinct_values?column=";
	const fetchClient = "api/v1/utility/getmetadata";

	const [showMoreOptions, setShowMoreOptions] = useState(false);
	const defaultFromDate = new Date(2023, 0, 1, 23, 59, 59);
	const now = new Date();

	const formatDateForInput = (date) => {
		const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
		return localDate.toISOString().slice(0, 16);
	};

	const [filters, setFilters] = useState({
		searchIds: "",
		mid: "",
		currency: "",
		country: "",
		cardType: "",
		status: "",
		merchant: "",
		acquirer: "",
		fromDate: formatDateForInput(defaultFromDate),
		toDate: formatDateForInput(now),
		cardNumber: "",
		name: "",
		email: "",
	});


	const [midOptions, setMidOptions] = useState([]);
	const [countryOptions, setCountryOptions] = useState([]);
	const [currencyOptions, setCurrencyOptions] = useState([
		'USD', 'EUR', 'INR', 'GBP', 'JPY',
	]);
	const [statusOptions, setStatusOptions] = useState([]);
	const [merchantOptions, setMerchantOptions] = useState([]);
	const [paymentgatewayOptions, setPaymentgatewayOptions] = useState([]);
	const [cardTypeOptions, setCardTypeOptions] = useState(['Visa', 'MasterCard']);
	const [ids, setIds] = useState([]);
	const [showDropdown, setShowDropdown] = useState(false);
	const [currentPage, setCurrentPage] = useState(1);
	const [rowsPerPage, setRowsPerPage] = useState(10);

	const [headerLabels] = useState([
		{ heading: "S.No", label: "sno" },
		{ heading: "Txn ID", label: "transaction_ref" },
		{ heading: "Client Txn ID", label: "client_txn_id" },
		{ heading: "Merchant", label: "client_name" },
		{ heading: "Payment Gateway", label: "acquirer_name" },
		{ heading: "Status", label: "status" },
		{ heading: "Message", label: "message" },
		{ heading: "Transaction Date", label: "transaction_date" },
		{ heading: "Customer Name", label: "customer_name" },
		{ heading: "Email", label: "email" },
		{ heading: "Country", label: "country" },
		{ heading: "Cary Type", label: "card_type" },
		{ heading: "Amount", label: "amount" },
		{ heading: "Currency", label: "currency_code" },
	]);

	const [merchant_headerLabels] = useState([
		{ heading: "S.No", label: "sno" },
		{ heading: "Txn ID", label: "transaction_ref" },
		{ heading: "Client Txn ID", label: "client_txn_id" },
		{ heading: "Status", label: "status" },
		{ heading: "Message", label: "message" },
		{ heading: "Transaction Date", label: "transaction_date" },
		{ heading: "Customer Name", label: "customer_name" },
		{ heading: "Email", label: "email" },
		{ heading: "Card Number", label: "card_number" },
		{ heading: "Country", label: "country" },
		{ heading: "Card Type", label: "card_type" },
		{ heading: "Amount", label: "amount" },
		{ heading: "currency", label: "currencies" },
	])

	const [activeQuickSearchbtn, setActiveQuickSearchbtn] = useState("");
	const [viewData, setViewData] = useState(null);

	const [searchedResult, setSearchedResult] = useState(null);
	const [, setErrorMessage] = useState("");
	const [sortOrder, setSortOrder] = useState("ascending");
	const [, setSortedData] = useState([]);
	const [loading, setLoading] = useState(false);
	const [overallTotal, setOverallTotal] = useState(0);
	const [transactionTotal, setTransactionTotal] = useState(0);
	const [totalAmount, setTotalAmount] = useState(0);

	const handleTotalAmountChange = (amount) => {
		setTotalAmount(amount);
	};

	const executeSearch = (page) => {
		setCurrentPage(page);
		handleSearch(page, rowsPerPage);
	};

	const handleChildAction = (actionType, value) => {
		if (actionType === "PAGE_CHANGE") {
			setCurrentPage(value);
		} else if (actionType === "ROWS_CHANGE") {
			setRowsPerPage(Number(value));
			setCurrentPage(1);
		}
	};

	const sortData = (data) => {
		if (!Array.isArray(data)) {
			return [];
		}
		return [...data].sort((a, b) => {
			const dateA = new Date(a.transactiondate);
			const dateB = new Date(b.transactiondate);
			return sortOrder === "ascending" ? dateA - dateB : dateB - dateA;
		});
	};

	useEffect(() => {
		fetchClientValue();
		fetchData("company");
		fetchData("acquirer");
		fetchData("mid");
		const loadOptionsAndSortData = async () => {
			const countryValues = await fetchDistinctValues("country");
			setCountryOptions(countryValues || []);

			const statusValues = await fetchDistinctValues("status");
			setStatusOptions(statusValues || []);

			const sorted = sortData(searchedResult);
			setSortedData(sorted);
		};

		loadOptionsAndSortData();
	}, [searchedResult, sortOrder]);

	const handleIconClick = () => {
		setShowDropdown(!showDropdown);
	};

	// const handleSortToggle = () => {
	// 	setSortOrder((prevOrder) =>
	// 		prevOrder === "ascending" ? "descending" : "ascending"
	// 	);
	// };

	const handleViewClick = (data) => {
		setViewData(data);
	};

	const handleBackClick = () => {
		setViewData(null);
	};

	const handleKeyDown = (event) => {
		if (event.key === "Enter") {
			event.preventDefault();
			handleSearch();
		}
	};

	const handleShowMore = () => {
		setShowMoreOptions(!showMoreOptions);
	};

	const handleInputChange = (filtersKey, value) => {
		if (filtersKey === 'searchIds') {
			const newIds = value
				.trim()
				.split(/\s+/)
				.filter((id) => id);
			setIds(newIds);

			if (newIds.length <= 1) {
				setShowDropdown(false);
			}

			setFilters((prevData) => ({
				...prevData,
				[filtersKey]: value,
			}));
		} else {
			setFilters((prevData) => ({
				...prevData,
				[filtersKey]: value,
			}));
		}
	};

	const handleQuickSearch = (period) => {
		setActiveQuickSearchbtn(period);

		const now = new Date();
		let fromDate, toDate;

		const resetTimeToStartOfDay = (date) => {
			return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0, 0);
		};

		switch (period) {
			case "Today":
				fromDate = resetTimeToStartOfDay(now);
				toDate = new Date(now);
				break;

			case "Yesterday":
				const yesterday = new Date();
				yesterday.setDate(yesterday.getDate() - 1);
				fromDate = resetTimeToStartOfDay(yesterday);
				toDate = new Date(
					yesterday.getFullYear(),
					yesterday.getMonth(),
					yesterday.getDate(),
					23,
					59,
					59,
					999
				);
				break;

			case "This Week":
				const startOfWeek = resetTimeToStartOfDay(new Date());
				startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
				fromDate = startOfWeek;
				toDate = new Date(now);
				break;

			case "Last Week":
				const lastWeekStart = resetTimeToStartOfDay(new Date());
				lastWeekStart.setDate(lastWeekStart.getDate() - lastWeekStart.getDay() - 7);
				const lastWeekEnd = resetTimeToStartOfDay(new Date());
				lastWeekEnd.setDate(lastWeekEnd.getDate() - lastWeekEnd.getDay() - 1);
				toDate = new Date(
					lastWeekEnd.getFullYear(),
					lastWeekEnd.getMonth(),
					lastWeekEnd.getDate(),
					23,
					59,
					59,
					999
				);
				fromDate = lastWeekStart;
				break;

			case "This Month":
				fromDate = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0);
				toDate = new Date(now);
				break;

			case "Last Month":
				fromDate = new Date(now.getFullYear(), now.getMonth() - 1, 1, 0, 0, 0, 0);
				toDate = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);
				break;

			case "This Year":
				fromDate = new Date(now.getFullYear(), 0, 1, 0, 0, 0, 0);
				toDate = new Date(now);
				break;

			default:
				break;
		}

		const formatDateForInput = (date) => {
			const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
			return localDate.toISOString().slice(0, 16);
		};

		setFilters((prevFilters) => ({
			...prevFilters,
			fromDate: formatDateForInput(fromDate),
			toDate: formatDateForInput(toDate),
		}));
	};

	useEffect(() => {
		if (currentPage && rowsPerPage) {
			handleSearch(currentPage, rowsPerPage);
		}
	}, [currentPage, rowsPerPage]);

	useEffect(() => {
		const storedClientId = sessionStorage.getItem("clientId");
		if (storedClientId) {
			setClientId(storedClientId);
		} else {
			setErrorMessage("Client ID not found in local storage.");
		}
	}, []);

	const handleSearch = async (page, rows) => {
		const apiEndpoint = `api/v1/txn/search?pageSize=${rows}&pageNumber=${page}`;
		const searchedIds = filters.searchIds.trim();
		const searchedData = {
			search_ids: searchedIds.length > 0 ? searchedIds : undefined,
			status: filters.status || undefined,
			client_id: role === 'client' ? (clientId ? parseInt(clientId) : undefined) : filters.merchant ? parseInt(filters.merchant) : undefined,
			from_date: filters.fromDate || undefined,
			to_date: filters.toDate || undefined,
			mid: filters.mid || undefined,
			acquirer_id: filters.acquirer ? parseInt(filters.acquirer) : undefined,
			currency: filters.currency || undefined,
			country: filters.country || undefined,
			cardtype: filters.cardType || undefined,
			card_number: filters.cardNumber || undefined,
			name: filters.name || undefined,
			email: filters.email || undefined,
		};
		const hasValidSearchParams = Object.values(searchedData).some(
			(value) => value !== undefined && value !== null && value !== ""
		);

		if (!hasValidSearchParams) {
			setErrorMessage("Please enter at least one search criterion.");
			setOverallTotal(0);
			setSearchedResult(null);
			setTransactionTotal(null);
			return;
		}

		setLoading(true);

		try {
			const response = await apiRequest(apiEndpoint, "POST", searchedData);
			console.log(response)
			if (response?.data?.transactions?.length > 0) {
				const transactions = response.data.transactions.map((transaction) => ({
					...transaction,
					transaction_date: formatDate(transaction.transaction_date),
				}));
				setSearchedResult(transactions);
				const totalAmount = response?.data?.totalAmount || 0;
				const totalTransactions = response?.data?.totalTransactions || 0;
				setTransactionTotal(totalTransactions);
				setOverallTotal(totalAmount);
				setErrorMessage("");
			} else {
				setErrorMessage("No transactions found for the given criteria.");
				setOverallTotal(0);
				setSearchedResult(null);
			}
		} catch (error) {
			setErrorMessage("Failed to fetch search results. Please try again.");
			setOverallTotal(0);
			setSearchedResult(null);
		} finally {
			setLoading(false);
		}
	};

	const formatDate = (dateString) => {
		if (!dateString) return "";
		const date = new Date(dateString);
		const year = date.getFullYear();
		const month = String(date.getMonth() + 1).padStart(2, "0");
		const day = String(date.getDate()).padStart(2, "0");
		const hours = String(date.getHours()).padStart(2, "0");
		const minutes = String(date.getMinutes()).padStart(2, "0");
		const seconds = String(date.getSeconds()).padStart(2, "0");

		return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
	};

	const fetchDistinctValues = async (column) => {
		try {
			const response = await apiRequest(`${fetchDistinctValuesEndpoint}${column}`, "GET");

			if (response.status === "success" && response.data) {
				return response.data;
			} else {
				setErrorMessage("Failed to fetch distinct values.");
				return [];
			}
		} catch (error) {
			setErrorMessage("Failed to fetch distinct values.");
			return [];
		}
	};

	const fetchClientValue = async () => {
		if (role === 'client') {
			return;
		}
		try {
			const response = await apiRequest(fetchClient, "GET");

			if (response.status === "success" && response.data) {
				const metadata = response.data[0];

				setCurrencyOptions(metadata.currency || []);
				setCardTypeOptions(metadata.card_type || []);
			}
		} catch (error) {
		}
	};

	const fetchData = async (type) => {
		if (role === 'client') return;

		const config = {
			company: {
				endpoint: "api/v1/client",
				mapper: (item) => item.client_name,
				idMapper: (item) => item.id,
				setOptions: setMerchantOptions,
			},
			acquirer: {
				endpoint: "api/v1/acquirer",
				mapper: (item) => item.acquirer_name,
				idMapper: (item) => item.id,
				setOptions: setPaymentgatewayOptions,
			},
			mid: {
				// endpoint: "api/v1/mid/",
				mapper: (item) => item.name,
				idMapper: (item) => item.id,
				setOptions: setMidOptions,
			}
		};

		const current = config[type];
		if (!current) {
			console.error("Invalid type specified");
			return;
		}

		try {
			const response = await apiRequest(current.endpoint, "GET");

			if (response.data) {
				const formattedOptions = response.data.map(item => ({
					label: current.mapper(item),
					id: current.idMapper(item)
				}));
				current.setOptions(formattedOptions);
			}
		} catch (error) {
			console.error(`Error fetching ${type}:`, error);
		}
	};

	const handleClear = () => {
		setFilters({
			mid: "",
			searchIds: "",
			currency: "",
			country: "",
			cardType: "",
			status: "",
			merchant: "",
			cardNumber: "",
			fromDate: formatDateForInput(defaultFromDate),
			toDate: formatDateForInput(now),
			name: "",
			email: ""
		});
		setPaymentgatewayOptions([]);
		setOverallTotal(0);
		setCurrentPage(1);
		setSearchedResult(null);
		setTransactionTotal(null);
		setActiveQuickSearchbtn(null);
		setClientId(null);
	};

	const downloadCSV = () => {
		const formattedData = searchedResult.map((row, index) => ({
			...row,
		}));
		const headers = headerLabels.map((label, index) => {
			return label.label === "sno" ? "S.No." : label.label;
		});
		const worksheet = XLSX.utils.json_to_sheet(formattedData, { header: headers });

		for (let i = 0; i < formattedData.length; i++) {
			worksheet[`A${i + 2}`] = { v: i + 1, t: 'n' };
		}

		const workbook = XLSX.utils.book_new();
		XLSX.utils.book_append_sheet(workbook, worksheet, "Transactions");

		XLSX.writeFile(workbook, "transactions.xlsx");
	};

	if (role === "admin" || role === "client") {
		return (
			<>
				<Header />
				<Sidebar />
				<div className="main-screen">
					<Heading heading={headings.transaction} />
					<div className="transaction-monitoring">
						<div className="id-search-row-div">
							<div className="serachid-row" >
								<TextInput
									label="Id"
									id="searchIds"
									value={filters.searchIds}
									onChange={(e) => handleInputChange("searchIds", e.target.value)}
									placeholder="Txn id / Merchant txn id"
								/>
								{ids.length > 1 && (
									<span className="dropdown-icon" onClick={handleIconClick}>
										<Icon
											name={showDropdown ? "zoom_out" : "hide"}
											width={18}
											height={18}
											color="#dedddd"
										/>
									</span>
								)}
								{showDropdown && (
									<div className="dropdown">
										{ids.map((id, index) => (
											<div key={index} className="dropdown-item">
												{id}
											</div>
										))}
									</div>
								)}

							</div>
							<Dropdown
								options={statusOptions}
								placeholder="Select Status"
								onSelect={(e) => handleInputChange('status', e)}
								defaultValue={filters.status}
								multiple={false}
								searchable={true}
								floatingLabel={true}
							/>
							<Dropdown
								options={merchantOptions}
								placeholder="Select Client"
								onSelect={(e) => handleInputChange('merchant', e)}
								defaultValue={filters.merchant}
								multiple={false}
								searchable={true}
								floatingLabel={true}
								className={role === "client" ? "db-table-disable" : ""}
							/>
							<div className="search-clear-btn">

								<Button onClick={() => executeSearch(1)} className="btn-medium" backgroundcolor="#003366" size="medium">
									{loading ? (
										<Loader strokeColor="#fafafa" width={20} height={20} />
									) : (
										<>
											<Icon name="search" width={20} height={20} color="#fff" />
										</>
									)}
									Search Now
								</Button>
								<Button onClick={handleClear} className="btn-secondary" backgroundcolor="transparent" size="medium" textColor="#007bff" border="#007bff">
									Clear
								</Button>
							</div>
						</div>

						<div className="id-search-row-div ">
							<div className="duration-input">
								<label className="duration-lable">Duration</label>
								<div>
									<Input
										className="dateInpute"
										id="fromDate"
										type="datetime-local"
										value={filters.fromDate}
										onChange={(value) => handleInputChange('fromDate', value)}
										onKeyDown={handleKeyDown}
									/>

									<Input
										className="dateInpute"
										id="toDate"
										type="datetime-local"
										value={filters.toDate}
										onChange={(value) => handleInputChange('toDate', value)}
										onKeyDown={handleKeyDown}
									/>
								</div>
							</div>

							<div className="quick-search">
								<label className="id-label" htmlFor="searchIds">
									Quick Search:
								</label>
								<div className="quick-search-btn">
									{[
										"Today",
										"Yesterday",
										"This Week",
										"Last Week",
										"This Month",
										"Last Month",
										// "This Year",
									].map((period) => (
										<Button
											className="btn-small"
											key={period}
											size="small"
											backgroundcolor={activeQuickSearchbtn === period ? "#003366" : "transparent"}
											border={activeQuickSearchbtn === period ? "" : "#626262"}
											textColor={activeQuickSearchbtn === period ? "" : "#626262"}
											onClick={() => handleQuickSearch(period)}
											onKeyDown={handleKeyDown}
										>
											{period}
										</Button>
									))}
								</div>
							</div>
						</div>

						<div className="show-more">
							<div className="show-more-click" onClick={handleShowMore}>
								{showMoreOptions ? <Icon name="read_less" width={20} height={20} color="#000" /> : <Icon name="read_more" width={20} height={20} color="#000" />}
								{showMoreOptions ? "Show Less" : "Show More"}
							</div>
						</div>

					</div>


					<div className={`more-show ${showMoreOptions ? "show" : "hide"}`} style={{
						animation: showMoreOptions
							? "updown 0.5s ease-in-out forwards"
							: "closeup 0.5s ease-in-out forwards",
					}}>
						<div className="show-more-div">

							<TextInput
								label="Name"
								id="name"
								value={filters.name}
								onChange={(e) => handleInputChange('name', e.target.value)}
								placeholder="Name"
							/>
							<TextInput
								label="Email"
								id="email"
								value={filters.email}
								onChange={(e) => handleInputChange('email', e.target.value)}
								placeholder="Email"
							/>

							<Dropdown
								options={role === "client" ? currencyOptions : midOptions}
								placeholder={role === "client" ? "Currency" : "MID"}
								onSelect={role === "client" ? (value) => handleInputChange("currency", value) : (value) => handleInputChange("mid", value)}
								defaultValue={role === "client" ? filters.currency : filters.mid}
								multiple={false}
								searchable={true}
								floatingLabel={true}
							/>

							<Dropdown
								options={paymentgatewayOptions}
								placeholder="Payment Gateway"
								onSelect={(value) => handleInputChange('acquirer', value)}
								defaultValue={filters.acquirer}
								multiple={false}
								searchable={true}
								floatingLabel={true}
							/>
						</div>
						<div className="id-search-row-div show-more-div">
							<Dropdown
								options={currencyOptions}
								placeholder="Currency"
								onSelect={(value) => handleInputChange('currency', value)}
								defaultValue={filters.currency}
								multiple={false}
								searchable={true}
								floatingLabel={true}
								className={role === "client" ? "db-table-disable" : "showMore-input"}
							/>
							<Dropdown
								options={countryOptions}
								placeholder="Country"
								onSelect={(value) => handleInputChange('country', value)}
								defaultValue={filters.country}
								multiple={false}
								searchable={true}
								floatingLabel={true}
							/>
							<Dropdown
								options={cardTypeOptions}
								placeholder="Card Type"
								onSelect={(value) => handleInputChange('cardType', value)}
								defaultValue={filters.cardType}
								multiple={false}
								searchable={true}
								floatingLabel={true}
							/>
							<TextInput
								label="Card Number"
								id="cardNumber"
								value={filters.cardNumber}
								onChange={(e) => handleInputChange('cardNumber', e.target.value)}
								placeholder="First 6 and Last 4 digits"
							/>
						</div>
					</div>

					{!viewData && (<div className="subtotal-export">
						<div className="page-info-head">
							<div className="page-info">
								<p className="page-info-text"> Subtotal:</p>{" "}
								<p className="total-amount">{totalAmount?.toFixed(2)}</p>
								<p className="currency-text">
									{currencyOptions.length > 0 ? currencyOptions[0] : "USD"}
								</p>
							</div>
							<div className="page-info">
								<p className="page-info-text"> Total:</p>{" "}
								<p className="total-amount">{overallTotal?.toFixed(2)}</p>
								<p className="currency-text">
									{currencyOptions.length > 0 ? currencyOptions[0] : "USD"}
								</p>
							</div>
						</div>
						<div className="filter-and-export">
							{/* <div onClick={handleSortToggle} className="btn-pagination">
								<Icon
									name={
										sortOrder === "ascending"
											? "filter_list"
											: "filter_list_opposite"
									}
									width={20}
									height={20}
									color="#000"
								/>
							</div> */}
							<Button className="btn-medium" backgroundcolor="#003366" size="medium" onClick={downloadCSV}>
								<Icon
									name="down_cloud_line"
									width={22}
									height={22}
									color="white"
								/>
								Export
							</Button>
						</div>
					</div>)}

					{viewData ? (
						<ViewTransaction data={viewData} onBackClick={handleBackClick} headerLabels={headerLabels} />
					) : (
						<TransactionTable
							headerLabels={role === "client" ? merchant_headerLabels : headerLabels}
							onViewClick={handleViewClick}
							tableData={searchedResult}
							loading={loading}
							isCopy={true}
							onTotalAmountChange={handleTotalAmountChange}
							currentPage={currentPage}
							rowsPerPage={rowsPerPage}
							setCurrentPage={(newPage) => executeSearch(newPage)}
							handleChildAction={handleChildAction}
							transactionTotal={transactionTotal}
						/>
					)}
					<div className="footer-section">
						<p>©{currentYear} Axipays. All rights reserved.</p>
					</div>
				</div>
			</>
		);
	}

	if (role === "employee") {
		return (
			<>
				<Header />
				<Sidebar />
				<div className="transaction-monitoring-main">
					<p className="transaction-monitoring-head">Transaction Monitoring</p>
					<div className="transaction-monitoring">
						<div className="id-search-row-div">
							<div className="serachid-row" >
								<Input
									label="Id"
									id="searchIds"
									value={filters.searchIds}
									onChange={(value) => handleInputChange('searchIds', value)}
									onKeyDown={handleKeyDown}
									placeholder="Txn id / Merchant txn id"
								/>
								{ids.length > 1 && (
									<span className="dropdown-icon" onClick={handleIconClick}>
										<Icon
											name={showDropdown ? "zoom_out" : "hide"}
											width={18}
											height={18}
											color="#dedddd"
										/>
									</span>
								)}
								{showDropdown && (
									<div className="dropdown">
										{ids.map((id, index) => (
											<div key={index} className="dropdown-item">
												{id}
											</div>
										))}
									</div>
								)}
							</div>

							<Select
								label="Status"
								id="status"
								options={statusOptions}
								value={filters.status}
								onChange={(value) => handleInputChange('status', value)}
								onKeyDown={handleKeyDown}
							/>

							<Select
								label="Merchant"
								id="merchant"
								options={merchantOptions}
								value={filters.merchant}
								onChange={(value) => handleInputChange('merchant', value)}
								onKeyDown={handleKeyDown}
							/>

							<Button onClick={() => executeSearch(1)} className="btn-medium" backgroundcolor="#003366" size="medium">
								{loading ? (
									<Loader strokeColor="#fafafa" width={20} height={20} />
								) : (
									<>
										<Icon name="search" width={20} height={20} color="#fff" />
									</>
								)}
								Search Now
							</Button>
							<Button onClick={handleClear} className="btn-secondary" backgroundcolor="transparent" size="medium" textColor="#007bff" border="#007bff">
								Clear
							</Button>
						</div>

						<div className="id-search-row-div ">

							<label className="duration-lable">Duration</label>
							<Input
								id="fromDate"
								type="datetime-local"
								value={filters.fromDate}
								onChange={(value) => handleInputChange('fromDate', value)}
							/>

							<Input
								id="toDate"
								type="datetime-local"
								value={filters.toDate}
								onChange={(value) => handleInputChange('toDate', value)}
							/>

							<div className="quick-search">
								<label className="id-label" htmlFor="searchIds">
									Quick Search:
								</label>
								<div className="quick-search-btn">
									{[
										"Today",
										"Yesterday",
										"This Week",
										"Last Week",
										"This Month",
										"Last Month",
										// "This Year",
									].map((period) => (
										<Button
											className="btn-small"
											key={period}
											size="small"
											backgroundcolor={activeQuickSearchbtn === period ? "#003366" : "transparent"}
											border={activeQuickSearchbtn === period ? "" : "#c5c4c4dd"}
											textColor={activeQuickSearchbtn === period ? "" : "#9e9999dd"}
											onClick={() => handleQuickSearch(period)}
											onKeyDown={handleKeyDown}
										>
											{period}
										</Button>
									))}
								</div>
							</div>
						</div>

						<div className="show-more-click">
							<div className="show-more" onClick={handleShowMore}>
								<Icon name="read_more" width={20} height={20} color="#000" />
								{showMoreOptions ? "Show Less" : "Show More"}
							</div>
						</div>
					</div>

					<div className={`more-show ${showMoreOptions ? "show" : "hide"}`} style={{
						animation: showMoreOptions
							? "updown 0.5s ease-in-out forwards"
							: "closeup 0.5s ease-in-out forwards",
					}}>
						<div className="show-more-div">
							<Input
								className="showMore-input"
								label="Name"
								id="name"
								value={filters.name}
								onChange={(value) => handleInputChange('name', value)}
								onKeyDown={handleKeyDown}
								placeholder="Name"
							/>
							<Input
								className="showMore-input"
								label="Email"
								id="email"
								value={filters.email}
								onChange={(value) => handleInputChange('email', value)}
								onKeyDown={handleKeyDown}
								placeholder="Email"
							/>
							<Select
								className="showMore-input"
								label="MID"
								id="mid"
								options={midOptions}
								value={filters.mid}
								onChange={(value) => handleInputChange('mid', value)}
								onKeyDown={handleKeyDown}
							/>
							<Select
								className="showMore-input"
								label="Payment Gateway"
								id="acquirer"
								options={paymentgatewayOptions}
								value={filters.acquirer}
								onChange={(value) => handleInputChange('acquirer', value)}
								onKeyDown={handleKeyDown}
							/>
						</div>
						<div className="id-search-row-div show-more-div">
							<Select
								className="showMore-input"
								label="Currency"
								id="currency"
								options={currencyOptions}
								value={filters.currency}
								onChange={(value) => handleInputChange('currency', value)}
								onKeyDown={handleKeyDown}
							/>
							<Select
								className="showMore-input"
								label="Country"
								id="country"
								options={countryOptions}
								value={filters.country}
								onChange={(value) => handleInputChange('country', value)}
								onKeyDown={handleKeyDown}
							/>
							<Select
								className="showMore-input"
								label="Card Type"
								id="cardType"
								options={cardTypeOptions}
								value={filters.cardType}
								onChange={(value) => handleInputChange('cardType', value)}
								onKeyDown={handleKeyDown}
							/>
							<Input
								className="showMore-input"
								label="Card Number"
								id="cardNumber"
								value={filters.cardNumber}
								onChange={(value) => handleInputChange('cardNumber', value)}
								onKeyDown={handleKeyDown}
								placeholder="First 6 and Last 4 digits"
							/>
						</div>
					</div>

					<div className="subtotal-export">
						<div className="page-info">
							<p className="page-info-text"> Subtotal</p>
							<p className="total-amount">{totalAmount}</p>
						</div>
						<div className="filter-and-export">
							{/* <div onClick={handleSortToggle} className="btn-pagination">
								<Icon
									name={
										sortOrder === "ascending"
											? "filter_list"
											: "filter_list_opposite"
									}
									width={20}
									height={20}
									color="#000"
								/>
							</div> */}
							<Button className="btn-medium" backgroundcolor="#003366" size="medium">
								<Icon
									name="down_cloud_line"
									width={22}
									height={22}
									color="white"
								/>
								Export
							</Button>
						</div>
					</div>

					{viewData ? (
						<ViewTransaction data={viewData} onBackClick={handleBackClick} headerLabels={headerLabels} />
					) : (
						<TransactionTable
							headerLabels={headerLabels}
							onViewClick={handleViewClick}
							tableData={searchedResult}
							isCopy={true}
							onTotalAmountChange={handleTotalAmountChange}
						/>
					)}

					<div className="footer-section">
						<p>©{currentYear} Axipays. All rights reserved.</p>
					</div>
				</div>
			</>
		);
	}
};

export default TransactionMonitoring;