export default interface EventEntity {
    id?: number;
    title: string;
    description: string;
    date: Date;
    location: string;
    maxAttendees: number;
    createdAt?: Date;
    updatedAt?: Date;
    deleted?: boolean;
}
