import { Router } from 'express';
import { requiresAuth } from 'express-openid-connect';
import { Ticket } from '../models/ticket';
import { createTicket, getTicketByID, getTicketsByUserID } from '../controllers/controller';
import axios, {AxiosError} from 'axios';

const router = Router();

router.get('/:ticketID', requiresAuth(), async (req, res) => {
    let ticketID: string = req.params.ticketID;
    let ticket: Ticket = (await getTicketByID(ticketID))!;
    let user = req.oidc.user;
    res.render('info', {user, ticket});
});

export default router;
