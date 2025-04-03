import EventService from "../../../control/event/eventService";
import PRISMA from "../../../utils/prisma.client";
import EventEntity from "../../../entity/event/eventEntity";

// Mock only the Prisma client
jest.mock('../../../utils/prisma.client', () => ({
    event: {
        create: jest.fn(),
        findMany: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
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

    describe("getEventById", () => {
        it("should call PRISMA.event.findUnique with the correct id", async () => {
            const mockPrismaEventFindUnique = PRISMA.event.findUnique as jest.Mock;
            mockPrismaEventFindUnique.mockResolvedValue({});

            const id = 1;
            await eventService.getEventById(id);

            expect(mockPrismaEventFindUnique).toHaveBeenCalledWith({ where: { id: id } });
        });

        it("should throw an error if the id is not a number", async () => {
            const mockPrismaEventFindUnique = PRISMA.event.findUnique as jest.Mock;
            mockPrismaEventFindUnique.mockResolvedValue({});

            // @ts-expect-error
            await expect(eventService.getEventById("test")).rejects.toThrow("Invalid event ID provided.");
        });

        it("should return the event returned by PRISMA.event.findUnique", async () => {
            const mockPrismaEventFindUnique = PRISMA.event.findUnique as jest.Mock;
            const event = { id: 1, title: "Test Event" } as any;
            mockPrismaEventFindUnique.mockResolvedValue(event);

            const result = await eventService.getEventById(1);

            expect(result).toEqual(event);
        });
    });

    describe("deleteEventById", () => {
        it("should call PRISMA.event.update with the correct parameters", async () => {
            const mockPrismaEventFindUnique = PRISMA.event.findUnique as jest.Mock;
            mockPrismaEventFindUnique.mockResolvedValue({ id: 1, title: "Test Event" });
            const mockPrismaEventUpdate = PRISMA.event.update as jest.Mock;
            mockPrismaEventUpdate.mockResolvedValue({ id: 1, deleted: true });

            const id = 1;
            await eventService.deleteEventById(id);

            expect(mockPrismaEventUpdate).toHaveBeenCalledWith({
                where: { id: id },
                data: { deleted: true },
            });
        });

        it("should throw an error if the id is not a number", async () => {
            const mockPrismaEventFindUnique = PRISMA.event.findUnique as jest.Mock;
            mockPrismaEventFindUnique.mockResolvedValue({ id: 1, title: "Test Event" });
            const mockPrismaEventUpdate = PRISMA.event.update as jest.Mock;
            mockPrismaEventUpdate.mockResolvedValue({ id: 1, deleted: true });

            // @ts-expect-error
            await expect(eventService.deleteEventById("test")).rejects.toThrow("Invalid event ID provided.");
        });

        it("should throw an error if the event is not found", async () => {
            const mockPrismaEventFindUnique = PRISMA.event.findUnique as jest.Mock;
            mockPrismaEventFindUnique.mockResolvedValue(null);

            const id = 1;
            await expect(eventService.deleteEventById(id)).rejects.toThrow("Event not found.");
        });

        it("should return the updated event", async () => {
            const mockPrismaEventFindUnique = PRISMA.event.findUnique as jest.Mock;
            mockPrismaEventFindUnique.mockResolvedValue({ id: 1, title: "Test Event" });
            const mockPrismaEventUpdate = PRISMA.event.update as jest.Mock;
            mockPrismaEventUpdate.mockResolvedValue({ id: 1, title: "Test Event", deleted: true });

            const id = 1;
            const result = await eventService.deleteEventById(id);

            expect(result).toEqual({ id: 1, title: "Test Event", deleted: true });
        });
    });

    describe("updateEventById", () => {
        it("should call PRISMA.event.update with the correct parameters", async () => {
            const mockPrismaEventFindUnique = PRISMA.event.findUnique as jest.Mock;
            mockPrismaEventFindUnique.mockResolvedValue({ id: 1, title: "Test Event" });
            const mockPrismaEventUpdate = PRISMA.event.update as jest.Mock;
            mockPrismaEventUpdate.mockResolvedValue({ id: 1, title: "Updated Test Event" });

            const id = 1;
            const updatedEventData: EventEntity = { title: "Updated Test Event", description: "This is an updated description.", date: new Date(), location: "Updated Test Location", maxAttendees: 60 };
            await eventService.updateEventById(id, updatedEventData);

            expect(mockPrismaEventUpdate).toHaveBeenCalledWith({
                where: { id: id },
                data: updatedEventData,
            });
        });

        it("should throw an error if the id is not a number", async () => {
            const mockPrismaEventFindUnique = PRISMA.event.findUnique as jest.Mock;
            mockPrismaEventFindUnique.mockResolvedValue({ id: 1, title: "Test Event" });
            const mockPrismaEventUpdate = PRISMA.event.update as jest.Mock;
            mockPrismaEventUpdate.mockResolvedValue({ id: 1, title: "Updated Test Event" });

            const updatedEventData: EventEntity = { title: "Updated Test Event", description: "This is an updated description.", date: new Date(), location: "Updated Test Location", maxAttendees: 60 };

            // @ts-expect-error
            await expect(eventService.updateEventById("test", updatedEventData)).rejects.toThrow("Invalid event ID provided.");
        });

        it("should throw an error if the event is not found", async () => {
            const mockPrismaEventFindUnique = PRISMA.event.findUnique as jest.Mock;
            mockPrismaEventFindUnique.mockResolvedValue(null);
            const mockPrismaEventUpdate = PRISMA.event.update as jest.Mock;
            mockPrismaEventUpdate.mockResolvedValue({ id: 1, title: "Updated Test Event" });

            const id = 1;
            const updatedEventData: EventEntity = { title: "Updated Test Event", description: "This is an updated description.", date: new Date(), location: "Updated Test Location", maxAttendees: 60 };
            await expect(eventService.updateEventById(id, updatedEventData)).rejects.toThrow("Event not found.");
        });

        it("should return the updated event", async () => {
            const mockPrismaEventFindUnique = PRISMA.event.findUnique as jest.Mock;
            mockPrismaEventFindUnique.mockResolvedValue({ id: 1, title: "Test Event" });
            const mockPrismaEventUpdate = PRISMA.event.update as jest.Mock;
            mockPrismaEventUpdate.mockResolvedValue({ id: 1, title: "Updated Test Event", description: "This is an updated description.", date: new Date(), location: "Updated Test Location", maxAttendees: 60 });

            const id = 1;
            const updatedEventData: EventEntity = { title: "Updated Test Event", description: "This is an updated description.", date: new Date(), location: "Updated Test Location", maxAttendees: 60 };
            const result = await eventService.updateEventById(id, updatedEventData);

            expect(result).toEqual({ id: 1, title: "Updated Test Event", description: "This is an updated description.", date: new Date(), location: "Updated Test Location", maxAttendees: 60 });
        });

        it("should throw an error if the event data is invalid", async () => {
            const mockPrismaEventFindUnique = PRISMA.event.findUnique as jest.Mock;
            mockPrismaEventFindUnique.mockResolvedValue({ id: 1, title: "Test Event" });
            const mockPrismaEventUpdate = PRISMA.event.update as jest.Mock;
            mockPrismaEventUpdate.mockResolvedValue({ id: 1, title: "Updated Test Event" });

            const id = 1;
            const invalidEventData: EventEntity = { title: "", description: "This is an updated description.", date: new Date(), location: "Updated Test Location", maxAttendees: 60 };
            await expect(eventService.updateEventById(id, invalidEventData)).rejects.toThrow("Invalid event data provided.");
        });
    });
});
