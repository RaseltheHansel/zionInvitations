import type { Request, Response } from 'express';
import Guest from '../models/Guests';
import RSVP from '../models/RSVP';
import crypto from 'crypto';

export const getAllGuests = async (_req: Request, res: Response): Promise<void> => {
  try {
    const guests = await Guest.find().sort({ createdAt: -1 });
    const rsvps  = await RSVP.find();
    const rsvpMap = new Map(rsvps.map(r => [r.guest.toString(), r]));
    const data = guests.map(g => ({
      ...g.toObject(),
      rsvp: rsvpMap.get(g._id.toString()) || null,
    }));
    res.json(data);
  } catch (err) {
    if (err instanceof Error) res.status(500).json({ message: err.message });
  }
};

export const getGuestByToken = async (req: Request, res: Response): Promise<void> => {
  try {
    const guest = await Guest.findOne({ inviteToken: req.params.token });
    if (!guest) { res.status(404).json({ message: 'Invitation not found' }); return; }
    const rsvp = await RSVP.findOne({ guest: guest._id });
    res.json({ ...guest.toObject(), rsvp: rsvp || null });
  } catch (err) {
    if (err instanceof Error) res.status(500).json({ message: err.message });
  }
};

export const createGuest = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, phone, numberOfSeats } = req.body as {
      name: string; email: string; phone?: string; numberOfSeats?: number;
    };
    const inviteToken = crypto.randomBytes(16).toString('hex');
    const guest = new Guest({ name, email, phone, numberOfSeats: numberOfSeats ?? 1, inviteToken });
    await guest.save();
    await RSVP.create({ guest: guest._id, status: 'pending' });
    res.status(201).json(guest);
  } catch (err) {
    if (err instanceof Error) res.status(500).json({ message: err.message });
  }
};

export const deleteGuest = async (req: Request, res: Response): Promise<void> => {
  try {
    const guest = await Guest.findByIdAndDelete(req.params.id);
    if (!guest) { res.status(404).json({ message: 'Guest not found' }); return; }
    await RSVP.deleteOne({ guest: req.params.id });
    res.json({ message: 'Guest deleted' });
  } catch (err) {
    if (err instanceof Error) res.status(500).json({ message: err.message });
  }
};