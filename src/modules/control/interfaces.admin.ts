import { Model } from "mongoose"
import { MediaInterface } from "../media/interfaces.media"
import { CalendarInterface } from "../users/interfaces.calendar"
import { PortfolioInterface } from "../users/interfaces.portfolio"
import { UserInterface } from "../users/interfaces.users"

export interface AdminServiceInputProps {
    media: Model<MediaInterface>
    portfolio: Model<PortfolioInterface>
    users: Model<UserInterface>
    calendar: Model<CalendarInterface>
}

export interface ArtistApplication {
    artist: UserInterface | null;
    portfolio: PortfolioInterface | null;
    availability: CalendarInterface | null;
}