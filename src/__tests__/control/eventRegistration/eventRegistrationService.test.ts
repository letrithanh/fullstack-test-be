import EventRegistrationService from "../../../control/eventRegistration/eventRegistrationService";
import AttendeeService from "../../../control/attendee/attendeeService";
import EventService from "../../../control/event/eventService";
import AttendeeEntity from "../../../entity/attendee/attendeeEntity";
import PRISMA from "../../../utils/prisma.client";

// Mock the Prisma client, AttendeeService, and EventService
jest.mock('../../../utils/prisma.client', () => ({
    eventRegistration: {
        create: jest.fn(),
        count: jest.fn(),
        findUnique: jest.fn()
    },
}));
jest.mock('../../../control/attendee/attendeeService');
jest.mock('../../../control/event/eventService');

describe("EventRegistrationService", () => {
    let eventRegistrationService: EventRegistrationService;
    let mockAttendeeService: any;
    let mockEventService: any;
    let mockPrismaEventRegistrationCreate: jest.Mock;
    let mockPrismaEventRegistrationCount: jest.Mock;

    beforeEach(() => {
        jest.clearAllMocks();
        eventRegistrationService = new EventRegistrationService();
        mockAttendeeService = new AttendeeService() as any;
        mockEventService = new EventService() as any;
        (eventRegistrationService as any).attendeeService = mockAttendeeService;
        (eventRegistrationService as any).eventService = mockEventService;
        mockPrismaEventRegistrationCreate = PRISMA.eventRegistration.create as jest.Mock;
        mockPrismaEventRegistrationCount = PRISMA.eventRegistration.count as jest.Mock;
    });

    describe("register", () => {
        it("should throw an error if the event ID is missing", async () => {
            await expect(eventRegistrationService.register(null as any, {} as any)).rejects.toThrow("Event ID must be provided");
        });

        it("should throw an error if the attendee data is missing", async () => {
            await expect(eventRegistrationService.register(1, null as any)).rejects.toThrow("Attendee data must be provided");
        });

        it("should throw an error if the event is not found", async () => {
            (mockEventService.getEventById as jest.Mock).mockResolvedValue(null);
            await expect(eventRegistrationService.register(1, {} as any)).rejects.toThrow("Event not found");
        });

        it("should throw an error if the event is deleted", async () => {
            (mockEventService.getEventById as jest.Mock).mockResolvedValue({ deleted: true });
            await expect(eventRegistrationService.register(1, {} as any)).rejects.toThrow("Event is deleted");
        });

        it("should throw an error if the event is full", async () => {
            (mockEventService.getEventById as jest.Mock).mockResolvedValue({ deleted: false, maxAttendees: 1 });
            mockPrismaEventRegistrationCount.mockResolvedValue(1);
            await expect(eventRegistrationService.register(1, {} as any)).rejects.toThrow("Event is full");
        });

        it("should create a new attendee if one doesn't exist", async () => {
            // Arrange
            (mockEventService.getEventById as jest.Mock).mockResolvedValue({ deleted: false, maxAttendees: 2 });
            mockPrismaEventRegistrationCount.mockResolvedValue(0);
            (mockAttendeeService.getAttendeeByEmail as jest.Mock).mockResolvedValue(null);
            const newAttendee: AttendeeEntity = { id: 2, name: "Test", gender: "MALE", email: "test@example.com", phone: "0123456789" };
            (mockAttendeeService.createAttendee as jest.Mock).mockResolvedValue(newAttendee);
            mockPrismaEventRegistrationCreate.mockResolvedValue({});

            const attendeeData: AttendeeEntity = { name: "Test", gender: "MALE", email: "test@example.com", phone: "0123456789" };

            // Act
            await eventRegistrationService.register(1, attendeeData);

            // Assert
            expect(mockAttendeeService.createAttendee).toHaveBeenCalledWith(attendeeData);
            expect(mockPrismaEventRegistrationCreate).toHaveBeenCalledWith({
                data: {
                    eventId: 1,
                    attendeeId: 2,
                },
            });
        });

        it("should reuse an existing attendee if one exists", async () => {
            // Arrange
            (mockEventService.getEventById as jest.Mock).mockResolvedValue({ deleted: false, maxAttendees: 2 });
            mockPrismaEventRegistrationCount.mockResolvedValue(0);
            const existingAttendee: AttendeeEntity = { id: 2, name: "Test", gender: "MALE", email: "test@example.com", phone: "0123456789" };
            (mockAttendeeService.getAttendeeByEmail as jest.Mock).mockResolvedValue(existingAttendee);
            mockPrismaEventRegistrationCreate.mockResolvedValue({});

            const attendeeData: AttendeeEntity = { name: "Test", gender: "MALE", email: "test@example.com", phone: "0123456789" };

            // Act
            await eventRegistrationService.register(1, attendeeData);

            // Assert
            expect(mockAttendeeService.createAttendee).not.toHaveBeenCalled();
            expect(mockPrismaEventRegistrationCreate).toHaveBeenCalledWith({
                data: {
                    eventId: 1,
                    attendeeId: 2,
                },
            });
        });

        it("should create an event registration", async () => {
            // Arrange
            (mockEventService.getEventById as jest.Mock).mockResolvedValue({ deleted: false, maxAttendees: 2 });
            mockPrismaEventRegistrationCount.mockResolvedValue(0);
            const existingAttendee: AttendeeEntity = { id: 2, name: "Test", gender: "MALE", email: "test@example.com", phone: "0123456789" };
            (mockAttendeeService.getAttendeeByEmail as jest.Mock).mockResolvedValue(existingAttendee);
            mockPrismaEventRegistrationCreate.mockResolvedValue({});

            const attendeeData: AttendeeEntity = { name: "Test", gender: "MALE", email: "test@example.com", phone: "0123456789" };

            // Act
            await eventRegistrationService.register(1, attendeeData);

            // Assert
            expect(mockPrismaEventRegistrationCreate).toHaveBeenCalledTimes(1);
            expect(mockPrismaEventRegistrationCreate).toHaveBeenCalledWith({
                data: {
                    eventId: 1,
                    attendeeId: 2,
                },
            });
        });

        it("should throw an error if the attendee is already registered for the event", async () => {
            // Arrange
            (mockEventService.getEventById as jest.Mock).mockResolvedValue({ deleted: false, maxAttendees: 2 });
            mockPrismaEventRegistrationCount.mockResolvedValue(0);
            const existingAttendee: AttendeeEntity = { id: 2, name: "Test", gender: "MALE", email: "test@example.com", phone: "0123456789" };
            (mockAttendeeService.getAttendeeByEmail as jest.Mock).mockResolvedValue(existingAttendee);
            (PRISMA.eventRegistration.findUnique as jest.Mock).mockResolvedValue({});

            const attendeeData: AttendeeEntity = { name: "Test", gender: "MALE", email: "test@example.com", phone: "0123456789" };

            // Act & Assert
            await expect(eventRegistrationService.register(1, attendeeData)).rejects.toThrow("Attendee is already registered for this event");
        });
    });
});
