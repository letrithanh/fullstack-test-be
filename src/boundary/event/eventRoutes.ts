import { Router } from "express";
import EventController from "./eventController";

const EVENT_PATH = "events";

const router = Router();
const eventController = new EventController();

router.post("/", eventController.createEvent.bind(eventController));
router.get("/", eventController.getEvents.bind(eventController));
router.get("/:id", eventController.getEventById.bind(eventController));

export default router;

export { EVENT_PATH };
