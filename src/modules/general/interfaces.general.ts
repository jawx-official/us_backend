import { Model } from "mongoose"
import { MediaInterface } from "../media/interfaces.media"
import { ReviewInterface } from "../reviews/interface.reviews"
import { CalendarInterface } from "../users/interfaces.calendar"
import { PortfolioInterface } from "../users/interfaces.portfolio"
import { UserInterface } from "../users/interfaces.users"

export interface GeneralServiceInputProps {
    media: Model<MediaInterface>
    portfolio: Model<PortfolioInterface>
    users: Model<UserInterface>
    reviews: Model<ReviewInterface>
    calendar: Model<CalendarInterface>
}



export interface Artistinformation {
    artist: UserInterface | null;
    portfolio: PortfolioInterface | null;
    availability: CalendarInterface | null;
    latestReviews: ReviewInterface[]
    averageRating: number
}