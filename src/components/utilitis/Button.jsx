import React from 'react';
import '../../styles/component.css';

const Button = ({
  className = '',
  onClick,
  disabled,
  children,
  label,
  size = 'medium',
  backgroundcolor,
  hovercolor = '#00264c', 
  border,
  textColor,
}) => {
  const textStyle = backgroundcolor === '#003366' ? '#fff' : textColor || '#000';

  const styles = {
    backgroundColor: backgroundcolor || (disabled ? '#e0e0e0' : '#f0f0f0'),
    color: disabled ? '#a1a1a1' : textStyle, 
    border: border ? `1px solid ${border}` : 'none',
    padding: size === 'small' ? '8px 15px' : size === 'large' ? '15px 60px' : '10px 30px',
    borderRadius: size === 'small' ? '8px' : '10px',
    cursor: disabled ? 'not-allowed' : 'pointer',
    transition: 'all 0.3s ease-in-out',
  };

  return (
    <button
      className={`btn-for-all ${className}`}
      disabled={disabled}
      onClick={onClick}
      aria-label={label}
      style={styles}
      onMouseEnter={(e) => {
        if (!disabled && backgroundcolor === '#003366') {
          e.target.style.backgroundColor = hovercolor;
        }
      }}
      onMouseLeave={(e) => {
        if (!disabled && backgroundcolor === '#003366') {
          e.target.style.backgroundColor = backgroundcolor;
        }
      }}
    >
      {children}
    </button>
  );
};

export default Button;
