import AttendeeEntity from "../../entity/attendee/attendeeEntity";
import AttendeeValidator from "./attendeeValidator";
import PRISMA from "../../utils/prisma.client";

export default class AttendeeService {
    private attendeeValidator: AttendeeValidator;

    constructor() {
        this.attendeeValidator = new AttendeeValidator();
    }

    public async createAttendee(attendeeData: AttendeeEntity): Promise<AttendeeEntity> {
        if (!this.attendeeValidator.isAttendeeValid(attendeeData)) {
            throw new Error("Invalid attendee data");
        }

        return await PRISMA.attendee.create({ data: attendeeData });
    }

    public async getAttendeeByEmail(email: string): Promise<AttendeeEntity | null> {
        const isEmailMissing = !email;
        if (isEmailMissing) {
            throw new Error("Email must be provided");
        }

        return await PRISMA.attendee.findUnique({
            where: {
                email: email,
            },
        });
    }
}
