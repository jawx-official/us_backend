import { Model } from "mongoose"
import { MediaInterface } from "../media/interfaces.media"
import { ReviewInterface } from "../reviews/interface.reviews"
import { UserInterface } from "../users/interfaces.users"
import { PropertyInterface, PurchaseTypeEnum } from "../properties/properties.interfaces"

export interface GeneralServiceInputProps {
    media: Model<MediaInterface>
    users: Model<UserInterface>
    reviews: Model<ReviewInterface>
    properties: Model<PropertyInterface>
}


export interface PropertyListingFilter {
    price?: {
        max: number
        min: number
    },
    location?: {
        state: string,
        city: string
    },
    installmentEnabled?: boolean
    category?: string,
    subCategory?: string,
    purchaseType?: PurchaseTypeEnum,
    bedrooms?: number,
    bathrooms?: number
}