"use strict";

import supertest from "supertest";
import app from "../src/app";
import prisma from "database";
import { CreateEventData, saveEvent } from "repositories/events-repository";
const api = supertest(app);
import { faker } from "@faker-js/faker"
import { rejects } from "assert";

beforeEach(async () => {
  await prisma.event.deleteMany();
  await prisma.ticket.deleteMany();
});

describe("get Events tests", () => {

  it("success case sloud return all events", async () => {
    await saveEvent({date: faker.date.future() , name: faker.person.fullName()  } )
   
    const {status, body} = await api.get("/events")


    expect(status).toBe(200)
    expect(body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: expect.any(Number),
          name: expect.any(String),
          date: expect.any(String)
        })
      ])
     )

  });

   it("get Events test should return an empty array", async () => {
    
   
    const {status, body} = await api.get("/events")

    
    expect(status).toBe(200)
    expect(body).toEqual( [] )

  });

  
});

describe("get Events by Id tests", () => {

  it("success case sloud return a event", async () => {
    
    const result = await saveEvent({date: faker.date.future() , name: faker.person.fullName()  } )
   
    const {status, body} = await api.get(`/events/${result.id}`)

    
    expect(status).toBe(200)
    expect(body).toEqual(
        expect.objectContaining({
          id: expect.any(Number),
          name: expect.any(String),
          date: expect.any(String)
        })
      );

    });

  it("error case by Id invalid sloud return a status 400", async () => {
    
    const id = faker.number.int({max: 0})
   
    
    const res = await api.get(`/events/${id}`).ok(() => true);

    expect(res.status).toBe(400);
    expect(res.text).toBe("Invalid id.");
  });

  it("error case by Id not match any event sloud return a status 404", async () => {
    
    const id = faker.number.int({min: 0})
   
    
    const res = await api.get(`/events/${id}`).ok(() => true);

    expect(res.status).toBe(404);
    expect(res.text).toBe(`Event with id ${id} not found`);
  });


  

})

describe("post Event tests", () => {

  it ("success post Event", async () => {

   const event: CreateEventData = {
    date: faker.date.future(),
    name: faker.person.fullName()
   }

   const {status, body} = await api.post("/events").send(event)

   expect(status).toBe(201)
   expect(body).toEqual(
        expect.objectContaining({
          id: expect.any(Number),
          name: expect.any(String),
          date: expect.any(String)
        })
      );

  })

  it ("error by name not unique", async () => {

   const event: CreateEventData = {
    date: faker.date.future(),
    name: "Cinema na quarta"
   }


   await api.post("/events").send(event)
   const {status, text} = await api.post("/events").send(event).ok(() => true)

   expect(status).toBe(409)
   expect(text).toBe(`Event with name ${event.name} already registered.`)

  })

  it ("error by a past date", async () => {

   const event: CreateEventData = {
    date: faker.date.past(),
    name: "Cinema na quarta"
   }

   const {status} = await api.post("/events").send(event).ok(() => true)

   expect(status).toBe(422)
   

  })

})

describe ("put Events tests", () => {

  it ("success put Event", async () =>  {
     const eventOnDB = await saveEvent({date: faker.date.future() , name: faker.person.fullName()  } )

     const newEventData = {
          date: faker.date.future() , 
          name: faker.person.fullName()
     }

    const {status} = await api.put(`/events/${eventOnDB.id}`).send(newEventData)

    expect(status).toBe(200)

  })

  it ("error by name not unique", async () =>  {
    await saveEvent({date: faker.date.future() , name: "Cinema na quarta"  } )
     const eventOnDB = await saveEvent({date: faker.date.future() , name: faker.person.fullName()  } )

     const newEventData = {
          date: faker.date.future() , 
          name: "Cinema na quarta"
     }

    const {status,text} = await api.put(`/events/${eventOnDB.id}`).send(newEventData).ok(() => true)

    expect(status).toBe(409)
    expect(text).toBe(`Event with name ${newEventData.name} already registered.`)
  })

  it ("error by invalid id", async () => {

    const id = faker.number.int({max: 0})
   
    const newEventData = {
          date: faker.date.future() , 
          name: "Cinema na quarta"
     }

    const {status,text} = await api.put(`/events/${id}`).send(newEventData).ok(() => true)

    expect(status).toBe(400);
    expect(text).toBe("Invalid id.");

  })

  
  it("error case by Id not match any event sloud return a status 404", async () => {
    
    const id = faker.number.int({min: 0})
   
    
    const res = await api.put(`/events/${id}`).ok(() => true);

    expect(res.status).toBe(404);
    expect(res.text).toBe(`Event with id ${id} not found`);
  });



})

describe (" delete Events tests ", () => {

  it (" success should delete the event ", async () => {

    const eventOnDB = await saveEvent({date: faker.date.future() , name: faker.person.fullName()  } )

    const {status} = await api.delete(`/events/${eventOnDB.id}`)
    expect(status).toBe(204)
    

  })

  it (" error by id invalid ", async () => {

    const id = faker.number.int({max: 0})

    const {status,text} = await api.delete(`/events/${id}`).ok(() => true)

    expect(status).toBe(400);
    expect(text).toBe("Invalid id.");
    

  })

  it (" error by id invalid ", async () => {

    const id = faker.number.int({min: 0})

    const {status,text} = await api.delete(`/events/${id}`).ok(() => true)

    expect(status).toBe(404);
    expect(text).toBe(`Event with id ${id} not found`);
    

  })
    


})