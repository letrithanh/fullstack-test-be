import request from "supertest";
import app from "../../../app";
import EventEntity from "../../../entity/event/eventEntity";
import PRISMA from "../../../utils/prisma.client";

describe("Event Routes", () => {
    let validEventData: EventEntity;

    beforeEach(() => {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);

        validEventData = {
            title: "Valid Test Event",
            description: "This is a valid description.",
            date: tomorrow,
            location: "Test Location",
            maxAttendees: 50,
        };
    });

    afterEach(async () => {
        await PRISMA.event.deleteMany();
    });

    describe("POST /events", () => {
        it("should return 201 Created and the created event if the data is valid", async () => {
            const response = await request(app)
                .post("/events")
                .send(validEventData)
                .set('Content-Type', 'application/json')
                .set('Accept', 'application/json');

            expect(response.status).toBe(201);
            expect(response.body).toEqual({
                id: expect.any(Number),
                title: validEventData.title,
                description: validEventData.description,
                date: validEventData.date.toISOString(),
                location: validEventData.location,
                maxAttendees: validEventData.maxAttendees,
                createdAt: expect.any(String),
                updatedAt: expect.any(String),
            });
        });

        it("should return 500 Internal Server Error if the request body is invalid", async () => {
            const invalidEventData = { ...validEventData, title: "" }; // Invalid title

            const response = await request(app)
                .post("/events")
                .send(invalidEventData)
                .set('Content-Type', 'application/json')
                .set('Accept', 'application/json');

            expect(response.status).toBe(500);
            expect(response.body).toEqual({ message: "Invalid event data provided." });
        });
    });

    describe("GET /events", () => {
        it("should return 200 OK and all events", async () => {
            // Create a test event
            const createdEvent = await PRISMA.event.create({ data: validEventData });

            const response = await request(app).get("/events");

            expect(response.status).toBe(200);
            expect(response.body).toEqual(
                expect.arrayContaining([
                    expect.objectContaining({
                        id: createdEvent.id,
                        title: createdEvent.title,
                        description: createdEvent.description,
                        date: createdEvent.date.toISOString(),
                        location: createdEvent.location,
                        maxAttendees: createdEvent.maxAttendees,
                        createdAt: createdEvent.createdAt.toISOString(),
                        updatedAt: createdEvent.updatedAt.toISOString(),
                    }),
                ])
            );

            // Clean up the test event
            await PRISMA.event.delete({ where: { id: createdEvent.id } });
        });

        it("should return 200 OK and events filtered by title", async () => {
            // Create a test event
            const createdEvent = await PRISMA.event.create({ data: validEventData });

            const response = await request(app).get("/events?title=Valid");

            expect(response.status).toBe(200);
            expect(response.body).toEqual(
                expect.arrayContaining([
                    expect.objectContaining({
                        id: createdEvent.id,
                        title: createdEvent.title,
                        description: createdEvent.description,
                        date: createdEvent.date.toISOString(),
                        location: createdEvent.location,
                        maxAttendees: createdEvent.maxAttendees,
                        createdAt: createdEvent.createdAt.toISOString(),
                        updatedAt: createdEvent.updatedAt.toISOString(),
                    }),
                ])
            );

            // Clean up the test event
            await PRISMA.event.delete({ where: { id: createdEvent.id } });
        });
    });

    describe("GET /events/:id", () => {
        it("should return 200 OK and the event if the id is valid", async () => {
            // Create a test event
            const createdEvent = await PRISMA.event.create({ data: validEventData });

            const response = await request(app).get(`/events/${createdEvent.id}`);

            expect(response.status).toBe(200);
            expect(response.body).toEqual({
                id: createdEvent.id,
                title: createdEvent.title,
                description: createdEvent.description,
                date: createdEvent.date.toISOString(),
                location: createdEvent.location,
                maxAttendees: createdEvent.maxAttendees,
                createdAt: createdEvent.createdAt.toISOString(),
                updatedAt: createdEvent.updatedAt.toISOString(),
            });

            // Clean up the test event
            await PRISMA.event.delete({ where: { id: createdEvent.id } });
        });

        it("should return 404 Not Found if the event id is invalid", async () => {
            const response = await request(app).get("/events/9999");

            expect(response.status).toBe(404);
            expect(response.body).toEqual({ message: "Event not found" });
        });

        it("should return 500 Internal Server Error if the event id is not a number", async () => {
            const response = await request(app).get("/events/abc");

            expect(response.status).toBe(500);
            expect(response.body).toEqual({ message: "Invalid event ID provided." });
        });
    });
});
