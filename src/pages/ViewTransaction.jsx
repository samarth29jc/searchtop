import React, { useState } from "react";
import Button from "../components/utilitis/Button";
import Icon from "../media/icon/icons";
import "../styles/pages.css";
import SlidingBottomLineButtons from "../components/Animation/ButtonsAnimation";

const ViewTransaction = ({ data, onBackClick, headerLabels }) => {
    const [activeTab, setActiveTab] = useState("Customer Details");

    const tabs = [
        { name: "Customer Details", icon: "checkbook" },
        { name: "Payment Details", icon: "rates" },
        { name: "Transaction Info", icon: "secrets" },
        { name: "Other Details", icon: "recenter" },
    ];

    const tabFields = {
        "Customer Details": ["first_name", "last_name", "email", "phone", "address_line1", "address_line2", "city", "state", "country", "country_code", "postal_code"],
        "Payment Details": ["cardholder_name", "amount", "method", "card_type", "card_number", "expiry_month", "expiry_year", "card_cvc", "currency_code"],
        "Transaction Info": ["transaction_ref", "merchant_txn_id", "acquirer_txn_id", "status", "message", "integration_method", "transaction_date", "client_mid", "acquirer_mid"],
        "Other Details": [],
    };

    const formatFieldName = (field) => {
        return field
            .replace(/_/g, ' ')
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    };

    const maskCardNumber = (cardNumber) => {
        if (!cardNumber || cardNumber.length < 8) {
            return cardNumber;
        }
        const firstFour = cardNumber.slice(0, 4);
        const lastFour = cardNumber.slice(-4);
        const masked = `${firstFour} **** **** ${lastFour}`;
        return masked;
    };

    const handleTabChange = (tabName) => {
        setActiveTab(tabName);
    };

    const renderTabContent = () => {
        const fieldsToDisplay = tabFields[activeTab] || [];
        const allFields = Object.entries(data);

        const currentFields = allFields.filter(([key]) => fieldsToDisplay.includes(key));

        const otherFields =
            activeTab === "Other Details"
                ? allFields.filter(
                    ([key]) =>
                        !Object.values(tabFields)
                            .flat()
                            .includes(key) && key !== "id" && key !== "client_name"
                )
                : [];

        const fields = activeTab === "Other Details" ? otherFields : currentFields;

        const leftColumn = fields.slice(0, Math.ceil(fields.length / 2));
        const rightColumn = fields.slice(Math.ceil(fields.length / 2));

        return (
            <div className="transaction-row">
                <div className="left-column">
                    {leftColumn.map(([key, value]) => (
                        <div key={key} className="transaction-detail">
                            <span className="view-transaction-head">{formatFieldName(key)}</span>
                            <span className="view-transaction-value">
                                {key === "card_number"
                                    ? maskCardNumber(value)
                                    : key === "card_cvc"
                                        ? "***" // Masking CVC
                                        : typeof value === "object"
                                            ? JSON.stringify(value)
                                            : value}
                            </span>
                        </div>
                    ))}
                </div>
                <div className="sapration-line"></div>
                <div className="right-column">
                    {rightColumn.map(([key, value]) => (
                        <div key={key} className="transaction-detail">
                            <span className="view-transaction-head">{formatFieldName(key)}</span>
                            <span className="view-transaction-value">
                                {key === "card_number"
                                    ? maskCardNumber(value)
                                    : key === "card_cvc"
                                        ? "***"
                                        : typeof value === "object"
                                            ? JSON.stringify(value)
                                            : value}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    return (
        <div className="view-transaction-container">
            <div className="transaction-header">
                <h4 className="view-transaction-name-head">Client: {data.customer_name || "Unknown Merchant"}</h4>
                <Button backgroundcolor="#003366" size="medium" onClick={onBackClick}>
                    <Icon
                        name="back_arrow"
                        color="#ffffff"
                        width={18}
                        height={18}
                    />Back
                </Button>
            </div>
            <div className="expanded-content view-merchant-row">
                <div className="expanded-content-row">
                    <div className="expanded-left">
                        {headerLabels.slice(8, 11).map((item, index) => (
                            <div key={index} className="expand-item">
                                <div className="expanded-view-merchant-row">
                                    <span className="expand-text">{item.heading}</span>
                                    <span className="expand-value">
                                        {data[item.label] !== undefined ? data[item.label] : "N/A"}
                                    </span>
                                </div>
                                {(index === 0 || index === 1) && <div className="divider-div divider-for-viewmerchant"></div>}
                            </div>
                        ))}
                    </div>
                    <div className="expanded-center">
                        {headerLabels.slice(11).map((item, index) => (
                            <React.Fragment key={index}>
                                <div className="card-rows">
                                    <span className="expanded-details">
                                        {index !== 2 && (
                                            <span className={`expand-text ${index === 2 ? 'amount-row-head' : 'expand-text-head'}`}>
                                                {item.heading}
                                            </span>
                                        )}
                                        <span className={`expand-value ${index === 2 ? 'amount-row-head' : 'expand-text-head'}`}>
                                            {index === 2 ? (
                                                <div className="amount-currency">
                                                    <div className="amount-row">
                                                        {data[item.label] !== undefined ? data[item.label] : "N/A"}
                                                    </div>
                                                </div>
                                            ) : index === 3 ? null : data[item.label]}
                                        </span>
                                    </span>
                                    {index < headerLabels.slice(11).length - 1 &&
                                        index !== 2 &&
                                        index !== 1 && <div className="divider-div"></div>}
                                </div>
                            </React.Fragment>
                        ))}
                    </div>
                </div>

            </div>

            <SlidingBottomLineButtons
                buttons={tabs}
                activeTab={activeTab}
                onTabChange={handleTabChange}
            />

            <div className="tab-content">
                {/* Display the active tab's name */}
                <h5 className="view-transaction-tab-head">{activeTab}</h5>
                {renderTabContent()}
            </div>
        </div>
    );
};

export default ViewTransaction;
