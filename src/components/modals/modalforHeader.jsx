import React, { useState } from "react";
import ResponsiveModal from "../../components/utilitis/Modal.jsx";
import Icon from "../../media/icon/icons.jsx";
import Button from "../../components/utilitis/Button.jsx";
import BoyAvtar from "../../media/image/profileimage.jpg";

const initialNotifications = [
    { id: 1, message: "New transaction alert", time: "2 mins ago", read: false },
    { id: 2, message: "Your payment was successful", time: "15 mins ago", read: true },
    { id: 3, message: "Account updated", time: "1 hour ago", read: false },
    { id: 4, message: "Payment failed", time: "3 hours ago", read: true },
    { id: 5, message: "New offer available", time: "5 hours ago", read: false },
];

const ModalHeader = ({ isOpen, onClose, modalType, searchQuery }) => {
    const userName = sessionStorage.getItem("userName");
    const email = sessionStorage.getItem("email");
    const userRole = sessionStorage.getItem("role");
    const [notifications, setNotifications] = useState(initialNotifications);

    const getTitle = () => {
        if (modalType === "Profile") {
            return "Profile";
        }
        if (modalType === "Notification") {
            return "Notification";
        }
    };

    const handleDelete = (id) => {
        setNotifications((prev) => prev.filter((notification) => notification.id !== id));
    };

    const markAllAsRead = () => {
        setNotifications((prev) =>
            prev.map((notification) => ({ ...notification, read: true }))
        );
    };

    const markAllAsUnread = () => {
        setNotifications((prev) =>
            prev.map((notification) => ({ ...notification, read: false }))
        );
    };

    const Signout = () => {
        sessionStorage.clear();
        window.location.href = "/";
    };

    return (
        <ResponsiveModal
            isOpen={isOpen}
            onClose={onClose}
            customPosition={userRole === 'firstUser' ? { top: '10%', left: '87.5%' } : { top: '8%', left: '76%' }}
            centered={false}
            icon="user_fill"
            title={userRole === 'firstUser' ? "Profile" : getTitle()}
            onCancel={onClose}
            cancelText=""
            overlay={false}
            showbuttons={modalType === "Profile" ? true : false}
            showDivider={true}
            showDividerbottom={false}
            confirmText='LogOut'
            modalbuttonConfirm={userRole === 'firstUser' ? "signout-firstuser" : "signout-btn"}
            onConfirm={Signout}
            iconName='logout'
            iconColor={userRole === 'firstUser' ? "#00264c" : '#ffffff'}
            closeOnOutsideClick={true}
            closeOnScroll={true}
            madalcontainerClass={userRole === 'firstUser' ? "modal-window" : "modal-for-header"}
        >
            {userRole !== 'firstUser' && modalType === "Profile" && (
                <div className="profile-content">
                    <div className="profile-top-head">
                        <div className="profile-info-div">
                            <div className="profile-avatar">
                            {userRole === "admin" ? (
                                <img src={BoyAvtar} alt="avatar" />
                            ) : (
                                <div>
                                    {userName ? userName.charAt(0).toUpperCase() : "U"}
                                </div>
                            )}
                            </div>
                            <div className="profile-details">
                                <h4>{userName}</h4>
                                <p>{email}</p>
                            </div>
                        </div>
                        <Button className="edit-profile-btn" backgroundcolor="#003366" size="medium">
                           Edit Profile
                        </Button>
                    </div>
                    <div className="profile-bottom">
                        <p className="merchant">Others</p>
                        <div ><Icon name="questionmark" width={20} height={20} color='#888'></Icon> Help</div>
                        <div className="master-setting"><Icon name="page_info" width={20} height={20} color='#888'></Icon>Master Setting</div>
                    </div>
                </div>
            )}

            {userRole !== 'firstUser' && modalType === "Notification" && (
                <div className="notification-content ">
                    <div className="notfication-tab scrollbar">
                        <div className="notification-item">
                            <div className="notification-readbox">
                                <div onClick={markAllAsUnread}>Un-Read</div>
                                <div onClick={markAllAsRead}>Read</div>
                            </div>
                        </div>
                        {notifications.map((notification) => (
                            <div
                                className="notification-item"
                                key={notification.id}
                            >
                                <div className="notification-dot">
                                    <div className="no-hover-icon">
                                        <Icon name="credit_card_line" width={20} height={20} color="#00264c"></Icon>
                                    </div>
                                    <div className="notification-message">
                                        <p className={`db-div-head ${notification.read ? "read" : "unread"}`}>{notification.message}</p>
                                        <span className="notification-time">{notification.time}</span>
                                    </div>
                                </div>
                                <div className="modal-icon" onClick={() => handleDelete(notification.id)}>
                                    <Icon name="close_fill" width={20} height={20} color="#002966" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

        </ResponsiveModal >
    );
};

export default ModalHeader;
