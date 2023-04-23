
import {
    User as UserModel,
    Otp as OtpModel,
    Media as MediaModel,
    Reviews as ReviewModel,
    Properties as PropertiesModel
} from '@modules/models'
import AuthModule from '@modules/auth/services.auth'
import UserModule from '@modules/users/services.users'
import MediaModule from '@modules/media/services.media'
import GeneralModule from '@modules/general/services.general'
import ReviewsModule from '@modules/reviews/services.reviews'
import PropertiesModule from '@modules/properties/properties.services'

import AdminModule from '@modules/control/services.admin'
// import SeedModule from '@modules/data.module'

export const Auth = new AuthModule({
    model: UserModel,
    otps: OtpModel
})

export const Media = new MediaModule({
    media: MediaModel,
})

export const User = new UserModule({
    users: UserModel,
})


export const Reviews = new ReviewsModule({
    users: UserModel,
    reviews: ReviewModel
})

export const Admin = new AdminModule({
    users: UserModel,
    media: MediaModel,
    properties: PropertiesModel
})

export const Properties = new PropertiesModule({
    properties: PropertiesModel
})


export const General = new GeneralModule({
    users: UserModel,
    media: MediaModel,
    reviews: ReviewModel,
    properties: PropertiesModel
})
