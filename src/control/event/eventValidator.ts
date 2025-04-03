import EventEntity from "../../entity/event/eventEntity";

export default class EventValidator {

    public isTitleValid(title: string): boolean {
        const titleIsMissing = !title;
        const titleIsNotString = typeof title !== 'string';
        const titleExceedsMaxLength = title.length > 100;

        return !(titleIsMissing || titleIsNotString || titleExceedsMaxLength);
    }

    public isDescriptionValid(description: string): boolean {
        const descriptionIsMissing = !description;
        const descriptionIsNotString = typeof description !== 'string';
        const descriptionExceedsMaxLength = description.length > 500;

        return !(descriptionIsMissing || descriptionIsNotString || descriptionExceedsMaxLength);
    }

    public isDateValid(date: Date): boolean {
        const dateIsMissing = !date;
        if (dateIsMissing) {
            return false;
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0); 

        const inputDate = new Date(date);
        inputDate.setHours(0, 0, 0, 0);

        const isDateInThePast = inputDate < today;
        
        return !isDateInThePast;
    }

    public isLocationValid(location: string): boolean {
        const locationIsMissing = !location;
        const locationIsNotString = typeof location !== 'string';
        const locationExceedsMaxLength = location?.length > 200;

        return !(locationIsMissing || locationIsNotString || locationExceedsMaxLength);
    }

    public isMaxAttendeesValid(maxAttendees: number): boolean {
        const isMissing = maxAttendees == null;
        if (isMissing) {
            return false;
        }

        const isNotNumber = typeof maxAttendees !== 'number';
        const isNotInteger = !Number.isInteger(maxAttendees);
        const isZeroOrLess = maxAttendees <= 0;
        const exceedsLimit = maxAttendees > 100;

        return !(isNotNumber || isNotInteger || isZeroOrLess || exceedsLimit);
    }

    public isEventValid(event: EventEntity): boolean {
        const eventIsMissing = event == null;
        if (eventIsMissing) {
            return false;
        }

        const titleIsValid = this.isTitleValid(event.title);
        const descriptionIsValid = this.isDescriptionValid(event.description);
        const dateIsValid = this.isDateValid(event.date);
        const locationIsValid = this.isLocationValid(event.location);
        const maxAttendeesIsValid = this.isMaxAttendeesValid(event.maxAttendees);

        return titleIsValid && descriptionIsValid && dateIsValid && locationIsValid && maxAttendeesIsValid;
    }
}
