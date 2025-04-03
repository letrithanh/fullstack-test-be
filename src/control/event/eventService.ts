import EventEntity from "../../entity/event/eventEntity";
import PRISMA from "../../utils/prisma.client";
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

        return await PRISMA.event.findMany({ where });
    }

    async getEventById(id: number) {
        const isNotNumber = typeof id !== 'number';
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
        const isNotNumber = typeof id !== 'number';
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
}
