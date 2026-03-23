import { Router } from 'express';
import { submitRSVP, getRSVPStats } from '../controllers/rsvpController';

const router = Router();

router.post('/:token',  submitRSVP);
router.get('/stats',    getRSVPStats);

export default router;