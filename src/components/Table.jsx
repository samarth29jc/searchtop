import React, { useState, useEffect } from "react";

import "../styles/component.css";

import Icon from "../media/icon/icons";

import nodata from "../media/image/no-data.webp";
import Button from "./utilitis/Button";
import FlagIcon from "../media/icon/flagicons";

const TransactionTable = ({ headerLabels = [], tableData = [], onViewClick, isCopy = false, onTotalAmountChange = false, isAction = true, pagination = true, currentPage, rowsPerPage, setCurrentPage, loading, transactionTotal = 0, handleChildAction }) => {
    const role = sessionStorage.getItem("role");
    const [activeOptionRow, setActiveOptionRow] = useState(null);
    const [menuPosition, setMenuPosition] = useState('below');
    const [hoveredRow, setHoveredRow] = useState(null);
    const [expandedRows, setExpandedRows] = useState([]);
    const handleMouseEnter = (index) => {
        setHoveredRow(index);
    };

    const handleMouseLeave = () => {
        setHoveredRow(null);
    };

    const paginatedData = Array.isArray(tableData) ? tableData : [];

    const totalAmount = paginatedData.reduce((acc, row) => {
        const amount = parseFloat(row.amount);
        return acc + (isNaN(amount) ? 0 : amount);
    }, 0);

    useEffect(() => {
        if (onTotalAmountChange) {
            onTotalAmountChange(totalAmount);
        }
    }, [totalAmount, onTotalAmountChange]);

    const toggleRowExpand = (index) => {
        setExpandedRows((prevExpandedRows) => {
            if (prevExpandedRows.includes(index)) {
                return prevExpandedRows.filter((rowIndex) => rowIndex !== index);
            } else {
                return [...prevExpandedRows, index];
            }
        });
    };

    const toggleOptions = (index, event) => {
        if (activeOptionRow === index) {
            setActiveOptionRow(null);
        } else {
            const rowRect = event.target.getBoundingClientRect();
            const windowHeight = window.innerHeight;
            const menuHeight = 200;

            if (windowHeight - rowRect.bottom < menuHeight) {
                setMenuPosition('above');
            } else {
                setMenuPosition('below');
            }

            setActiveOptionRow(index);
        }
    };

    const closemenuOption = () => {
        setActiveOptionRow(false)
    }

    const totalPages = Math.max(Math.ceil(transactionTotal / rowsPerPage), 1);


    const handleNextPageClick = () => {
        if (currentPage * rowsPerPage < transactionTotal) {
            const nextPage = currentPage + 1;
            setCurrentPage(nextPage);
            handleChildAction("PAGE_CHANGE", nextPage);
        }
    };

    const handlePrevPageClick = () => {
        if (currentPage > 1) {
            const prevPage = currentPage - 1;
            setCurrentPage(prevPage);
            handleChildAction("PAGE_CHANGE", prevPage);
        }
    };

    const handleFirstPageClick = () => {
        setCurrentPage(1);
        handleChildAction("PAGE_CHANGE", 1);
    };

    const handleLastPageClick = () => {
        const lastPage = Math.ceil(transactionTotal / rowsPerPage);
        setCurrentPage(lastPage);
        handleChildAction("PAGE_CHANGE", lastPage);
    };


    const handleCopy = (text) => {
        if (isCopy) {
            navigator.clipboard.writeText(text).then(
                () => {
                },
                (err) => {
                }
            );
        }
    };

    return (
        <div className="transaction-table-container">
            <table className="transaction-table">
                <thead>
                    <tr>
                        {(role === "admin" ? headerLabels.slice(0, 8) : headerLabels.slice(0, 7)).map((item, index) => (
                            <th key={index}>{item.heading}</th>
                        ))}
                        {isAction && (<th>Actions</th>)}
                    </tr>
                </thead>

                <tbody>
                    {paginatedData.length > 0 ? (
                        paginatedData.map((row, index) => (
                            <React.Fragment key={index}>
                                <tr className={`${expandedRows.includes(index) ? 'expanded-parent' : ''} ${hoveredRow === index ? 'hovered' : ''}`}
                                    onMouseEnter={() => handleMouseEnter(index)}
                                    onMouseLeave={handleMouseLeave}>
                                    {(role === "admin" ? headerLabels.slice(0, 8) : headerLabels.slice(0, 7)).map((item, colIndex) => {
                                        if (colIndex === 0) {
                                            return <td key={item.label} onClick={() => handleCopy(row[item.label])} className={expandedRows.includes(index) ? "remover" : ""}>{(currentPage - 1) * rowsPerPage + index + 1}</td>;
                                        }
                                        if (item.label === "status") {
                                            const statusValue = row[item.label]?.toLowerCase() || "";
                                            const statusClass =
                                                statusValue === "success"
                                                    ? "status-success"
                                                    : statusValue === "Fail" || statusValue.includes("fail")
                                                        ? "status-failed"
                                                        : "status-pending";

                                            return (
                                                <td key={item.label} onClick={() => handleCopy(row[item.label])} className={expandedRows.includes(index) ? "remover" : ""}>
                                                    <div className={`status-column ${statusClass}`}>
                                                        <div className={`bullet ${statusClass}`}></div> {row[item.label]}
                                                    </div>
                                                </td>
                                            );
                                        }
                                        return (
                                            <td key={item.label} className={expandedRows.includes(index) ? "remover" : ""} onClick={() => handleCopy(row[item.label])}>
                                                {row[item.label]}
                                            </td>
                                        );
                                    })}
                                    {isAction && (<td className={expandedRows.includes(index) ? "remover" : ""}>
                                        <div className="more-options">
                                            <span className="btn-pagination" onClick={() => toggleRowExpand(index)}  >
                                                <Icon
                                                    name="keyboard_arrow_down"
                                                    width={20}
                                                    height={20}
                                                    color="#000000"
                                                    className={`icon-transition ${expandedRows.includes(index) ? 'up' : 'down'}`}
                                                />
                                            </span>
                                            {!window.location.href.includes("/home") && (
                                                <span className="btn-pagination" onClick={(event) => toggleOptions(index, event)}>
                                                    <Icon
                                                        name="vertical_dots"
                                                        width={20}
                                                        height={20}
                                                        color="#000000"
                                                    />
                                                </span>
                                            )}
                                        </div>
                                        {activeOptionRow === index && (
                                            <div className="options-menu active-option" style={{
                                                top: menuPosition === 'below' ? '100%' : 'auto',
                                                bottom: menuPosition === 'above' ? '100%' : 'auto',
                                            }}>
                                                <div className="options-menu-head">More
                                                    <Icon name="close_fill"
                                                        width={20}
                                                        height={20}
                                                        color="#03386c"
                                                        onClick={closemenuOption}></Icon>
                                                </div>
                                                <ul>
                                                    <li>
                                                        <Icon name="checkbook"
                                                            width={20}
                                                            height={20}
                                                            color="#03386c"
                                                            className="list-icon">
                                                        </Icon>Edit
                                                    </li>
                                                    <li>
                                                        <Icon name="person_remove"
                                                            width={20}
                                                            height={20}
                                                            color="#03386c">
                                                        </Icon>Delete
                                                    </li>
                                                    <li onClick={() => onViewClick(row)}>
                                                        <Icon name="view_more"
                                                            width={20}
                                                            height={20}
                                                            color="#03386c"></Icon>View More
                                                    </li>
                                                </ul>
                                            </div>
                                        )}
                                    </td>)}
                                </tr>
                                <div className={`expanded-row-div ${expandedRows.includes(index) ? 'opened' : 'closed'}`}>
                                    <tr className={`expanded-row ${expandedRows.includes(index) ? 'open' : 'closed'} ${hoveredRow === index ? 'hovered' : ''} `}
                                        onMouseEnter={() => handleMouseEnter(index)}
                                        onMouseLeave={handleMouseLeave}>
                                        <td colSpan={headerLabels.length + 1}>
                                            <div className="expanded-content">
                                                <div className="expanded-content-row">
                                                    <div className="expanded-left">
                                                        {(role === "admin" ? headerLabels.slice(8, 10) : headerLabels.slice(7, 9)).map((item, index) => (
                                                            <div key={index} className="expand-item">
                                                                <div className="expanded-details">
                                                                    <span className="expand-text">{item.heading}</span>
                                                                    <span className="expand-value" onClick={() => handleCopy(row[item.label])}>
                                                                        {row[item.label]}
                                                                    </span>
                                                                </div>
                                                                {/* {(index === 0 || index === 1) && <div className="divider-div"></div>} */}
                                                                {(index === 0) && <div className="divider-div"></div>}
                                                            </div>
                                                        ))}
                                                    </div>
                                                    <div className="expanded-center">
                                                        {(role === "admin" ? headerLabels.slice(10) : headerLabels.slice(9)).map((item, index) => (
                                                            <React.Fragment key={index}>
                                                                <div className="card-rows">

                                                                    <span className="expanded-details">
                                                                        {index !== 3 && (
                                                                            <span
                                                                                className={`expand-text ${index === 2 ? 'amount-row-head' : 'expand-text-head'}`}
                                                                            >
                                                                                {item.heading}
                                                                            </span>
                                                                        )}
                                                                        <span
                                                                            className="expand-value"
                                                                            onClick={() => handleCopy(row[item.label])}
                                                                        >
                                                                            {index === 2 ? (
                                                                                <div className="amount-currency">
                                                                                    <div className="amount-row">
                                                                                        {row.amount}</div>
                                                                                    <div className="currency-row">
                                                                                        {row.currency_code}
                                                                                    </div>
                                                                                </div>
                                                                            ) : index === 3 ? (
                                                                                null
                                                                            ) : index === 0 ? (
                                                                                <div className="image-container">
                                                                                    <FlagIcon name={row[item.label].replace(/\s+/g, '').replace(/,/g, '').replace(/[()]/g, '').toLowerCase()} />
                                                                                    <div className="divider"></div>
                                                                                    {row[item.label]}
                                                                                </div>
                                                                            ) : index === 1 ? (
                                                                                <div className="image-container">
                                                                                    <FlagIcon name={row[item.label].toLowerCase()} />
                                                                                    <div className="divider"></div>
                                                                                    {row[item.label]}
                                                                                </div>
                                                                            ) : (
                                                                                row[item.label]
                                                                            )}
                                                                        </span>

                                                                    </span>


                                                                    {index <
                                                                        (role === 'admin'
                                                                            ? headerLabels.slice(11).length - 1
                                                                            : headerLabels.slice(9).length - 1) &&
                                                                        index !== 2 &&
                                                                        index !== 3 && <div className="divider-div"></div>}
                                                                </div>

                                                            </React.Fragment>
                                                        ))}

                                                    </div>
                                                    {!window.location.href.includes("/home") && (
                                                        <div className="expanded-right">
                                                            <Button
                                                                backgroundcolor="#003366"
                                                                hovercolor="#00264c"
                                                                size="medium"
                                                                textColor="#ffffff"
                                                                onClick={() => onViewClick(row)}
                                                            >
                                                                View More
                                                            </Button>
                                                        </div>
                                                    )}

                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                </div>
                            </React.Fragment>
                        ))
                    ) : loading ? (<>
                        <tbody>
                            <tr className="js-table-row-loader">
                                <td colSpan={Math.max(6, (role === "admin" ? headerLabels.slice(0, 8) : headerLabels.slice(0, 8)).length + (isAction ? 1 : 0))} className="table-cell-loader">
                                    {[...Array(3)].map((_, index) => (
                                        <div key={index}>
                                            <div className="row-loader u-flex">
                                                {[...Array(6)].map((_, colIndex) => (
                                                    <div key={colIndex} className="u-flex__cell u-mg--sm u-pd--sm loading-animation"></div>
                                                ))}
                                                {isAction && (
                                                    <div className="u-flex__cell u-mg--sm u-pd--sm loading-animation u-hide-small--flex"></div>
                                                )}
                                            </div>
                                            {index < 2 && <hr />}
                                        </div>
                                    ))}
                                </td>
                            </tr>
                        </tbody>
                    </>) : (
                        <tbody>
                            <div className="no-data-aviliable">
                                <img src={nodata} alt="No data available" />
                            </div>
                        </tbody>
                    )}
                </tbody>
            </table>

            <div className={`pagination-info ${!pagination ? "no-pagination" : "pagination-info"}`}>
                <div className="page-info">
                    <p className="page-info-text">Showing</p>{" "}
                    <p>{`${(currentPage - 1) * rowsPerPage + 1} - ${Math.min(currentPage * rowsPerPage)}`}</p>

                    <p className="page-info-text">from</p>{" "}
                    <p>{transactionTotal || 0}</p> <p className="page-info-text">items</p>
                </div>

                <div className="pagination-buttons">
                    <select
                        className="rows-dropdown"
                        onChange={(e) => handleChildAction("ROWS_CHANGE", e.target.value)}
                        value={rowsPerPage}
                    >
                        {[10, 25, 50, 100].map((rows) => (
                            <option key={rows} value={rows}>
                                {rows} rows
                            </option>
                        ))}
                    </select>
                    <button
                        className="btn-pagination"
                        onClick={handleFirstPageClick}
                        disabled={currentPage === 1}
                    >
                        <Icon name="double_arrow_left" width={20} height={20} color="#000" />
                    </button>

                    <button
                        className="btn-pagination"
                        onClick={handlePrevPageClick}
                        disabled={currentPage === 1}
                    >
                        <Icon name="arrow_left" width={20} height={20} color="#000" />
                    </button>
                    <p className="current-pagenumber">{currentPage}</p>
                    <button
                        className="btn-pagination"
                        onClick={handleNextPageClick}
                        disabled={currentPage === totalPages}
                    >
                        <Icon name="arrow_right" width={20} height={20} color="#000" />
                    </button>

                    <button
                        className="btn-pagination"
                        onClick={handleLastPageClick}
                        disabled={currentPage === totalPages}
                    >
                        <Icon name="double_arrow_right" width={20} height={20} color="#000" />
                    </button>
                </div>
            </div>

        </div>
    );
};

export default TransactionTable;
