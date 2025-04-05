import EventRegistrationService from "../../../control/eventRegistration/eventRegistrationService";
import AttendeeService from "../../../control/attendee/attendeeService";
import EventService from "../../../control/event/eventService";
import AttendeeEntity from "../../../entity/attendee/attendeeEntity";
import PRISMA from "../../../utils/prisma.client";

// Mock the Prisma client
jest.mock('../../../utils/prisma.client', () => ({
    eventRegistration: {
        create: jest.fn(),
        count: jest.fn(),
        findUnique: jest.fn(),
        groupBy: jest.fn()
    },
    event: {
        findUnique: jest.fn().mockResolvedValue({})
    },
    attendee: {
        findUnique: jest.fn().mockResolvedValue({})
    }
}));

describe("EventRegistrationService", () => {
    let eventRegistrationService: EventRegistrationService;
    let mockPrismaEventRegistrationCreate: jest.Mock;
    let mockPrismaEventRegistrationCount: jest.Mock;
    let mockPrismaEventRegistrationGroupBy: jest.Mock;
    let mockPrismaEventRegistrationFindUnique: jest.Mock;
    let mockPrismaAttendeeFindUnique: jest.Mock;

    beforeEach(() => {
        jest.clearAllMocks();
        eventRegistrationService = new EventRegistrationService();
        mockPrismaEventRegistrationCreate = (PRISMA.eventRegistration.create as jest.Mock);
        mockPrismaEventRegistrationCount = (PRISMA.eventRegistration.count as jest.Mock);
        mockPrismaEventRegistrationGroupBy = (PRISMA.eventRegistration.groupBy as jest.Mock);
        mockPrismaEventRegistrationFindUnique = (PRISMA.eventRegistration.findUnique as jest.Mock);
        mockPrismaAttendeeFindUnique = (PRISMA.attendee.findUnique as jest.Mock);
    });

    describe("register", () => {
        it("should throw an error if eventId is missing", async () => {
            await expect(eventRegistrationService.register(null as any, {} as any)).rejects.toThrow("Event ID must be provided");
        });

        it("should throw an error if attendeeData is missing", async () => {
            await expect(eventRegistrationService.register(1, null as any)).rejects.toThrow("Attendee data must be provided");
        });

        it("should create an event registration", async () => {
            // Arrange
            const eventId = 1;
            const attendeeId = 2;
            const attendeeData: AttendeeEntity = { id: attendeeId, name: "Test", gender: "MALE", email: "test@example.com", phone: "0123456789" };
            mockPrismaEventRegistrationCreate.mockResolvedValue({});
            mockPrismaEventRegistrationFindUnique.mockResolvedValue(null);
            mockPrismaAttendeeFindUnique.mockResolvedValue(attendeeData);

            // Act
            await eventRegistrationService.register(eventId, attendeeData);

            // Assert
            expect(mockPrismaEventRegistrationCreate).toHaveBeenCalledTimes(1);
            expect(mockPrismaEventRegistrationCreate).toHaveBeenCalledWith({
                data: {
                    eventId: eventId,
                    attendeeId: attendeeId,
                },
            });
        });

        it("should throw an error if attendee is already registered", async () => {
            // Arrange
            const eventId = 1;
            const attendeeId = 2;
            const attendeeData: AttendeeEntity = { id: attendeeId, name: "Test", gender: "MALE", email: "test@example.com", phone: "0123456789" };
            mockPrismaEventRegistrationFindUnique.mockResolvedValue({});

            // Act and Assert
            await expect(eventRegistrationService.register(eventId, attendeeData)).rejects.toThrow("Attendee is already registered for this event");
        });
    });

    describe("getEventAttendeeCounts", () => {
        it("should return event attendee counts", async () => {
            // Arrange
            mockPrismaEventRegistrationGroupBy.mockResolvedValue([
                { eventId: 1, _count: { eventId: 10 } },
                { eventId: 2, _count: { eventId: 5 } },
            ]);

            // Act
            const result = await eventRegistrationService.getEventAttendeeCounts();

            // Assert
            expect(mockPrismaEventRegistrationGroupBy).toHaveBeenCalledWith({
                by: ["eventId"],
                _count: {
                    eventId: true,
                },
            });
            expect(result).toEqual({ 1: 10, 2: 5 });
        });
    });
});
