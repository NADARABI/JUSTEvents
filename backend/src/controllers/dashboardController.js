import db from '../utils/db.js';

export const getOrganizerSummary = async (req, res) => {
  const { id } = req.params;

  try {
    const [[{ total_events }]] = await db.execute(
      `SELECT COUNT(*) AS total_events FROM events WHERE organizer_id = ?`,
      [id]
    );

    const [[{ total_rsvps }]] = await db.execute(
      `SELECT COUNT(*) AS total_rsvps 
       FROM event_rsvps r
       JOIN events e ON r.event_id = e.id
       WHERE e.organizer_id = ?`,
      [id]
    );

    const [[{ avg_rating }]] = await db.execute(
      `SELECT AVG(f.rating) AS avg_rating
       FROM feedback f
       JOIN events e ON f.event_id = e.id
       WHERE e.organizer_id = ?`,
      [id]
    );

    res.status(200).json({
      success: true,
      data: {
        total_events,
        total_rsvps,
        avg_rating: avg_rating !== null ? Number(parseFloat(avg_rating).toFixed(2)) : 0
      }
    });
  } catch (err) {
    console.error('Organizer summary error:', err.message);
    res.status(500).json({ success: false, message: 'Failed to load summary' });
  }
};
