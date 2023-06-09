import { createConnection, Connection, Model } from 'mongoose'

import MongoConfig from '@configs/mongo'
import userFactory, { UserInterface } from '@modules/users/model.user'
import otpFactory, { OtpInterface } from '@modules/auth/otp.model'
import mediaFactory, { MediaInterface } from '@modules/media/model.media'
import reviewFactory, { ReviewInterface } from '@modules/reviews/model.reviews'
import propertiesFactory, { PropertyInterface } from '@modules/properties/properties.model'


export const conn: Connection = createConnection(
    MongoConfig.uri
)

export const User: Model<UserInterface> = userFactory(conn)

export const Otp: Model<OtpInterface> = otpFactory(conn)

// Media
export const Media: Model<MediaInterface> = mediaFactory(conn)

// Reviews
export const Reviews: Model<ReviewInterface> = reviewFactory(conn)

// properties
export const Properties: Model<PropertyInterface> = propertiesFactory(conn)

conn.once('open', (): void => console.log('db connection open'))
