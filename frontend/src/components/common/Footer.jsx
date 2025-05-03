import React from 'react';

const Footer = () => {
  return (
    <footer className="text-center p-3" style={{ backgroundColor: '#002b5b', color: '#fff' }}>
      <div>© {new Date().getFullYear()} Jordan University of Science and Technology.</div>
      <div>Graduation Project — JUSTEvents Website.</div>
    </footer>
  );
};

export default Footer;
