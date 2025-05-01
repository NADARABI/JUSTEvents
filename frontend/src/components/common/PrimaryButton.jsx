import React from 'react';

const PrimaryButton = ({ text, onClick, isLoading }) => {
  return (
    <button
      onClick={onClick}
      disabled={isLoading}
      className="w-100 text-white"
      style={{
        backgroundColor: '#113A5D',     // 🔵 لون مميز لزر JUSTEvents
        border: 'none',
        padding: '12px',
        borderRadius: '8px',
        fontWeight: '600',
        fontSize: '16px',
        boxShadow: '0 3px 6px rgba(0,0,0,0.1)',
        cursor: 'pointer',
        transition: '0.2s',
      }}
    >
      {isLoading ? 'Loading...' : text}
    </button>
  );
};

export default PrimaryButton;
