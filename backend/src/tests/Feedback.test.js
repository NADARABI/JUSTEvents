import Feedback from '../models/Feedback.js';
import db from '../utils/db.js';

jest.mock('../utils/db.js');

describe('Feedback model', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should create feedback', async () => {
    db.execute.mockResolvedValueOnce([{ insertId: 9 }]);
    const id = await Feedback.create({ event_id: 1, user_id: 2, comment: 'Nice', rating: 5 });
    expect(db.execute).toHaveBeenCalledWith(
      expect.stringContaining('INSERT INTO feedback'),
      [1, 2, 'Nice', 5]
    );
    expect(id).toBe(9);
  });

  it('should get feedback by event', async () => {
    db.execute.mockResolvedValueOnce([[{ id: 1, comment: 'Good', rating: 4, user_name: 'Ali', user_id: 2 }]]);
    const rows = await Feedback.getByEvent(1);
    expect(db.execute).toHaveBeenCalledWith(expect.stringContaining('WHERE f.event_id = ?'), [1]);
    expect(rows).toEqual([{ id: 1, comment: 'Good', rating: 4, user_name: 'Ali', user_id: 2 }]);
  });
}); 