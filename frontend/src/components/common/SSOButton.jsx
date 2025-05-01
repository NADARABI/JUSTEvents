import React from 'react';

const SSOButton = ({ provider, onClick }) => {
  const logos = {
    google: '/images/google.jpeg',
    microsoft: '/images/outlook.jpeg',
  };

  return (
    <button
      onClick={onClick}
      className="border rounded p-3 bg-white"
      style={{
        width: '80px',
        height: '80px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
      }}
    >
      <img
        src={logos[provider]}
        alt={`${provider} login`}
        style={{ width: '40px', height: '40px' }}
      />
    </button>
  );
};

export default SSOButton;
