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
    let mockPrismaAttendeeFindUnique: jest.Mock;

    beforeEach(() => {
        jest.clearAllMocks();
        attendeeService = new AttendeeService();
        mockPrismaAttendeeCreate = PRISMA.attendee.create as jest.Mock;
        mockPrismaAttendeeFindUnique = PRISMA.attendee.findUnique as jest.Mock;
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

    describe("getAttendeeByPhone", () => {
        it("should call PRISMA.attendee.findUnique with the correct parameters if the phone number is valid", async () => {
            // Arrange
            const phone = "0123456789";
            const attendee = { name: "Valid Name", gender: "MALE", email: "email@example.com", phone: phone };
            mockPrismaAttendeeFindUnique.mockResolvedValue(attendee);

            // Act
            await attendeeService.getAttendeeByPhone(phone);

            // Assert
            expect(mockPrismaAttendeeFindUnique).toHaveBeenCalledTimes(1);
            expect(mockPrismaAttendeeFindUnique).toHaveBeenCalledWith({ where: { phone: phone } });
        });

        it("should throw an error if the phone number is missing", async () => {
            // Arrange
            const phone = "";

            // Act & Assert
            await expect(attendeeService.getAttendeeByPhone(phone)).rejects.toThrow("Phone number must be provided");
            expect(mockPrismaAttendeeFindUnique).not.toHaveBeenCalled();
        });

        it("should return the attendee if the phone number is valid and attendee exists", async () => {
            // Arrange
            const phone = "0123456789";
            const attendee = { name: "Valid Name", gender: "MALE", email: "email@example.com", phone: phone };
            mockPrismaAttendeeFindUnique.mockResolvedValue(attendee);

            // Act
            const result = await attendeeService.getAttendeeByPhone(phone);

            // Assert
            expect(result).toEqual(attendee);
        });

        it("should return null if the attendee is not found", async () => {
            // Arrange
            const phone = "0987654321";
            mockPrismaAttendeeFindUnique.mockResolvedValue(null);

            // Act
            const result = await attendeeService.getAttendeeByPhone(phone);

            // Assert
            expect(result).toBeNull();
        });
    });
});
