import request from "supertest";
import app from "../../app";
import EventEntity from "../../entity/event/eventEntity";
import PRISMA from "../../utils/prisma.client";

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
});
