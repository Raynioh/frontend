import { Router } from 'express';
import { getAllTickets } from '../controllers/controller';

const router = Router();

router.get('/', async (req, res) => {
  let tickets: number = -1;
  try {
    tickets = await getAllTickets();
    res.render('index', {tickets});
  } catch (err) {
    res.status(500).render('error', {errorCode: "500", errorMessage: "Internal server error"});
  }
});

export default router;
