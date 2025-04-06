import EventEntity from "../../entity/event/eventEntity";
import PRISMA from "../../utils/prisma.client";
import EventRegistrationService from "../eventRegistration/eventRegistrationService";
import EventValidator from "./eventValidator";

export default class EventService {
    private eventValidator: EventValidator;

    constructor() {
        this.eventValidator = new EventValidator();
    }

    async createEvent(data: EventEntity) {
        const isValid = this.eventValidator.isEventValid(data);
        if (!isValid) {
            throw new Error("Invalid event data provided.");
        }

        return await PRISMA.event.create({ data });
    }

    async getEvents(query: { title?: string }) {
        const where: any = {};

        if (query.title) {
            where.title = { contains: query.title };
        }

        where.deleted = false;

        const events = await PRISMA.event.findMany({ where });
        
        const eventRegistrationService = new EventRegistrationService();
        const mappedEventIdsAttendees = await eventRegistrationService.getEventAttendeeCounts();
        return events.map((event) => ({
            ...event,
            joinedAttendee: mappedEventIdsAttendees[event.id] || 0,
        }));
    }

    async getEventById(id: number) {
        const isNotNumber = typeof id !== "number";
        const isNotInteger = !Number.isInteger(id);

        if (isNotNumber || isNotInteger) {
            throw new Error("Invalid event ID provided.");
        }

        return await PRISMA.event.findUnique({
            where: {
                id: id,
            },
        });
    }

    async deleteEventById(id: number) {
        const isNotNumber = typeof id !== "number";
        const isNotInteger = !Number.isInteger(id);

        if (isNotNumber || isNotInteger) {
            throw new Error("Invalid event ID provided.");
        }

        const event = await this.getEventById(id);

        if (!event) {
            throw new Error("Event not found.");
        }

        return await PRISMA.event.update({
            where: {
                id: id,
            },
            data: {
                deleted: true,
            },
        });
    }

    async updateEventById(id: number, data: EventEntity) {
        const isNotNumber = typeof id !== "number";
        const isNotInteger = !Number.isInteger(id);

        if (isNotNumber || isNotInteger) {
            throw new Error("Invalid event ID provided.");
        }

        const isValid = this.eventValidator.isEventValid(data);
        if (!isValid) {
            throw new Error("Invalid event data provided.");
        }

        const event = await this.getEventById(id);

        if (!event) {
            throw new Error("Event not found.");
        }

        const eventRegistrationService = new EventRegistrationService();
        const mappedEventIdsAttendees = await eventRegistrationService.getEventAttendeeCounts();
        const joinedAttendee = mappedEventIdsAttendees[event.id];
        if (joinedAttendee > data.maxAttendees) {
            throw new Error("Attendees exceed maximum.");
        }

        return await PRISMA.event.update({
            where: {
                id: id,
            },
            data: data,
        });
    }
}
