import { Connection, Model, Schema } from 'mongoose';
import { v4 } from "uuid";
import { MediaInterface } from './interfaces.media';

export const MediaSchema = new Schema<MediaInterface>(
    {
        _id: { type: String, default: () => v4() },
        aws_id: { type: String },
        url: { type: String },
        file_type: { type: String },
    },
    {
        collection: 'media',
        timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' }
    }
)
export { MediaInterface }
export default function calendarFactory(conn: Connection): Model<MediaInterface> {
    return conn.model<MediaInterface>('Media', MediaSchema);
}
