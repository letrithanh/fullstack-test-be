import AttendeeEntity from "../../entity/attendee/attendeeEntity";

export default class AttendeeValidator {
    public isNameValid(name: string): boolean {
        const isNameMissing = !name;
        const isNameExceedMaxLength = name?.length > 20;

        if (isNameMissing || isNameExceedMaxLength) {
            return false;
        }

        return true;
    }

    public isGenderValid(gender: string): boolean {
        return gender === "MALE" || gender === "FEMALE";
    }

    public isEmailValid(email: string): boolean {
      const isEmailMissing = !email;
      if (isEmailMissing) {
        return false;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
      const isEmailFormatValid = emailRegex.test(email);

      return isEmailFormatValid;
    }

    public isPhoneValid(phone: string): boolean {
        const isPhoneMissing = !phone;
        if (isPhoneMissing) {
            return false;
        }

        const phoneRegex = /^0\d{9}$/;
        const isPhoneFormatValid = phoneRegex.test(phone);

        return isPhoneFormatValid;
    }

    public isAttendeeValid(attendee: AttendeeEntity): boolean {
        const isAttendeeMissing = !attendee;
        if (isAttendeeMissing) {
            return false;
        }

        return (
            this.isNameValid(attendee.name) &&
            this.isGenderValid(attendee.gender) &&
            this.isEmailValid(attendee.email) &&
            this.isPhoneValid(attendee.phone)
        );
    }
}
