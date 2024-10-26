import axios from 'axios';
import { Router } from 'express';
import { createTicket } from '../controllers/controller';
import { Ticket } from '../models/ticket';

const router = Router();

router.get('/', (req, res) => {
    res.render('generate');
});

router.post('/', async (req, res) => {
    try {
        var ticket: Ticket = req.body;
        const qrCode = await createTicket(ticket!);
        res.render('ticket', {qrCode});
    } catch(err) {
        if (axios.isAxiosError(err)) {
            res.status(err.status || 500).render('error', {errorCode: err.status, errorMessage: err.response?.data || "Error occurred"})
        } else {
            res.status(500).send("Error occurred");
        }
    }
});

export default router;
