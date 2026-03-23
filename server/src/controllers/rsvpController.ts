import type { Request, Response } from 'express';
import RSVP from '../models/RSVP';
import Guest from '../models/Guests';

export const submitRSVP = async (req: Request, res: Response): Promise<void> => {
  try {
    const { token } = req.params;
    const { status, attendingCount, message } = req.body as {
      status: 'accepted' | 'declined';
      attendingCount?: number;
      message?: string;
    };

    const guest = await Guest.findOne({ inviteToken: token });
    if (!guest) { res.status(404).json({ message: 'Invitation not found' }); return; }

    const rsvp = await RSVP.findOneAndUpdate(
      { guest: guest._id },
      {
        status,
        attendingCount: attendingCount ?? 1,
        message,
        respondedAt: new Date(),
      },
      { new: true, upsert: true }
    );

    res.json(rsvp);
  } catch (err) {
    if (err instanceof Error) res.status(500).json({ message: err.message });
  }
};

export const getRSVPStats = async (_req: Request, res: Response): Promise<void> => {
  try {
    const total    = await RSVP.countDocuments();
    const accepted = await RSVP.countDocuments({ status: 'accepted' });
    const declined = await RSVP.countDocuments({ status: 'declined' });
    const pending  = await RSVP.countDocuments({ status: 'pending' });
    const totalAttending = await RSVP.aggregate([
      { $match: { status: 'accepted' } },
      { $group: { _id: null, total: { $sum: '$attendingCount' } } },
    ]);
    res.json({
      total,
      accepted,
      declined,
      pending,
      totalAttending: totalAttending[0]?.total ?? 0,
    });
  } catch (err) {
    if (err instanceof Error) res.status(500).json({ message: err.message });
  }
};