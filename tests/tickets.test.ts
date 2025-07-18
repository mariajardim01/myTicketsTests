"use strict";

import supertest from "supertest";
import app from "../src/app";
import prisma from "database";
import {  saveEvent } from "repositories/events-repository";
const api = supertest(app);
import { faker } from "@faker-js/faker"
import { CreateTicketData, saveTicket } from "repositories/tickets-repository";

beforeEach(async () => {
  await prisma.event.deleteMany();
  await prisma.ticket.deleteMany();
});

describe("get Events tickets tests", () => {

  it("success case sloud return all tickets of the event", async () => {
    const eventOnDB =  await saveEvent({date: faker.date.future() , name: faker.person.fullName()  } )
   
    await saveTicket({code:faker.string.uuid(), eventId: eventOnDB.id , owner: faker.person.fullName() })
    
    const {status, body} = await api.get(`/tickets/${eventOnDB.id}`)


    expect(status).toBe(200)
    expect(body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: expect.any(Number),
          owner: expect.any(String),
          eventId: expect.any(Number),
          code: expect.any(String),
          used: expect.any(Boolean)

        })
      ])
     )

  });

   it(" id invalid should return 400 ", async () => {
    
    const id = faker.number.int({max: 0})

    const {status, text} = await api.get(`/tickets/${id}`).ok( () => true )
    
    expect(status).toBe(400);
    expect(text).toBe("Invalid id.");

  });

  it(" id invalid should return 404 ", async () => {
    
    const id = faker.number.int({min: 0})

    const {status, text} = await api.get(`/tickets/${id}`).ok( () => true )
    
    expect(status).toBe(404);
    expect(text).toBe(`Event with id ${id} not found`);

  });

  
});

describe("put tickets tests", () => {

  it("success case sloud return 204", async () => {
    const eventOnDB =  await saveEvent({date: faker.date.future() , name: faker.person.fullName()  } )
   
    const ticketOnDB = await saveTicket({code:faker.string.uuid(), eventId: eventOnDB.id , owner: faker.person.fullName() })
    
    const {status} = await api.put(`/tickets/use/${ticketOnDB.id}`)

    expect(status).toBe(204)


  });

  it("error event already passed sloud return 403", async () => {
    const eventOnDB =  await saveEvent({date: faker.date.past() , name: faker.person.fullName()  } )
   
    const ticketOnDB = await saveTicket({code:faker.string.uuid(), eventId: eventOnDB.id , owner: faker.person.fullName() })

    const {status} = await api.put(`/tickets/use/${ticketOnDB.id}`)

    expect(status).toBe(403)


  });

   it(" id invalid should return 400 ", async () => {
    
    const id = faker.number.int({max: 0})

    const {status, text} = await api.put(`/tickets/use/${id}`).ok( () => true )
    
    expect(status).toBe(400);
    expect(text).toBe("Invalid id.");

  });

  it(" id invalid should return 404 ", async () => {
    
    const id = faker.number.int({min: 0})

    const {status, text} = await api.put(`/tickets/use/${id}`).ok( () => true )
    
    expect(status).toBe(404);
    expect(text).toBe(`Event with id ${id} not found`);

  });

  
});

describe ("post tickets", () => {

    it(" success post tickets ", async () => {
    const eventOnDB =  await saveEvent({date: faker.date.future() , name: faker.person.fullName()  } )
    const code = faker.string.uuid()
    const owner = faker.person.fullName()

    const ticket: CreateTicketData = {
        code: code,
        eventId: eventOnDB.id,
        owner: owner
    }

    
    const {status,body} = await api.post(`/tickets`).send(ticket)

    expect(status).toBe(201)
    expect(body).toEqual({
        id: expect.any(Number),
        code: expect.any(String),
        eventId: expect.any(Number),
        owner: expect.any(String),
        used: expect.any(Boolean)
    })


  });


    it("error already have a ticket with the same code and event sloud return 409", async () => {
    const eventOnDB =  await saveEvent({date: faker.date.future() , name: faker.person.fullName()  } )
    const code = faker.string.uuid()
    const owner = faker.person.fullName()

    const ticket: CreateTicketData = {
        code: code,
        eventId: eventOnDB.id,
        owner: owner
    }

    await api.post(`/tickets`).send(ticket).ok( () => true )
    const {status} = await api.post(`/tickets`).send(ticket).ok( () => true )

    expect(status).toBe(409)


  });
  
  
    it("error event already passed sloud return 403", async () => {
    const eventOnDB =  await saveEvent({date: faker.date.past() , name: faker.person.fullName()  } )
    
    const ticket: CreateTicketData = {
        code: faker.string.uuid(),
        eventId: eventOnDB.id,
        owner: faker.person.fullName()
    }

    const {status,text} = await api.post(`/tickets`).send(ticket).ok( () => true )

    expect(status).toBe(404)
  


  });

   it(" id invalid should return 422 ", async () => {
    const id = faker.number.int({max: 0})


    const ticket: CreateTicketData = {
        code: faker.string.uuid(),
        eventId: id,
        owner: faker.person.fullName()
    }

    const {status, text} = await api.post(`/tickets`).send(ticket).ok( () => true )
    
    expect(status).toBe(422);


  });

  it(" id invalid should return 404 ", async () => {
    
    const id = faker.number.int({min: 0})

    const ticket: CreateTicketData = {
        code: faker.string.uuid(),
        eventId: id,
        owner: faker.person.fullName()
    }

    const {status, text} = await api.put(`/tickets/use/${id}`).send(ticket).ok( () => true )
    
    expect(status).toBe(404);
    expect(text).toBe(`Event with id ${id} not found`);

  });

})