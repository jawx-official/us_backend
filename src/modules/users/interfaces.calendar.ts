import { Model, Schema, Document } from "mongoose";
import { UserInterface } from "./interfaces.users";

export interface AvailableSlots {
    id: string;
    title: string;
    start: Date;
    end: Date;
}

export interface BookedSlots {
    id: string;
    title: string;
    start: Date;
    end: Date;
    partner: string | UserInterface;
}

export interface CalendarInterface extends Document {
    _id: string;
    account: string | UserInterface;
    available: AvailableSlots[];
    booked: BookedSlots[];
    createdAt?: Date;
    updatedAt?: Date;
}


export interface ICalendarDoc extends CalendarInterface {

}