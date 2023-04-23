import { FilterQuery, Model } from 'mongoose'
import Module from '@modules/module'
import {
    BadInputFormatException,
    InvalidAccessCredentialsException,
} from '@exceptions/index'
import { MediaInterface, MediaServiceInputProps } from '@modules/media/interfaces.media'
import { AccountStatusEnums, AccountTypeEnums, ApplicationReview, ReviewTypeEnums, UserInterface } from '../users/interfaces.users'
import { AdminServiceInputProps } from './interfaces.admin'
import { PropertyInterface, PropertyStatusEnums } from '../properties/properties.interfaces'



class ControlService extends Module {
    private media: Model<MediaInterface>
    private users: Model<UserInterface>
    private properties: Model<PropertyInterface>

    constructor(props: AdminServiceInputProps) {
        super()
        this.media = props.media
        this.users = props.users
        this.properties = props.properties
    }

    public async pendingApprovals(page: number, limit: number): Promise<{ approvals: UserInterface[], totalPages: number, currentPage: number }> {
        const query: FilterQuery<UserInterface> = {
            $and: [
                { accountStatus: AccountStatusEnums.PENDING, accountType: { $ne: AccountTypeEnums.ADMIN }, setupComplete: true, },
                {
                    $or: [
                        { review: { $exists: false } },
                        { 'review.lastReviewed': { $ne: AccountTypeEnums.ADMIN } }
                    ]
                }
            ]
        }
        const [count, data] = await Promise.all(
            [
                this.users.countDocuments(query),
                this.users
                    .find(query)
                    .sort("-updatedAt")
                    .limit(limit * 1)
                    .skip((page - 1) * limit)
                    .select("-password")
                    .populate('avatar')
                    .populate("kyc.proofOfAddress")
                    .populate("kyc.identification")
                    .populate("kyc.certifications.file")
            ]
        )

        return {
            approvals: data,
            totalPages: Math.ceil(count / limit),
            currentPage: page
        }
    }


    public async fetchUserApplication(userId: string): Promise<UserInterface> {
        let user = await this.users
            .findOne({ _id: userId })
            .sort("-updatedAt")
            .select("-password")
            .populate('avatar')
            .populate("kyc.proofOfAddress")
            .populate("kyc.identification")
            .populate("kyc.certifications.file")
        if (!user) throw new InvalidAccessCredentialsException("Account not found")

        return user
    }


    public async reviewApplication(userId: string, review: ApplicationReview): Promise<UserInterface> {
        const user = await this.users.findById(userId);
        if (!user) throw new BadInputFormatException("Not found");
        if (review.reviewType == ReviewTypeEnums.APPROVE) {
            user.accountStatus = AccountStatusEnums.ACTIVE;
            user.review = review;
        } else if (review.reviewType == ReviewTypeEnums.COMMENT) {
            user.review = review;
        }

        await user.save();

        return this.fetchUserApplication(userId)
    }




    // property approvals
    public async pendingPropertyApprovals(page: number, limit: number): Promise<{ approvals: PropertyInterface[], totalPages: number, currentPage: number }> {
        const query: FilterQuery<PropertyInterface> = {
            $and: [
                { status: PropertyStatusEnums.OPEN },
                { approved: { $ne: true } },
            ]
        }
        const [count, data] = await Promise.all(
            [
                this.properties.countDocuments(query),
                this.properties
                    .find(query)
                    .sort("-updatedAt")
                    .limit(limit * 1)
                    .skip((page - 1) * limit)
                    .populate('media')
                    .populate("agent")
                    .populate("landlord")
            ]
        )

        return {
            approvals: data,
            totalPages: Math.ceil(count / limit),
            currentPage: page
        }
    }


    public async fetchPropertyApplication(propertyId: string): Promise<PropertyInterface> {
        let property = await this.properties
            .findOne({ _id: propertyId })
            .populate('media')
            .populate("agent")
            .populate("landlord")
        if (!property) throw new InvalidAccessCredentialsException("Property not found")

        return property
    }


    public async reviewPropertyApplication(propertyId: string, review: ApplicationReview): Promise<PropertyInterface> {
        const property = await this.properties.findById(propertyId);
        if (!property) throw new BadInputFormatException("Not found");
        if (review.reviewType == ReviewTypeEnums.APPROVE) {
            property.status = PropertyStatusEnums.OPEN;
            property.approved = true;
        } else if (review.reviewType == ReviewTypeEnums.COMMENT) {
            property.review = review;
        }

        await property.save();

        return this.fetchPropertyApplication(propertyId)
    }


}
export default ControlService