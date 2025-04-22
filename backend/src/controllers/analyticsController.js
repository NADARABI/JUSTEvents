import db from '../utils/db.js';
import Event from '../models/Event.js';

export const getTotalEvents = async (req, res) => {
  const [[{ count }]] = await db.execute(`SELECT COUNT(*) AS count FROM events`);
  res.json({ success: true, count });
};

export const getTotalRSVPs = async (req, res) => {
  const [[{ count }]] = await db.execute(`SELECT COUNT(*) AS count FROM event_rsvps`);
  res.json({ success: true, count });
};

export const getRSVPsForEvent = async (req, res) => {
  const { id } = req.params;
  const [[{ count }]] = await db.execute(`SELECT COUNT(*) AS count FROM event_rsvps WHERE event_id = ?`, [id]);
  res.json({ success: true, count });
};

export const getTopEvents = async (req, res) => {
  const [rows] = await db.execute(`
    SELECT e.id, e.title, COUNT(r.id) AS rsvp_count
    FROM events e
    LEFT JOIN event_rsvps r ON e.id = r.event_id
    GROUP BY e.id
    ORDER BY rsvp_count DESC
    LIMIT 3
  `);
  res.json({ success: true, data: rows });
};

export const getRsvpTrend = async (req, res) => {
  try {
    const [rows] = await db.execute(`
      SELECT DATE(created_at) AS date, COUNT(*) AS count
      FROM event_rsvps
      GROUP BY DATE(created_at)
      ORDER BY date ASC
    `);
    res.json({ success: true, data: rows });
  } catch (err) {
    console.error('RSVP trend error:', err.message);
    res.status(500).json({ success: false, message: 'Failed to fetch RSVP trend' });
  }
};

export const getCategoryStats = async (req, res) => {
  try {
    const [rows] = await db.execute(`
      SELECT 
        e.category,
        COUNT(e.id) AS total_events,
        COUNT(r.id) AS total_rsvps,
        ROUND(AVG(f.rating), 2) AS avg_rating
      FROM events e
      LEFT JOIN event_rsvps r ON e.id = r.event_id
      LEFT JOIN feedback f ON e.id = f.event_id
      GROUP BY e.category
      ORDER BY total_events DESC
    `);

    res.status(200).json({ success: true, data: rows });
  } catch (err) {
    console.error('Category stats error:', err.message);
    res.status(500).json({ success: false, message: 'Failed to fetch category stats' });
  }
};

export const getExpiryStats = async (req, res) => {
  try {
    const stats = await Event.getExpiryStats();
    res.status(200).json({ success: true, data: stats });
  } catch (error) {
    console.error("getExpiryStats error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch event expiry stats" });
  }
};

export const getTopEngagedUsers = async (req, res) => {
  try {
    const [rows] = await db.execute(`
      SELECT 
        u.id,
        u.name,
        u.email,
        COUNT(DISTINCT r.id) AS rsvp_count,
        COUNT(DISTINCT f.id) AS feedback_count,
        COUNT(DISTINCT s.id) AS saved_count,
        ((COUNT(DISTINCT r.id) * 2) + (COUNT(DISTINCT f.id) * 2) + (COUNT(DISTINCT s.id))) AS engagement_score
      FROM users u
      LEFT JOIN event_rsvps r ON u.id = r.user_id
      LEFT JOIN feedback f ON u.id = f.user_id
      LEFT JOIN saved_events s ON u.id = s.user_id
      GROUP BY u.id
      ORDER BY engagement_score DESC
      LIMIT 3
    `);

    res.status(200).json({ success: true, data: rows });
  } catch (err) {
    console.error('Top engaged users error:', err.message);
    res.status(500).json({ success: false, message: 'Failed to fetch top engaged users' });
  }
};
