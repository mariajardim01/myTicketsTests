import { CreateEventData } from "repositories/events-repository";
import prisma from "database";
import { faker} from "@faker-js/faker"

export async function createEvent(  name?: string, date?: Date ) {

    if (!name){
         name = faker.person.fullName()
    }

    if (!date){
         date = faker.date.future()
    }

  const result = await  prisma.event.create({data: {date: date , name: name }})
  return result
    
    
}