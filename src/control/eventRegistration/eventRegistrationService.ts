import AttendeeService from "../attendee/attendeeService";
import EventService from "../event/eventService";
import AttendeeEntity from "../../entity/attendee/attendeeEntity";
import PRISMA from "../../utils/prisma.client";

export default class EventRegistrationService {
    private attendeeService: AttendeeService;

    constructor() {
        this.attendeeService = new AttendeeService();
    }

    private async eventChecker(eventId: number) {
        const eventService = new EventService();
        const event = await eventService.getEventById(eventId);

        const isEventDeleted = event?.deleted;
        if (isEventDeleted) {
            throw new Error("Event is deleted");
        }

        const isEventNotFound = !event;
        if (isEventNotFound) {
            throw new Error("Event not found");
        }

        const attendeeCount = await PRISMA.eventRegistration.count({
            where: {
                eventId: eventId,
            },
        });

        const isEventFull = attendeeCount >= event.maxAttendees;
        if (isEventFull) {
            throw new Error("Event is full");
        }
    }

    private async attendeeChecker(
        eventId: number,
        attendeeData: AttendeeEntity
    ) {
        let attendee = await this.attendeeService.getAttendeeByEmail(
            attendeeData.email
        );

        if (!attendee) {
            attendee = await this.attendeeService.createAttendee(attendeeData);
        }

        const existingRegistration = await PRISMA.eventRegistration.findUnique({
            where: {
                eventId_attendeeId: {
                    eventId: eventId,
                    attendeeId: attendee.id!,
                },
            },
        });

        if (existingRegistration) {
            throw new Error("Attendee is already registered for this event");
        }

        return attendee;
    }

    private registerChecker(eventId: number, attendeeData: AttendeeEntity) {
        const isEventIdMissing = !eventId;
        if (isEventIdMissing) {
            throw new Error("Event ID must be provided");
        }

        const isAttendeeDataMissing = !attendeeData;
        if (isAttendeeDataMissing) {
            throw new Error("Attendee data must be provided");
        }
    }

    public async register(eventId: number, attendeeData: AttendeeEntity) {
        this.registerChecker(eventId, attendeeData);
        await this.eventChecker(eventId);
        let attendee = await this.attendeeChecker(eventId, attendeeData);

        return await PRISMA.eventRegistration.create({
            data: {
                eventId: eventId,
                attendeeId: attendee.id!,
            },
        });
    }

    public async getEventAttendeeCounts(): Promise<{
        [eventId: number]: number;
    }> {
        const eventRegistrations = await PRISMA.eventRegistration.groupBy({
            by: ["eventId"],
            _count: {
                eventId: true,
            },
        });

        const eventAttendeeCounts: { [eventId: number]: number } = {};
        eventRegistrations.forEach((registration) => {
            eventAttendeeCounts[registration.eventId] =
                registration._count.eventId;
        });

        return eventAttendeeCounts;
    }
}
