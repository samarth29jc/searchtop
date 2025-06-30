import React from 'react';
import '../../styles/component.css'; 

export const Input = ({
  label,
  id,
  placeholder,
  type = "text",
  value,
  onChange,
  onKeyDown,
  className = "",
  labelClass = "",
  inputClass = "",
  hideLabel = false,  
  hideWrapper = false ,
  mask = null,
  required = false,
  ...props
}) => {
  const handleChange = (e) => {
    let inputValue = e.target.value;
    if (mask) {
      inputValue = mask(inputValue); 
    }
    onChange(inputValue); 
  };

  return (
    <>
    {!hideWrapper ? (
      <div className={`id-input-div ${className}`}>
        {!hideLabel && (
          <label
            className={`id-label ${value ? "filled-id-label" : ""} ${labelClass}`}
            htmlFor={id}
          >
            {label}
          </label>
        )}
        <input
          {...props} 
          id={id}
          type={type}
          value={value}
          onChange={handleChange}
          onKeyDown={onKeyDown}
          placeholder={placeholder}
          className={`transaction-input ${inputClass}`}
          required={required}
        />
      </div>
    ) : (
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        onKeyDown={onKeyDown}
        placeholder={placeholder}
        className={`transaction-input ${inputClass}`}
        required={required}
      />
    )}
  </>
);
};

// Reusable SelectInput component
export const Select = ({
  label,
  id,
  options = [],
  value,
  onChange,
  onKeyDown,
  className = "",
  labelClass = "",
  selectClass = "",
  name = "",
  required = false,
}) => (
  <div className={`id-input-div ${className}`}>
    <label className={`id-label ${value ? "filled-id-label" : ""} ${labelClass}`} htmlFor={id}>
      {label}
    </label>
    <select
      id={id}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onKeyDown={onKeyDown}
      className={`select-div ${selectClass}`}
      required={required}
    >
      <option value="">Select {name} {label}</option>
      {options.map((option, index) => {
        if (typeof option === "object") {
          return (
            <option key={option.id} value={option.id}>
              {option.label}
            </option>
          );
        } else {
          return (
            <option key={index} value={option}>
              {option}
            </option>
          );
        }
      })}
    </select>
  </div>
);
