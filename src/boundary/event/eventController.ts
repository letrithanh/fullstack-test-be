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

    async getEvents(req: Request, res: Response) {
        try {
            const events = await this.eventService.getEvents(req.query);
            res.status(200).json(events);
        } catch (error) {
            res.status(500).json({ message: (error as Error).message });
        }
    }
}
