import { Model } from "mongoose"
import { MediaInterface } from "../media/interfaces.media"
import { UserInterface } from "../users/interfaces.users"

export interface AdminServiceInputProps {
    media: Model<MediaInterface>
    users: Model<UserInterface>
}