import EventEntity from "../entity/event/eventEntity";
import PRISMA from "../utils/prisma.client";
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
}
