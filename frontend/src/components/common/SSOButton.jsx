import React from 'react';

const SSOButton = ({ provider, onClick }) => {
  const getButtonText = () => {
    switch (provider) {
      case 'google':
        return 'Continue with Google';
      case 'microsoft':
        return 'Continue with Microsoft';
      default:
        return 'Continue';
    }
  };

  const getButtonClass = () => {
    switch (provider) {
      case 'google':
        return 'btn btn-outline-danger w-100';
      case 'microsoft':
        return 'btn btn-outline-primary w-100';
      default:
        return 'btn btn-secondary w-100';
    }
  };

  return (
    <button className={getButtonClass()} onClick={onClick} type="button">
      {getButtonText()}
    </button>
  );
};

export default SSOButton;
