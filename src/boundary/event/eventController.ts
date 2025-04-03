import { Request, Response } from "express";
import EventService from "../../control/event/eventService";

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

    async getEventById(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id);
            const event = await this.eventService.getEventById(id);
            let statusCode = 200;
            let message: string = "Event not found";
            if (!event) {
                statusCode = 404;
            }

            res.status(statusCode).json(event || { message });
        } catch (error) {
            res.status(500).json({ message: (error as Error).message });
        }
    }

    async deleteEventById(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id);
            await this.eventService.deleteEventById(id);
            res.status(204).send();
        } catch (error) {
            res.status(500).json({ message: (error as Error).message });
        }
    }

    async updateEventById(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id);
            const updatedEvent = await this.eventService.updateEventById(id, req.body);
            res.status(200).json(updatedEvent);
        } catch (error) {
            res.status(500).json({ message: (error as Error).message });
        }
    }
}
