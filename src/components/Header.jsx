import React, { useState } from 'react';
import Icon from "../media/icon/icons.jsx";
import Modal from '../components/modals/modalforHeader.jsx';
import '../styles/component.css';
import { Input } from './utilitis/Input.jsx';
import AxipaysLogo from '../media/image/axi_wideLogo.png';
import BoyAvtar from '../media/image/profileimage.jpg';
import NotificationPopup from './NotificationPopup/NotificationPopup';
import ProfileDropdown from './profileDropdown/ProfileDropdown';

function Header() {
    const userName = sessionStorage.getItem("userName");
    const email = sessionStorage.getItem("email");
    const userRole = sessionStorage.getItem("role");

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalType, setModalType] = useState("");
    const [isFlip, setFlip] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [dropdownResults, setDropdownResults] = useState([]);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false); // ✅ mobile toggle
    const [isNotificationOpen, setNotificationOpen] = useState(false);
    const [isProfileOpen, setProfileOpen] = useState(false);

    const sampleData = [
        "Manage Settlement",
        "Manage Settlement Merchant",
        "Manage Settlement Admin",
        "Developers/Payment Integration/S2S",
        "Insights Customized",
    ];

    const openModal = (type) => {
        setModalType(type);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setFlip(false);
    };

    const handleSearchInput = (field, value) => {
        setSearchQuery(value);
        if (value.trim() !== "") {
            const filteredResults = sampleData.filter((item) =>
                item.toLowerCase().includes(value.toLowerCase())
            );
            setDropdownResults(filteredResults);
        } else {
            setDropdownResults([]);
        }
    };

    return (
        <>

            <div className={userRole === 'firstUser' ? 'portal-header portal-header-firstuser' : 'portal-header'}>
                  <div className="mobile-menu-icon" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                <Icon name="menu" width={24} height={24} color="#003366" />
            </div>
                <div className={modalType === 'Search' ? "header-modal-div md-search" : "header-modal-div"}>
                    <Modal
                        isOpen={isModalOpen}
                        onClose={closeModal}
                        modalType={modalType}
                        searchQuery={searchQuery}
                    />
                </div>

                {/* ✅ Responsive wrapper for input + profile */}
                <div className={`header-main-content ${mobileMenuOpen ? 'show-mobile' : ''}`}>
                    <div className='header-main-div'>
                        {userRole === 'firstUser' ? (
                            <div className="logo-section">
                                <img src={AxipaysLogo} alt="Logo" className="demo-logo" />
                            </div>
                        ) : (
                            <div className="input-grp">
                                <div className="ic">
                                    <Icon name="search" width={22} height={22} color="#003366" />
                                </div>
                                <Input
                                    type="text"
                                    placeholder="Search"
                                    id="search"
                                    value={searchQuery}
                                    onChange={(value) => handleSearchInput("search", value)}
                                />
                                <div className={`ss-dropdown ${dropdownResults.length > 0 ? 'show scrollbar' : ''}`}>
                                    {dropdownResults.map((result, index) => (
                                        <div className="ss-dropdown-item" key={index}>
                                            <div className="icon">
                                                <Icon name="search" width={18} height={18} color="#003366" />
                                            </div>
                                            <div className="content">
                                                <p className="title">{result}</p>
                                                <p className="subtitle">
                                                    Developers/Payment Integration/S2S
                                                </p>
                                            </div>
                                            <div className="action-icon">
                                                <Icon name="arrow_right" width={18} height={18} color="#003366" />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className='ic'>
                                    <Icon name="commandline" width={25} height={25} color="#003366" />
                                </div>
                            </div>
                        )}
                    </div>
                    <div className='header-functionality'>
                        {/* Notification Popup */}
                        <div className='header-notification'>
                            <div className='ic' onClick={() => setNotificationOpen(true)}>
                                <Icon name="bell" width={25} height={25} color="#003366" />
                            </div>
                            <NotificationPopup
                                isOpen={isNotificationOpen}
                                onClose={() => setNotificationOpen(false)}
                                notifications={[]}
                                activeTab="unread"
                                onTabChange={() => {}}
                            />
                        </div>
                        {/* Profile Dropdown */}
                        <div className='profileSection'>
                            <div className='img-section' onClick={() => setProfileOpen(true)}>
                                <img src={BoyAvtar} alt="avatar" />
                            </div>
                            <Icon
                                name="keyboard_arrow_down"
                                width={20}
                                height={20}
                                color="#003366"
                                onClick={() => setProfileOpen(true)}
                                style={{ cursor: 'pointer' }}
                            />
                            <ProfileDropdown
                                isOpen={isProfileOpen}
                                onClose={() => setProfileOpen(false)}
                                user={{ name: userName, email: email }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Header;
