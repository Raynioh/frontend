import { Ticket } from "../models/ticket";
import axios from 'axios';

const backendURL = "http://localhost:3000";

export async function getAuthToken() : Promise<string | undefined> {
    let token: string | undefined;
    let payload = {
        "audience": process.env.API_IDENTIFIER,
        "grant_type": "client_credentials",
        "client_id": process.env.CLIENT_ID_M2M,
        "client_secret": process.env.CLIENT_SECRET_M2M
      };
    await axios.post(process.env.ISSUER_BASE_URL + '/oauth/token', payload)
    .then(res => {
        token = (res.data as {access_token: string}).access_token;
    })
    .catch(err => {
        console.log('Error: ', err.message);
    });
    return token;
}

export async function getAllTickets() {
    let count: number = 0;
    let accesstoken: string | undefined = await getAuthToken();
    await axios.get(backendURL + '/getTickets', { headers: {Authorization : `Bearer ${accesstoken}`} })
    .then(res => {
        try {
            let tickets: Ticket[] = (res.data as {data: Ticket[]}).data;
            count = tickets.length;
        } catch (err) {}
    })
    .catch(err => {
        console.log('Error: ', err.message);
    });
    return count;
}

export async function getTicketsByUserID(userID: number) : Promise<Ticket[] | undefined>  {
    let tickets: Ticket[] | undefined;
    let accesstoken: string | undefined = await getAuthToken();
    await axios.get(backendURL + '/getTickets/' + userID, { headers: {Authorization : `Bearer ${accesstoken}`} })
    .then(res => {
        tickets = (res.data as {data: Ticket[]}).data;
    })
    .catch(err => {
        console.log('Error: ', err.message);
    });
    return tickets;
}

export async function getTicketByID(ticketID: string) : Promise<Ticket | undefined>  {
    let ticket: Ticket | undefined;
    let accesstoken: string | undefined = await getAuthToken();
    await axios.get(backendURL + '/getTickets/ticket/' + ticketID, { headers: {Authorization : `Bearer ${accesstoken}`} })
    .then(res => {
        ticket = (res.data as {data: Ticket}).data;
    })
    .catch(err => {
        console.log('Error: ', err.message);
    });
    return ticket;
}

export async function createTicket(ticket: Ticket) : Promise<string | undefined> {
    let accesstoken: string | undefined = await getAuthToken();
    let qrCode: string | undefined;
    let payload: string = JSON.stringify(ticket);
    await axios.post(backendURL + '/createTicket', payload,{ headers: {Authorization : `Bearer ${accesstoken}`, 'Content-Type': 'application/json'} })
    .then(res => {
        qrCode = (res.data as {data: string}).data;
    })
    .catch(err => {
        throw err;
    });
    return qrCode;
}
