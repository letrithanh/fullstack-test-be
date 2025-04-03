import { Request, Response } from "express";
import EventRegistrationService from "../../control/eventRegistration/eventRegistrationService";

export default class EventRegistrationController {
    private eventRegistrationService: EventRegistrationService;

    constructor() {
        this.eventRegistrationService = new EventRegistrationService();
    }

    public async register(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id);
            const registration = await this.eventRegistrationService.register(id, req.body);
            res.status(201).json(registration);
        } catch (error) {
            res.status(500).json({ message: (error as Error).message });
        }
    }
}
