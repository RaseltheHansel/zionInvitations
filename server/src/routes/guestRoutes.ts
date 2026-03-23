import { Router } from "express";
import { getAllGuests, getGuestByToken, createGuest, deleteGuest } from "../controllers/guestController";

const router = Router();

router.get('/', getAllGuests);
router.get('/:token', getGuestByToken);
router.post('/', createGuest);
router.delete('/:id', deleteGuest);

export default router;