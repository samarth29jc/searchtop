import React from "react";

const InputField = ({ 
  label, 
  type = "text", 
  name, 
  value, 
  onChange, 
  onBlur, 
  required, 
  errorMessage,placeholder 
}) => {
  return (
    <div className="form__group">
      <input
        type={type}
        className={`form__field ${errorMessage ? "invalid" : ""}`}
        placeholder={placeholder}
        name={name}
        id={name}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        required={required}
      />
      <label htmlFor={name} className="form__label">
        {label}
      </label>
      <p className="error-message">{errorMessage}</p>
    </div>
  );
};

export default InputField;
