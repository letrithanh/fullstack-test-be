import AttendeeValidator from "../../../control/attendee/attendeeValidator";

describe("AttendeeValidator", () => {
    let attendeeValidator: AttendeeValidator;

    beforeEach(() => {
        attendeeValidator = new AttendeeValidator();
    });

    describe("isNameValid", () => {
        it("should return false if the name is missing", () => {
            const name = "";
            const result = attendeeValidator.isNameValid(name);
            expect(result).toBe(false);
        });

        it("should return false if the name exceeds the maximum length", () => {
            const name = "a".repeat(21);
            const result = attendeeValidator.isNameValid(name);
            expect(result).toBe(false);
        });

        it("should return true if the name is valid", () => {
            const name = "a".repeat(20);
            const result = attendeeValidator.isNameValid(name);
            expect(result).toBe(true);
        });
    });
    
    describe("isGenderValid", () => {
        it("should return true if the gender is MALE", () => {
            const gender = "MALE";
            const result = attendeeValidator.isGenderValid(gender);
            expect(result).toBe(true);
        });

        it("should return true if the gender is FEMALE", () => {
            const gender = "FEMALE";
            const result = attendeeValidator.isGenderValid(gender);
            expect(result).toBe(true);
        });

        it("should return false if the gender is not MALE or FEMALE", () => {
            const gender = "OTHER";
            const result = attendeeValidator.isGenderValid(gender);
            expect(result).toBe(false);
        });

        it("should return false if the gender is null", () => {
            const gender = null as any;
            const result = attendeeValidator.isGenderValid(gender);
            expect(result).toBe(false);
        });

        it("should return false if the gender is undefined", () => {
            const gender = undefined as any;
            const result = attendeeValidator.isGenderValid(gender);
            expect(result).toBe(false);
        });

        it("should return false if the gender is empty", () => {
            const gender = "";
            const result = attendeeValidator.isGenderValid(gender);
            expect(result).toBe(false);
        });
    });

    describe("isEmailValid", () => {
        it("should return false for invalid email formats", () => {
            const invalidEmails = [
                "",
                "plainaddress",
                "#@%^%#$@#$@#.com",
                "@example.com",
                "Joe Smith <email@example.com>",
                "email.example.com",
                "email@example@example.com",
                "email@example.com (Joe Smith)",
                "email@example",
            ];

            invalidEmails.forEach(email => {
                const result = attendeeValidator.isEmailValid(email);
                expect(result).toBe(false);
            });
        });

        it("should return true for a valid email format", () => {
            const email = "email@example.com";
            const result = attendeeValidator.isEmailValid(email);
            expect(result).toBe(true);
        });

         it("should return false if the email is null", () => {
            const email = null as any;
            const result = attendeeValidator.isEmailValid(email);
            expect(result).toBe(false);
        });

        it("should return false if the email is undefined", () => {
            const email = undefined as any;
            const result = attendeeValidator.isEmailValid(email);
            expect(result).toBe(false);
        });

        it("should return false if the email is empty", () => {
            const email = "";
            const result = attendeeValidator.isEmailValid(email);
            expect(result).toBe(false);
        });
    });

    describe("isPhoneValid", () => {
        it("should return true for valid phone number formats", () => {
            const validPhones = [
                "0123456789",
            ];

            validPhones.forEach(phone => {
                const result = attendeeValidator.isPhoneValid(phone);
                expect(result).toBe(true);
            });
        });

        it("should return false for invalid phone number formats", () => {
            const invalidPhones = [
                "",
                "abc",
                "123",
                "123456789",
                "12345678901",
                "+11234567890",
                "123-456-7890",
            ];

            invalidPhones.forEach(phone => {
                const result = attendeeValidator.isPhoneValid(phone);
                expect(result).toBe(false);
            });
        });

        it("should return false if the phone is null", () => {
            const phone = null as any;
            const result = attendeeValidator.isPhoneValid(phone);
            expect(result).toBe(false);
        });

        it("should return false if the phone is undefined", () => {
            const phone = undefined as any;
            const result = attendeeValidator.isPhoneValid(phone);
            expect(result).toBe(false);
        });

        it("should return false if the phone is empty", () => {
            const phone = "";
            const result = attendeeValidator.isPhoneValid(phone);
            expect(result).toBe(false);
        });
    });

    describe("isAttendeeValid", () => {
        it("should return false if the attendee is null", () => {
            const attendee = null as any;
            const result = attendeeValidator.isAttendeeValid(attendee);
            expect(result).toBe(false);
        });

        it("should return false if the attendee's name is invalid", () => {
            const attendee = { name: "", gender: "MALE", email: "email@example.com", phone: "0123456789" } as any;
            const result = attendeeValidator.isAttendeeValid(attendee);
            expect(result).toBe(false);
        });

        it("should return false if the attendee's gender is invalid", () => {
            const attendee = { name: "Valid Name", gender: "OTHER", email: "email@example.com", phone: "0123456789" } as any;
            const result = attendeeValidator.isAttendeeValid(attendee);
            expect(result).toBe(false);
        });

        it("should return false if the attendee's email is invalid", () => {
            const attendee = { name: "Valid Name", gender: "MALE", email: "invalid-email", phone: "0123456789" } as any;
            const result = attendeeValidator.isAttendeeValid(attendee);
            expect(result).toBe(false);
        });

        it("should return false if the attendee's phone is invalid", () => {
            const attendee = { name: "Valid Name", gender: "MALE", email: "email@example.com", phone: "123" } as any;
            const result = attendeeValidator.isAttendeeValid(attendee);
            expect(result).toBe(false);
        });

        it("should return true if the attendee is valid", () => {
            const attendee = { name: "Valid Name", gender: "MALE", email: "email@example.com", phone: "0123456789" } as any;
            const result = attendeeValidator.isAttendeeValid(attendee);
            expect(result).toBe(true);
        });
    });
});
