import AttendeeService from "../../../control/attendee/attendeeService";
import AttendeeEntity from "../../../entity/attendee/attendeeEntity";
import PRISMA from "../../../utils/prisma.client";

// Mock the Prisma client
jest.mock('../../../utils/prisma.client', () => ({
    attendee: {
        create: jest.fn(),
        findUnique: jest.fn(),
    },
}));

describe("AttendeeService", () => {
    let attendeeService: AttendeeService;
    let mockPrismaAttendeeCreate: jest.Mock;

    beforeEach(() => {
        jest.clearAllMocks();
        attendeeService = new AttendeeService();
        mockPrismaAttendeeCreate = PRISMA.attendee.create as jest.Mock;
    });

    describe("createAttendee", () => {
        it("should call PRISMA.attendee.create with the correct parameters if the attendee data is valid", async () => {
            // Arrange
            const validAttendeeData: AttendeeEntity = {
                name: "Valid Name",
                gender: "MALE",
                email: "email@example.com",
                phone: "0123456789",
            };
            mockPrismaAttendeeCreate.mockResolvedValue(validAttendeeData);

            // Act
            await attendeeService.createAttendee(validAttendeeData);

            // Assert
            expect(mockPrismaAttendeeCreate).toHaveBeenCalledTimes(1);
            expect(mockPrismaAttendeeCreate).toHaveBeenCalledWith({ data: validAttendeeData });
        });

        it("should throw an error if the attendee data is invalid", async () => {
            // Arrange
            const invalidAttendeeData: AttendeeEntity = {
                name: "", // Invalid name
                gender: "MALE",
                email: "email@example.com",
                phone: "0123456789",
            };

            // Act & Assert
            await expect(attendeeService.createAttendee(invalidAttendeeData)).rejects.toThrow("Invalid attendee data");
            expect(mockPrismaAttendeeCreate).not.toHaveBeenCalled();
        });

        it("should return the created attendee if the attendee data is valid", async () => {
            // Arrange
            const validAttendeeData: AttendeeEntity = {
                name: "Valid Name",
                gender: "MALE",
                email: "email@example.com",
                phone: "0123456789",
            };
            mockPrismaAttendeeCreate.mockResolvedValue(validAttendeeData);

            // Act
            const result = await attendeeService.createAttendee(validAttendeeData);

            // Assert
            expect(result).toEqual(validAttendeeData);
        });
    });

    describe("getAttendeeByEmail", () => {
        it("should call PRISMA.attendee.findUnique with the correct parameters if the email is valid", async () => {
            // Arrange
            const email = "email@example.com";
            const mockPrismaAttendeeFindUnique = PRISMA.attendee.findUnique as jest.Mock;
            mockPrismaAttendeeFindUnique.mockResolvedValue({ email: email });

            // Act
            await attendeeService.getAttendeeByEmail(email);

            // Assert
            expect(mockPrismaAttendeeFindUnique).toHaveBeenCalledTimes(1);
            expect(mockPrismaAttendeeFindUnique).toHaveBeenCalledWith({ where: { email: email } });
        });

        it("should throw an error if the email is missing", async () => {
            // Arrange
            const email = "";

            // Act & Assert
            await expect(attendeeService.getAttendeeByEmail(email)).rejects.toThrow("Email must be provided");
        });

        it("should return the attendee if the email is valid", async () => {
            // Arrange
            const email = "email@example.com";
            const mockPrismaAttendeeFindUnique = PRISMA.attendee.findUnique as jest.Mock;
            const attendee = { name: "Valid Name", gender: "MALE", email: email, phone: "0123456789" };
            mockPrismaAttendeeFindUnique.mockResolvedValue(attendee);

            // Act
            const result = await attendeeService.getAttendeeByEmail(email);

            // Assert
            expect(result).toEqual(attendee);
        });

        it("should return null if the attendee is not found", async () => {
            // Arrange
            const email = "email@example.com";
            const mockPrismaAttendeeFindUnique = PRISMA.attendee.findUnique as jest.Mock;
            mockPrismaAttendeeFindUnique.mockResolvedValue(null);

            // Act
            const result = await attendeeService.getAttendeeByEmail(email);

            // Assert
            expect(result).toBeNull();
        });
    });
});
