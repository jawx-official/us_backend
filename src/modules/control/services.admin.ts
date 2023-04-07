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


}
export default ControlService