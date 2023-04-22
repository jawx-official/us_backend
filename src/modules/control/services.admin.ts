import { FilterQuery, Model } from 'mongoose'
import Module from '@modules/module'
import {
    BadInputFormatException,
    InvalidAccessCredentialsException,
} from '@exceptions/index'
import { MediaInterface, MediaServiceInputProps } from '@modules/media/interfaces.media'
import { AccountStatusEnums, AccountTypeEnums, ApplicationReview, ReviewTypeEnums, UserInterface } from '../users/interfaces.users'
import { AdminServiceInputProps } from './interfaces.admin'



class ControlService extends Module {
    private media: Model<MediaInterface>
    private users: Model<UserInterface>

    constructor(props: AdminServiceInputProps) {
        super()
        this.media = props.media
        this.users = props.users
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


}
export default ControlService