import { AccountStatusEnums, AccountTypeEnums, ApplicationReview, ReviewTypeEnums, UserInterface } from '@modules/users/interfaces.users';
import { Connection, Model, Schema } from 'mongoose';
import { v4 } from "uuid";

const Review = new Schema<ApplicationReview>(
    {
        comment: {
            type: String,
        },
        lastReviewed: {
            type: String,
            enum: Object.values(AccountTypeEnums),
        },
        reviewType: {
            type: String,
            enum: Object.values(ReviewTypeEnums)
        }
    },
    {
        _id: false
    }
)

export const UserSchema = new Schema<UserInterface>(
    {
        _id: { type: String, default: () => v4() },
        name: {
            type: Schema.Types.String
        },
        bio: {
            type: Schema.Types.String
        },
        genres: {
            type: [Schema.Types.String]
        },
        email: {
            type: Schema.Types.String,
            lowercase: true,
            required: true
        },
        password: {
            type: Schema.Types.String,
            required: true
        },
        review: {
            type: Review
        },
        accountStatus: {
            type: String,
            enum: Object.values(AccountStatusEnums),
            default: AccountStatusEnums.PENDING
        },
        setupComplete: {
            type: Schema.Types.Boolean,
            default: false
        },
        accountType: {
            type: String,
            enum: Object.values(AccountTypeEnums),
            default: AccountTypeEnums.ARTIST
        },
        country: {
            type: Schema.Types.String
        },
        confirmed: {
            type: Schema.Types.Boolean,
            default: false
        },
        deleted: {
            type: Schema.Types.Boolean,
            default: false
        },
        online: {
            type: Schema.Types.Boolean,
            default: false
        },
        avatar: {
            type: String,
            default: ''
        },
    },
    {
        collection: 'users',
        timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' }
    }
)

export { UserInterface }
export default function userFactory(conn: Connection): Model<UserInterface> {
    return conn.model<UserInterface>('User', UserSchema);
}
