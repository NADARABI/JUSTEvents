import React from 'react';

const InputField = ({ label, type = 'text', value, onChange, placeholder, name }) => {
  return (
    <div className="mb-3">
      {label && <label className="form-label">{label}</label>}
      <input
        type={type}
        className="form-control"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        name={name}
        required
      />
    </div>
  );
};

export default InputField;
