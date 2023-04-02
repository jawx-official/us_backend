import { OtpInterface, OtpRoleEnums } from '@modules/auth/interfaces.auth';
import { Connection, Model, Schema } from 'mongoose';
import { v4 } from "uuid";

export const OtpSchema = new Schema<OtpInterface>(
    {
        _id: { type: String, default: () => v4() },
        code: {
            required: true,
            type: Schema.Types.String
        },
        account: {
            type: Schema.Types.String,
            required: true,
            ref: "User"
        },
        action: {
            type: String,
            required: true,
            enum: Object.values(OtpRoleEnums)
        },
        expiryDate: {
            type: Date,
        }

    },
    {
        collection: 'otps',
        timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' }
    }
)
export { OtpInterface }
export default function otpFactory(conn: Connection): Model<OtpInterface> {
    return conn.model<OtpInterface>('Otp', OtpSchema);
}
