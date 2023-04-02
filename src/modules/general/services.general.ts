import { FilterQuery, Model } from 'mongoose'
import Module from '@modules/module'
import {
    BadInputFormatException,
    InvalidAccessCredentialsException,
} from '@exceptions/index'
import { MediaInterface } from '@modules/media/interfaces.media'
import { AccountStatusEnums, AccountTypeEnums, UserInterface } from '../users/interfaces.users'
import { GeneralServiceInputProps } from './interfaces.general'
import { ReviewInterface } from '../reviews/interface.reviews'



class General extends Module {
    private media: Model<MediaInterface>
    private users: Model<UserInterface>
    private reviews: Model<ReviewInterface>

    constructor(props: GeneralServiceInputProps) {
        super()
        this.media = props.media
        this.users = props.users
        this.reviews = props.reviews
    }



}
export default General