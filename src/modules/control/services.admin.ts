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
                { accountStatus: AccountStatusEnums.PENDING, accountType: AccountTypeEnums.ARTIST, setupComplete: true, },
                {
                    $or: [
                        { review: { $exists: false } },
                        { 'review.lastReviewed': AccountTypeEnums.ARTIST }
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
            ]
        )

        return {
            approvals: data,
            totalPages: Math.ceil(count / limit),
            currentPage: page
        }
    }

}
export default ControlService