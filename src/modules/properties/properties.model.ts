import { Connection, Model, Schema, SchemaTypes } from 'mongoose';
import { v4 } from "uuid";
import { IPricing, Installments, PropertyInterface, PropertyStatusEnums, PurchaseTypeEnum, RentDurationEnum } from './properties.interfaces';
import { reviewSchema } from '../users/model.user';


const Installmental = new Schema<Installments>({
    enabled: {
        type: Boolean,
        default: false
    },
    initial: {
        type: Number,
    },
    monthly: {
        type: Number,
    },
    numberOfMonths: {
        type: Number,
    }
}, { _id: false })

const Sponsored = new Schema({
    transaction: {
        type: Schema.Types.ObjectId,
        ref: "Transactions"
    },
    validTill: {
        type: Date
    },
    enabled: {
        type: Boolean,
        default: false
    }
}, { _id: false })

const Pricing = new Schema<IPricing>({
    installmental: {
        type: Installmental
    },
    totalAmount: {
        type: Number
    },
    currency: {
        type: String
    },
    period: {
        type: String,
        enum: Object.values(RentDurationEnum),
        default: RentDurationEnum.YEARLY
    }
}, { _id: false })


export const PropertySchema = new Schema<PropertyInterface>(
    {
        _id: { type: String, default: () => v4() },
        agent: {
            type: String,
            ref: "User"
        },
        landlord: {
            type: String,
            ref: "User"
        },
        media: {
            type: [String],
            ref: "Media"
        },
        status: {
            type: String,
            enum: Object.values(PropertyStatusEnums),
            default: PropertyStatusEnums.PENDING
        },
        purchaseType: {
            type: String,
            enum: Object.values(PurchaseTypeEnum),
        },
        category: {
            type: String,
        },
        subCategory: {
            type: String,
        },
        description: {
            type: String,
        },
        features: {
            type: [String]
        },
        viewers: {
            type: [String]
        },
        new: {
            type: SchemaTypes.Boolean
        },
        furnished: {
            type: SchemaTypes.Boolean
        },
        serviced: {
            type: SchemaTypes.Boolean
        },
        approved: {
            type: SchemaTypes.Boolean
        },
        toilets: {
            type: SchemaTypes.Number
        },
        bathrooms: {
            type: SchemaTypes.Number
        },
        bedrooms: {
            type: SchemaTypes.Number
        },
        review: {
            type: reviewSchema
        },
        sponsored: {
            type: Sponsored
        },
        pricing: {
            type: Pricing
        }
    },
    {
        collection: 'properties',
        timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' }
    }
)
export { PropertyInterface }
export default function calendarFactory(conn: Connection): Model<PropertyInterface> {
    return conn.model<PropertyInterface>('Property', PropertySchema);
}
