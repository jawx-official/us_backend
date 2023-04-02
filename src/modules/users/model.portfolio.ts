import { Connection, Model, Schema } from 'mongoose';
import { v4 } from "uuid";
import { PortfolioInterface } from './interfaces.portfolio';

export const PoertfolioSchema = new Schema<PortfolioInterface>(
    {
        _id: { type: String, default: () => v4() },
        account: { type: String, ref: "User" },
        gallery: { type: [String], ref: 'Media' },
        embeddedMedia: { type: [String] },
    },
    {
        collection: 'portfolio',
        timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' }
    }
)
export { PortfolioInterface }
export default function portfolioFactory(conn: Connection): Model<PortfolioInterface> {
    return conn.model<PortfolioInterface>('Portfolio', PoertfolioSchema);
}
