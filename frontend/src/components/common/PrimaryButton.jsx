import React from 'react';
const PrimaryButton = ({ text, onClick, type = 'button', isLoading = false }) => {
  return (
    <button
      type={type}
      className="btn btn-primary w-100"
      onClick={onClick}
      disabled={isLoading}
    >
      {isLoading ? 'Loading...' : text}
    </button>
  );
};

export default PrimaryButton;
