import React from 'react';
import './statsSummaryStrip.css';
import { CalendarCheck, Users, MessageSquare } from 'lucide-react';

// Static/mock values for now — will be replaced by backend data later
const stats = [
  {
    icon: <CalendarCheck size={28} />,
    label: 'Events Hosted',
    value: 136,
  },
  {
    icon: <Users size={28} />,
    label: 'Active Users',
    value: 420,
  },
  {
    icon: <MessageSquare size={28} />,
    label: 'Feedback Received',
    value: 89,
  },
];

const StatsSummaryStrip = () => {
  return (
    <section className="stats-strip">
      {stats.map((stat, idx) => (
        <div className="stat-card" key={idx}>
          <div className="stat-icon">{stat.icon}</div>
          <div className="stat-value">{stat.value}</div>
          <div className="stat-label">{stat.label}</div>
        </div>
      ))}
    </section>
  );
};

export default StatsSummaryStrip;
