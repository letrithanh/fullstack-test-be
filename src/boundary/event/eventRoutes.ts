import { Router } from "express";
import EventController from "./eventController";
import EventRegistrationController from "../eventRegistration/eventRegistrationController";

const EVENT_PATH = "events";

const router = Router();
const eventController = new EventController();
const eventRegistrationController = new EventRegistrationController();

router.post("/", eventController.createEvent.bind(eventController));
router.get("/", eventController.getEvents.bind(eventController));
router.get("/:id", eventController.getEventById.bind(eventController));
router.delete("/:id", eventController.deleteEventById.bind(eventController));
router.put("/:id", eventController.updateEventById.bind(eventController));
router.post("/:id/register", eventRegistrationController.register.bind(eventRegistrationController));

export default router;

export { EVENT_PATH };
