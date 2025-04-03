import { Request, Response } from "express";
import EventService from "../../control/eventService";

export default class EventController {
    private eventService: EventService;

    constructor() {
        this.eventService = new EventService();
    }

    async createEvent(req: Request, res: Response) {
        try {
            const createdEvent = await this.eventService.createEvent(req.body);
            res.status(201).json(createdEvent);
        } catch (error) {
            res.status(500).json({ message: (error as Error).message });
        }
    }
}
