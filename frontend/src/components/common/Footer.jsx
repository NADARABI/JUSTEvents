import React from 'react';
import './footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div>© {new Date().getFullYear()} Jordan University of Science and Technology</div>
      <div>Graduation Project — JUSTEvents Website</div>
    </footer>
  );
};

export default Footer;
