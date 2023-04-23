import { Model } from "mongoose"
import { MediaInterface } from "../media/interfaces.media"
import { UserInterface } from "../users/interfaces.users"
import { PropertyInterface } from "../properties/properties.interfaces"

export interface AdminServiceInputProps {
    media: Model<MediaInterface>
    users: Model<UserInterface>
    properties: Model<PropertyInterface>
}