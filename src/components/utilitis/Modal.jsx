import React, { useEffect } from 'react';
import '../../styles/component.css';
import Icon from '../../media/icon/icons';

const ResponsiveModal = ({
    isOpen,
    onClose,
    overlay = true,
    centered = false,
    customPosition = {},
    icon = null,
    showDivider = false,
    showDividerbottom = false,
    title = '',
    content = '',
    onConfirm,
    onCancel,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    children,
    showbuttons = false,
    titleClassName = '',
    contentClassName = '',
    iconClassName = '',
    modalheaderClassName = '',
    modalbuttonsClassname = '',
    modalbuttonCancel = '',
    modalbuttonConfirm = '',
    iconName = '',
    iconColor = '',
    madalcontainerClass = '',
    closeOnOutsideClick = false,
    closeOnScroll = false
}) => {
    useEffect(() => {
        if (!isOpen) return;

        const handleOutsideClick = (e) => {
            const modalContainer = document.querySelector('.modal-container');
            if (
                closeOnOutsideClick &&
                modalContainer &&
                !modalContainer.contains(e.target)
            ) {
                onClose(); // Close when clicking outside
            }
        };


        const handleScroll = () => {
            if (closeOnScroll) {
                onClose();
            }
        };

        if (closeOnOutsideClick) {
            document.addEventListener('mousedown', handleOutsideClick);
        }
        if (closeOnScroll) {
            document.addEventListener('scroll', handleScroll);
        }

        return () => {
            if (closeOnOutsideClick) {
                document.removeEventListener('mousedown', handleOutsideClick);
            }
            if (closeOnScroll) {
                document.removeEventListener('scroll', handleScroll);
            }
        };
    }, [isOpen, closeOnOutsideClick, closeOnScroll, onClose]);

    if (!isOpen) return null;

    return (
        <>
            {overlay && <div className="modal-overlay" onClick={onClose} />}
            <div
                className={`modal-container ${centered ? 'modal-centered' : ''} ${madalcontainerClass || ''}`}
                style={centered ? {} : customPosition}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="modal-content">
                    <div className={`modal-header ${modalheaderClassName}`}>

                        {title && <div className={`modal-title ${titleClassName}`}> {icon && <div className={`modal-icon ${iconClassName}`}>
                            <Icon name={icon} width={20} height={20} color="#00264c"></Icon></div>}{title}</div>}
                        {content && <p className={`modal-description ${contentClassName}`}>{content}</p>}
                        <div className="cross-icon" onClick={onClose}>
                            <Icon name="close_fill" width={20} height={20} color="#002966" />
                        </div>
                    </div>
                    {showDivider && <div className="modal-divider" />}
                    {children && (
                        <div className="modal-details">
                            {children}
                        </div>
                    )}
                    {showDividerbottom && <div className="modal-divider"/>}
                    {showbuttons && (
                        <div className={`modal-actions ${modalbuttonsClassname}`}>
                            {cancelText && (
                                <button
                                    className={`modal-button ${modalbuttonCancel}`}
                                    onClick={onCancel}
                                >
                                    {cancelText}
                                </button>
                            )}
                            {confirmText && (
                                <button
                                    className={`modal-button modal-confirm-btn ${modalbuttonConfirm}`}
                                    onClick={onConfirm}
                                >
                                     {confirmText}
                                    <Icon
                                        name={iconName}
                                        width={20}
                                        height={20}
                                        color={iconColor}
                                    />
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default ResponsiveModal;