import { FilterQuery, Model } from 'mongoose'
import Module from '@modules/module'
import {
    BadInputFormatException,
    InvalidAccessCredentialsException,
} from '@exceptions/index'
import { MediaInterface } from '@modules/media/interfaces.media'
import { AccountStatusEnums, AccountTypeEnums, UserInterface } from '../users/interfaces.users'
import { GeneralServiceInputProps, PropertyListingFilter } from './interfaces.general'
import { ReviewInterface } from '../reviews/interface.reviews'
import { PropertyInterface } from '../properties/properties.interfaces'
import { PropertyStatusEnums } from '../properties/properties.interfaces'



class General extends Module {
    private media: Model<MediaInterface>
    private users: Model<UserInterface>
    private reviews: Model<ReviewInterface>
    private properties: Model<PropertyInterface>

    constructor(props: GeneralServiceInputProps) {
        super()
        this.media = props.media
        this.users = props.users
        this.properties = props.properties
        this.reviews = props.reviews
    }

    private generateFilter(filter: PropertyListingFilter) {
        let ft: FilterQuery<PropertyInterface> = {
            approved: true,
            status: PropertyStatusEnums.OPEN
        }
        if (filter.price) {
            ft.pricing = {
                totalAmount: {
                    $gte: filter.price.min,
                    $lte: filter.price.max
                }
            }
        }

        if (filter.location) {
            ft.address = {
                city: filter.location.city,
                state: filter.location.state
            }
        }

        if (filter.installmentEnabled) {
            ft.pricing = {
                installmental: {
                    enabled: filter.installmentEnabled
                }
            }
        }
        if (filter.bedrooms) {
            ft.bedrooms = { $gte: filter.bedrooms }
        }

        if (filter.bathrooms) {
            ft.bathrooms = { $gte: filter.bathrooms }
        }

        if (filter.category) {
            ft.category = filter.category
        }
        if (filter.subCategory) {
            ft.subCategory = filter.subCategory
        }
        if (filter.purchaseType) {
            ft.purchaseType = filter.purchaseType
        }

        return ft;
    }

    public async fetchProperties(filter: PropertyListingFilter): Promise<PropertyInterface[]> {
        const ft = this.generateFilter(filter);
        return this.properties.find(ft)
    }

    public async fetchSingleProperties(propertyId: string): Promise<PropertyInterface> {
        const data = await this.properties.findById(propertyId);
        if (!data) throw new BadInputFormatException("Property not found")
        return data;
    }

}
export default General