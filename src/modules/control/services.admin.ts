import { FilterQuery, Model } from 'mongoose'
import Module from '@modules/module'
import {
    BadInputFormatException,
    InvalidAccessCredentialsException,
} from '@exceptions/index'
import { MediaInterface, MediaServiceInputProps } from '@modules/media/interfaces.media'
import { PortfolioInterface } from '@modules/users/interfaces.portfolio'
import { AccountStatusEnums, AccountTypeEnums, ApplicationReview, ReviewTypeEnums, UserInterface } from '../users/interfaces.users'
import { AdminServiceInputProps, ArtistApplication } from './interfaces.admin'
import { CalendarInterface } from '../users/interfaces.calendar'



class ControlService extends Module {
    private media: Model<MediaInterface>
    private portfolio: Model<PortfolioInterface>
    private users: Model<UserInterface>
    private calendar: Model<CalendarInterface>

    constructor(props: AdminServiceInputProps) {
        super()
        this.media = props.media
        this.portfolio = props.portfolio
        this.users = props.users
        this.calendar = props.calendar
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


    public async fetchArtistApplication(artistId: string): Promise<ArtistApplication> {
        const [artist, availability, portfolio] = await Promise.all([
            this.users.findById(artistId),
            this.calendar.findOne({ account: artistId }),
            this.portfolio.findOne({ account: artistId }).populate('gallery')
        ])

        return {
            artist, availability, portfolio
        }
    }


    public async reviewApplication(artistId: string, review: ApplicationReview): Promise<ArtistApplication> {
        const artist = await this.users.findById(artistId);
        if (!artist) throw new BadInputFormatException("Not found");
        if (review.reviewType == ReviewTypeEnums.APPROVE) {
            artist.accountStatus = AccountStatusEnums.ACTIVE;
            artist.review = review;
        } else if (review.reviewType == ReviewTypeEnums.COMMENT) {
            artist.review = review;
        }

        await artist.save();

        return this.fetchArtistApplication(artistId);
    }

}
export default ControlService