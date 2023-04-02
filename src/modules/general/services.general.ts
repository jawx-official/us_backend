import { FilterQuery, Model } from 'mongoose'
import Module from '@modules/module'
import {
    BadInputFormatException,
    InvalidAccessCredentialsException,
} from '@exceptions/index'
import { MediaInterface } from '@modules/media/interfaces.media'
import { PortfolioInterface } from '@modules/users/interfaces.portfolio'
import { AccountStatusEnums, AccountTypeEnums, UserInterface } from '../users/interfaces.users'
import { Artistinformation, GeneralServiceInputProps } from './interfaces.general'
import { CalendarInterface } from '../users/interfaces.calendar'
import { ReviewInterface } from '../reviews/interface.reviews'



class General extends Module {
    private media: Model<MediaInterface>
    private portfolio: Model<PortfolioInterface>
    private users: Model<UserInterface>
    private reviews: Model<ReviewInterface>
    private calendar: Model<CalendarInterface>

    constructor(props: GeneralServiceInputProps) {
        super()
        this.media = props.media
        this.portfolio = props.portfolio
        this.users = props.users
        this.calendar = props.calendar
        this.reviews = props.reviews
    }

    public async approvedArtists(page: number, limit: number): Promise<{ artists: Partial<Pick<Artistinformation, 'artist' | 'portfolio' | 'averageRating' | 'latestReviews'>>[], totalPages: number, currentPage: number }> {
        const query: FilterQuery<UserInterface> = { accountStatus: AccountStatusEnums.ACTIVE, accountType: AccountTypeEnums.ARTIST }
        const [count, data] = await Promise.all(
            [
                this.users.countDocuments(query),
                this.users
                    .find(query)
                    .limit(limit * 1)
                    .skip((page - 1) * limit)
                    .select("-password")
            ]
        )

        const artists: Partial<Pick<Artistinformation, 'artist' | 'portfolio' | 'averageRating' | 'latestReviews'>>[] = await Promise.all(data.map(async artist => {
            let pf = await this.portfolio.findOne({ account: artist._id }).populate("gallery")
            let latestReviews = await this.reviews.find({ account: artist._id }).sort("-createdAt").limit(5)
            // let rating = await this.reviews.aggregate([
            //     { "$match": { "account": artist._id } },
            //     {
            //         $group: {
            //             averageRatings: { $avg: "$rating" }
            //         }
            //     }
            // ])
            return {
                artist,
                portfolio: pf,
                latestReviews,
                averageRating: 0
            }
        }))

        return {
            artists,
            totalPages: Math.ceil(count / limit),
            currentPage: page
        }
    }


    public async singleArtist(artistId: string): Promise<{ artist: Artistinformation }> {
        const data = await this.users
            .findOne({ _id: artistId })
            .select("-password")


        let pf = await this.portfolio.findOne({ account: artistId }).populate("gallery")
        let latestReviews = await this.reviews.find({ account: artistId }).sort("-createdAt")
        let av = await this.calendar.findOne({ account: artistId });
        // let rating = await this.reviews.aggregate([
        //     { "$match": { "account": artist._id } },
        //     {
        //         $group: {
        //             averageRatings: { $avg: "$rating" }
        //         }
        //     }
        // ])
        return {
            artist: {
                availability: av,
                artist: data,
                portfolio: pf,
                latestReviews,
                averageRating: 0
            }
        }

    }


}
export default General