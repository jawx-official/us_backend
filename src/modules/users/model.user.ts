import { AccountStatusEnums, AccountTypeEnums, Address, ApplicationReview, Certification, IDTypes, Identification, KYCInformation, ReviewTypeEnums, UserInterface } from '@modules/users/interfaces.users';
import { Connection, Model, Schema, SchemaTypes } from 'mongoose';
import { v4 } from "uuid";

const AddressSchema = new Schema<Address>({
    city: {
        type: String
    },
    state: {
        type: String
    },
    location: {
        type: {
            type: String,
            enum: ['Point'],
            default: "Point",
        },
        coordinates: {
            type: [SchemaTypes.Number],
            required: true
        },
        formattedAddress: {
            type: String
        }
    }
}, {
    _id: false, timestamps: false
})

const companyScheam = new Schema({
    name: {
        type: String
    },
    registerationNumber: {
        type: String
    },
    address: {
        type: AddressSchema
    }
}, {
    _id: false, timestamps: false
})

export const reviewSchema = new Schema<ApplicationReview>({
    comment: {
        type: String
    },
    reviewType: {
        type: String,
        enum: Object.values(ReviewTypeEnums)
    },
    lastReviewed: {
        type: String,
        enum: Object.values(AccountTypeEnums)
    }
}, {
    _id: false, timestamps: false
})


const certificationScheam = new Schema<Certification>({
    name: {
        type: String
    },
    file: {
        type: String,
        ref: "Media"
    },
}, {
    _id: false, timestamps: false
})

const identificationSchema = new Schema<Identification>({
    idType: {
        type: String,
        enum: Object.values(IDTypes),
    },
    idNumber: {
        type: String,
    },
    verified: {
        type: Boolean,
        default: false
    }
}, {
    _id: false, timestamps: false
})

const kycSchema = new Schema<Omit<KYCInformation, "address">>({
    proofOfAddress: {
        type: String,
        ref: "Media"
    },
    identification: {
        type: identificationSchema,
    },
    certifications: {
        type: [certificationScheam]
    },
    nationality: {
        type: String
    },
    incomeLevel: {
        type: String
    },
    occupation: {
        type: String
    },
    phoneNumber: {
        type: String
    },
    isCompany: {
        type: Boolean
    },
    companyInformation: {
        type: companyScheam
    },
}, {
    _id: false, timestamps: false
})


export const UserSchema = new Schema<UserInterface>(
    {
        _id: { type: String, default: () => v4() },
        name: {
            type: Schema.Types.String
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
        address: {
            type: AddressSchema
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
            default: AccountTypeEnums.CLIENT
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
            default: '',
            ref: "Media"
        },
        kyc: {
            type: kycSchema
        },
        review: {
            type: reviewSchema
        },
        avatarColor: {
            type: String,
            default: function () {
                var colors = ["#F3E503", "#0F1825", "#23B3E8", "#F15832", "#4DBD98"]
                return colors[Math.floor(Math.random() * colors.length)]
            }
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
