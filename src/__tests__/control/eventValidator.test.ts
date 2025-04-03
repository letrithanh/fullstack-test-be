import EventValidator from "../../control/eventValidator";

describe("EventValidator", () => {
    let eventValidator: EventValidator;

    beforeEach(() => {
        eventValidator = new EventValidator();
    });

    describe("isTitleValid", () => {
        it("should return true if title is valid", () => {
            expect(eventValidator.isTitleValid("Valid Title")).toBe(true);
            expect(eventValidator.isTitleValid("Short title")).toBe(true);
            expect(eventValidator.isTitleValid("a".repeat(100))).toBe(true);
        });

        it("should return false if title is missing", () => {
            expect(eventValidator.isTitleValid("")).toBe(false);
        });

        it("should return false if title is not a string", () => {
            // @ts-expect-error
            expect(eventValidator.isTitleValid(123)).toBe(false);
            // @ts-expect-error
            expect(eventValidator.isTitleValid(true)).toBe(false);
            // @ts-expect-error
            expect(eventValidator.isTitleValid({})).toBe(false);
            // @ts-expect-error
            expect(eventValidator.isTitleValid([])).toBe(false);
        });

        it("should return false if title exceeds max length", () => {
            const longTitle = "a".repeat(101);
            expect(eventValidator.isTitleValid(longTitle)).toBe(false);
        });
    });

    describe("isDescriptionValid", () => {
        it("should return true if description is valid", () => {
            expect(eventValidator.isDescriptionValid("Valid description")).toBe(true);
            expect(eventValidator.isDescriptionValid("Short description")).toBe(true);
            expect(eventValidator.isDescriptionValid("a".repeat(500))).toBe(true);
        });

        it("should return false if description is missing", () => {
            expect(eventValidator.isDescriptionValid("")).toBe(false);
        });

        it("should return false if description is not a string", () => {
            // @ts-expect-error
            expect(eventValidator.isDescriptionValid(123)).toBe(false);
            // @ts-expect-error
            expect(eventValidator.isDescriptionValid(true)).toBe(false);
            // @ts-expect-error
            expect(eventValidator.isDescriptionValid({})).toBe(false);
            // @ts-expect-error
            expect(eventValidator.isDescriptionValid([])).toBe(false);
        });

        it("should return false if description exceeds max length", () => {
            const longDescription = "a".repeat(501);
            expect(eventValidator.isDescriptionValid(longDescription)).toBe(false);
        });
    });

    describe("isDateValid", () => {
        it("should return true if date is today", () => {
            const today = new Date();
            expect(eventValidator.isDateValid(today)).toBe(true);
        });

        it("should return true if date is in the future", () => {
            const futureDate = new Date();
            futureDate.setDate(futureDate.getDate() + 1); // Tomorrow
            expect(eventValidator.isDateValid(futureDate)).toBe(true);
        });

        it("should return false if date is in the past", () => {
            const pastDate = new Date();
            pastDate.setDate(pastDate.getDate() - 1); // Yesterday
            expect(eventValidator.isDateValid(pastDate)).toBe(false);
        });

        it("should return false if date is missing", () => {
            // @ts-expect-error
            expect(eventValidator.isDateValid(null)).toBe(false);
            // @ts-expect-error
            expect(eventValidator.isDateValid(undefined)).toBe(false);
        });

        it("should return true for today even if time is earlier", () => {
            const todayEarly = new Date();
            todayEarly.setHours(0, 0, 1, 0); // Set time to early morning
            expect(eventValidator.isDateValid(todayEarly)).toBe(true);
        });

        it("should return true for today even if time is later", () => {
            const todayLate = new Date();
            todayLate.setHours(23, 59, 59, 0); // Set time to late evening
            expect(eventValidator.isDateValid(todayLate)).toBe(true);
        });
    });

    describe("isLocationValid", () => {
        it("should return true if location is valid", () => {
            expect(eventValidator.isLocationValid("Valid Location")).toBe(true);
            expect(eventValidator.isLocationValid("Short location")).toBe(true);
            const maxLengthLocation = "a".repeat(200);
            expect(eventValidator.isLocationValid(maxLengthLocation)).toBe(true);
        });

        it("should return false if location is missing", () => {
            expect(eventValidator.isLocationValid("")).toBe(false);
            // @ts-expect-error
            expect(eventValidator.isLocationValid(null)).toBe(false);
            // @ts-expect-error
            expect(eventValidator.isLocationValid(undefined)).toBe(false);
        });

        it("should return false if location is not a string", () => {
            // @ts-expect-error
            expect(eventValidator.isLocationValid(123)).toBe(false);
            // @ts-expect-error
            expect(eventValidator.isLocationValid(true)).toBe(false);
            // @ts-expect-error
            expect(eventValidator.isLocationValid({})).toBe(false);
            // @ts-expect-error
            expect(eventValidator.isLocationValid([])).toBe(false);
        });

        it("should return false if location exceeds max length", () => {
            const longLocation = "a".repeat(201);
            expect(eventValidator.isLocationValid(longLocation)).toBe(false);
        });
    });

    describe("isMaxAttendeesValid", () => {
        it("should return true if maxAttendees is valid", () => {
            expect(eventValidator.isMaxAttendeesValid(1)).toBe(true);
            expect(eventValidator.isMaxAttendeesValid(50)).toBe(true);
            expect(eventValidator.isMaxAttendeesValid(100)).toBe(true);
        });

        it("should return false if maxAttendees is missing", () => {
            // @ts-expect-error
            expect(eventValidator.isMaxAttendeesValid(null)).toBe(false);
            // @ts-expect-error
            expect(eventValidator.isMaxAttendeesValid(undefined)).toBe(false);
        });

        it("should return false if maxAttendees is not a number", () => {
            // @ts-expect-error
            expect(eventValidator.isMaxAttendeesValid("5")).toBe(false);
            // @ts-expect-error
            expect(eventValidator.isMaxAttendeesValid(true)).toBe(false);
            // @ts-expect-error
            expect(eventValidator.isMaxAttendeesValid({})).toBe(false);
            // @ts-expect-error
            expect(eventValidator.isMaxAttendeesValid([])).toBe(false);
        });

        it("should return false if maxAttendees is not an integer", () => {
            expect(eventValidator.isMaxAttendeesValid(10.5)).toBe(false);
        });

        it("should return false if maxAttendees is zero or less", () => {
            expect(eventValidator.isMaxAttendeesValid(0)).toBe(false);
            expect(eventValidator.isMaxAttendeesValid(-1)).toBe(false);
            expect(eventValidator.isMaxAttendeesValid(-100)).toBe(false);
        });

        it("should return false if maxAttendees exceeds the limit", () => {
            expect(eventValidator.isMaxAttendeesValid(101)).toBe(false);
            expect(eventValidator.isMaxAttendeesValid(1000)).toBe(false);
        });
    });

    describe("isEventValid", () => {
        let validEvent: any;

        beforeEach(() => {
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            validEvent = {
                title: "Valid Event Title",
                description: "Valid event description.",
                date: tomorrow,
                location: "Valid Location",
                maxAttendees: 50
            };
        });

        it("should return true for a completely valid event", () => {
            expect(eventValidator.isEventValid(validEvent)).toBe(true);
        });

        it("should return false if the event object is missing", () => {
             // @ts-expect-error
            expect(eventValidator.isEventValid(null)).toBe(false);
             // @ts-expect-error
            expect(eventValidator.isEventValid(undefined)).toBe(false);
        });

        it("should return false if title is invalid", () => {
            const invalidEvent = { ...validEvent, title: "" };
            expect(eventValidator.isEventValid(invalidEvent)).toBe(false);
        });

        it("should return false if description is invalid", () => {
            const invalidEvent = { ...validEvent, description: "a".repeat(501) };
            expect(eventValidator.isEventValid(invalidEvent)).toBe(false);
        });

        it("should return false if date is invalid", () => {
            const pastDate = new Date();
            pastDate.setDate(pastDate.getDate() - 1);
            const invalidEvent = { ...validEvent, date: pastDate };
            expect(eventValidator.isEventValid(invalidEvent)).toBe(false);
        });

        it("should return false if location is invalid", () => {
            const invalidEvent = { ...validEvent, location: "a".repeat(201) };
            expect(eventValidator.isEventValid(invalidEvent)).toBe(false);
        });

        it("should return false if maxAttendees is invalid (zero)", () => {
            const invalidEvent = { ...validEvent, maxAttendees: 0 };
            expect(eventValidator.isEventValid(invalidEvent)).toBe(false);
        });

         it("should return false if maxAttendees is invalid (too high)", () => {
            const invalidEvent = { ...validEvent, maxAttendees: 101 };
            expect(eventValidator.isEventValid(invalidEvent)).toBe(false);
        });

        it("should return false if multiple fields are invalid", () => {
            const pastDate = new Date();
            pastDate.setDate(pastDate.getDate() - 1);
            const invalidEvent = { 
                title: "", 
                description: "Valid", 
                date: pastDate, 
                location: "Valid", 
                maxAttendees: 50 
            };
            expect(eventValidator.isEventValid(invalidEvent)).toBe(false);
        });
    });
});
