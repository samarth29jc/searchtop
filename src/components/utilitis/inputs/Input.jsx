import React, { useState } from 'react';
import styles from '../inputs/Input.module.css';
import { EyeIcon } from '../../../media/icon/icons';

// Custom hook for label focus
function useInputLabel() {
    const [focused, setFocused] = useState(false);

    const handleFocus = () => setFocused(true);
    const handleBlur = (e) => {
        if (!e.target.value) {
            setFocused(false);
        }
    };

    return { focused, handleFocus, handleBlur, setFocused };
}

// TextInput Component
export function TextInput({ placeholder, helpText, helpCount, value, onChange, name, required }) {
    const { focused, handleFocus, handleBlur } = useInputLabel();

    return (
        <div className={styles.inputContainer}>
            <label className={`${styles.label} ${focused || value ? styles.floated : ''}`}>
                {placeholder}{required && <span className={styles.redAstric}>*</span>}
            </label>
            <input
                type="text"
                name={name}
                placeholder=""
                className={styles.inputField}
                onFocus={handleFocus}
                onBlur={handleBlur}
                value={value}
                onChange={onChange}
            />
           <div className={`${styles.helpInfo} ${(helpText || helpCount) ? styles.expand : ''}`}>
                <div className={`${styles.helpText} ${helpText ? styles.visible : styles.hidden}`}>
                    {helpText || ''}
                </div>
                <div className={`${styles.helpCount} ${helpCount ? styles.visible : styles.hidden}`}>
                    {(value?.length || 0) + '/' + helpCount}
                </div>
            </div>
        </div>
    );
}

// PasswordInput Component
export function PasswordInput({ placeholder, helpText, helpCount, value, onChange, name, required }) {
    const { focused, handleFocus, handleBlur} = useInputLabel();
    const [showPassword, setShowPassword] = useState(false);
    const toggleShowPassword = () => setShowPassword((prev) => !prev);

    const handleCopy = (e) => { e.preventDefault(); }; // Prevent copying
    const handlePaste = (e) => {e.preventDefault(); }; // Prevent pasting
    const handleCut = (e) => { e.preventDefault(); }; // Prevent cutting

    return (
        <div className={styles.inputContainer}>
            <label className={`${styles.label} ${focused || value ? styles.floated : ''}`}>
                {placeholder}{required && <span className={styles.redAstric}>*</span>}
            </label>
            <div className={styles.inputWrapper}>
                <EyeIcon
                    className={`${styles.icon} ${showPassword ? styles.iconActive : styles.iconDeactive}`}
                    onClick={toggleShowPassword}
                />
                <input
                    name={name}
                    type={showPassword ? 'text' : 'password'}
                    placeholder=""
                    className={styles.inputField}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    value={value}
                    onChange={onChange}
                    style={{userSelect: 'none'}}
                    onCopy={handleCopy}  // Disable copy
                    onPaste={handlePaste} // Disable paste
                    onCut={handleCut} // Disable cut
                />
            </div>

            <div className={`${styles.helpInfo} ${(helpText || helpCount) ? styles.expand : ''}`}>
                <div className={`${styles.helpText} ${helpText ? styles.visible : styles.hidden}`}>
                    {helpText || ''}
                </div>
                <div className={`${styles.helpCount} ${helpCount ? styles.visible : styles.hidden}`}>
                    {(value?.length || 0) + '/' + helpCount}
                </div>
            </div>
        </div>
    );
}

// EmailInput Component
export function EmailInput({ placeholder, helpText, helpCount, value, onChange, name, required }) {
    const { focused, handleFocus, handleBlur} = useInputLabel();
    return (
        <div className={styles.inputContainer}>
            <label className={`${styles.label} ${focused || value ? styles.floated : ''}`}>
                {placeholder}{required && <span className={styles.redAstric}>*</span>}
            </label>
            <input
                name={name}
                type="Email"
                placeholder=""
                className={styles.inputField}
                onFocus={handleFocus}
                onBlur={handleBlur}
                value={value}
                onChange={onChange}
            />
            <div className={`${styles.helpInfo} ${(helpText || helpCount) ? styles.expand : ''}`}>
                <div className={`${styles.helpText} ${helpText ? styles.visible : styles.hidden}`}>
                    {helpText || ''}
                </div>
                <div className={`${styles.helpCount} ${helpCount ? styles.visible : styles.hidden}`}>
                    {(value?.length || 0) + '/' + helpCount}
                </div>
            </div>
        </div>
    );
}

// NumberInput Component
export function NumberInput({ placeholder }) {
    return (
        <input
            type="number"
            placeholder={placeholder}
            className={styles.inputField}
        />
    );
}
