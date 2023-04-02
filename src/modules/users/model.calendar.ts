import { Connection, Model, Schema } from 'mongoose';
import { v4 } from "uuid";
import { AvailableSlots, BookedSlots, CalendarInterface } from './interfaces.calendar';

const BookedSlotSchema = new Schema<BookedSlots>(
    {
        id: {
            type: String
        },
        end: {
            type: Date
        },
        title: {
            type: String
        },
        start: {
            type: Date
        },
        partner: {
            type: String,
            ref: "User"
        }
    },
    {
        id: false, timestamps: false
    }
)


const OpenSlotSchema = new Schema<AvailableSlots>(
    {
        id: {
            type: String
        },
        end: {
            type: Date
        },
        title: {
            type: String
        },
        start: {
            type: Date
        },
    },
    {
        id: false, timestamps: false
    }
)

export const CalendarSchema = new Schema<CalendarInterface>(
    {
        _id: { type: String, default: () => v4() },
        account: {
            type: String,
            ref: "User"
        },
        available: {
            type: [OpenSlotSchema]
        },
        booked: {
            type: [BookedSlotSchema]
        }

    },
    {
        collection: 'calendars',
        timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' }
    }
)
export { CalendarInterface }
export default function calendarFactory(conn: Connection): Model<CalendarInterface> {
    return conn.model<CalendarInterface>('Calendar', CalendarSchema);
}
