import prisma from "database";
import { CreateTicketData } from "repositories/tickets-repository";


export async function createTicket(data: CreateTicketData) {
  return await prisma.ticket.create({
    data
  });
}