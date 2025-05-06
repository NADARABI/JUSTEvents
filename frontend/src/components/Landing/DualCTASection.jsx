import React from 'react';
import './dualCTASection.css';
import { PlusCircle, CalendarClock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const DualCTASection = () => {
  const navigate = useNavigate();

  return (
    <section className="dual-cta-section">
      <h2 className="cta-title">Bring Your Ideas to Life at JUST</h2>
      <p className="cta-subtitle">
        Create engaging events, reserve campus rooms, and empower your student journey - all in one place.
      </p>
      <div className="cta-button-group">
        <button onClick={() => navigate('/login')}>
          <PlusCircle size={18} /> Start Hosting
        </button>
        <button onClick={() => navigate('/login')}>
          <CalendarClock size={18} /> Book a Room
        </button>
      </div>
    </section>
  );
};

export default DualCTASection;