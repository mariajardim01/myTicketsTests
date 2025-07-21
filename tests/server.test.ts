"use strict";

import supertest from "supertest";
import app from "../src/app";
import prisma from "database";
import { CreateEventData, saveEvent } from "repositories/events-repository";
const api = supertest(app);
import { faker } from "@faker-js/faker"
import { rejects } from "assert";
import { createEvent } from "./factories/events-factory";

beforeEach(async () => {
  // Ordem correta: dependências primeiro
  await prisma.ticket.deleteMany();
  await prisma.event.deleteMany();
  
  // Adicionar um pequeno delay para garantir que tudo foi processado
  await new Promise(resolve => setTimeout(resolve, 50));
});

afterAll(async () => {
  await prisma.$disconnect();
});

describe("server tests", ()=>{

    it ("health endpoint", async () => {

        const result = await api.get("/health")

        expect(result.status).toBe(200)
        expect(result.text).toBe("I'm okay!")
    })
})