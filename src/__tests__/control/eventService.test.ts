import EventService from "../../control/eventService";
import PRISMA from "../../utils/prisma.client";
import EventEntity from "../../entity/event/eventEntity";

// Mock only the Prisma client
jest.mock('../../utils/prisma.client', () => ({
    event: {
        create: jest.fn(),
        findMany: jest.fn(),
    },
}));

describe("EventService", () => {
    let eventService: EventService;
    let mockPrismaEventCreate: jest.Mock;

    beforeEach(() => {
        // Reset mocks before each test
        jest.clearAllMocks();

        // Create a new instance of EventService for each test
        // This will internally create a REAL EventValidator instance
        eventService = new EventService();

        // Get the mocked Prisma create function
        mockPrismaEventCreate = PRISMA.event.create as jest.Mock;
    });

    describe("createEvent", () => {
        let validEventData: EventEntity;
        let invalidEventData: EventEntity;
        let createdEvent: EventEntity;

        beforeEach(() => {
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);

            validEventData = {
                title: "Valid Test Event",
                description: "This is a valid description.",
                date: tomorrow, // Future date
                location: "Test Location",
                maxAttendees: 50,
            };

            invalidEventData = {
                title: "", // Invalid title
                description: "This is a valid description.",
                date: yesterday, // Invalid date (past)
                location: "Test Location",
                maxAttendees: 0, // Invalid number
            };

            createdEvent = { ...validEventData, id: 1, createdAt: new Date(), updatedAt: new Date() };
        });

        it("should throw an error if the event data is invalid according to the real EventValidator", async () => {
            // Act & Assert
            // Using invalidEventData which should fail validation by the real EventValidator
            await expect(eventService.createEvent(invalidEventData)).rejects.toThrow("Invalid event data provided.");
            expect(mockPrismaEventCreate).not.toHaveBeenCalled(); // Ensure Prisma create was not called
        });
        
        it("should NOT throw an error if the event data is valid according to the real EventValidator", async () => {
            // Arrange
            mockPrismaEventCreate.mockResolvedValue(createdEvent); // Mock successful creation

            // Act & Assert
            // Using validEventData which should pass validation by the real EventValidator
            await expect(eventService.createEvent(validEventData)).resolves.not.toThrow();
        });

        it("should call PRISMA.event.create with the data if validation passes", async () => {
            // Arrange
            mockPrismaEventCreate.mockResolvedValue(createdEvent); // Mock successful creation

            // Act
            await eventService.createEvent(validEventData); // Use valid data

            // Assert
            expect(mockPrismaEventCreate).toHaveBeenCalledTimes(1);
            expect(mockPrismaEventCreate).toHaveBeenCalledWith({ data: validEventData });
        });

        it("should return the created event data if validation passes", async () => {
            // Arrange
            mockPrismaEventCreate.mockResolvedValue(createdEvent); // Mock successful creation

            // Act
            const result = await eventService.createEvent(validEventData); // Use valid data

            // Assert
            expect(result).toEqual(createdEvent);
        });
    });

    describe("getEvents", () => {
        it("should call PRISMA.event.findMany with the correct where clause when a title is provided", async () => {
            const mockPrismaEventFindMany = PRISMA.event.findMany as jest.Mock;
            mockPrismaEventFindMany.mockResolvedValue([]);

            const title = "Test";
            await eventService.getEvents({ title });

            expect(mockPrismaEventFindMany).toHaveBeenCalledWith({ where: { title: { contains: title } } });
        });

        it("should call PRISMA.event.findMany with an empty where clause when no title is provided", async () => {
            const mockPrismaEventFindMany = PRISMA.event.findMany as jest.Mock;
            mockPrismaEventFindMany.mockResolvedValue([]);

            await eventService.getEvents({});

            expect(mockPrismaEventFindMany).toHaveBeenCalledWith({ where: {} });
        });

        it("should return the events returned by PRISMA.event.findMany", async () => {
            const mockPrismaEventFindMany = PRISMA.event.findMany as jest.Mock;
            const events = [{ id: 1, title: "Test Event" }] as any;
            mockPrismaEventFindMany.mockResolvedValue(events);

            const result = await eventService.getEvents({});

            expect(result).toEqual(events);
        });
    });
});
