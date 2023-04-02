import { Connection, Model, Schema } from 'mongoose';
import { v4 } from "uuid";
import { ReviewInterface } from './interface.reviews';

export const MediaSchema = new Schema<ReviewInterface>(
    {
        _id: { type: String, default: () => v4() },
        account: { type: String, ref: "User" },
        reviewedBy: { type: String, ref: "User" },
        response_rate: { type: Number, default: 0 },
        professionalism: { type: Number, default: 0 },
        approachability: { type: Number, default: 0 },
        comment: { type: String },
        rating: { type: Number },
    },
    {
        collection: 'reviews',
        timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' }
    }
)
export { ReviewInterface }
export default function calendarFactory(conn: Connection): Model<ReviewInterface> {
    return conn.model<ReviewInterface>('Reviews', MediaSchema);
}
