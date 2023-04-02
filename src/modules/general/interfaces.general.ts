import { Model } from "mongoose"
import { MediaInterface } from "../media/interfaces.media"
import { ReviewInterface } from "../reviews/interface.reviews"
import { UserInterface } from "../users/interfaces.users"

export interface GeneralServiceInputProps {
    media: Model<MediaInterface>
    users: Model<UserInterface>
    reviews: Model<ReviewInterface>
}
