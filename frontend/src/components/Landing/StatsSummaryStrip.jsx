// src/components/Landing/StatsSummaryStrip.jsx
import React, { useEffect, useState } from 'react';
import './statsSummaryStrip.css';
import { CalendarCheck, Users, MessageSquare } from 'lucide-react';
import api from '../../services/api';

const fallbackStats = {
  eventsHosted: 136,
  activeUsers: 420,
  feedbackReceived: 89,
};

const StatsSummaryStrip = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/api/analytics/public/stats-summary');
        setStats(res.data || fallbackStats);
      } catch (err) {
        console.error('Failed to fetch stats summary:', err);
        setStats(fallbackStats);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <section className="stats-strip" aria-label="JUSTEvents platform statistics">
      {loading ? (
        <p className="loading-text">Loading stats...</p>
      ) : (
        <>
          <div className="stat-card">
            <div className="stat-icon"><CalendarCheck size={28} /></div>
            <div className="stat-value">{stats.eventsHosted}</div>
            <div className="stat-label">Events Hosted</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon"><Users size={28} /></div>
            <div className="stat-value">{stats.activeUsers}</div>
            <div className="stat-label">Active Users</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon"><MessageSquare size={28} /></div>
            <div className="stat-value">{stats.feedbackReceived}</div>
            <div className="stat-label">Feedback Received</div>
          </div>
        </>
      )}
    </section>
  );
};

export default StatsSummaryStrip;
