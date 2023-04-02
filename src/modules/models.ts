import { createConnection, Connection, Model } from 'mongoose'

import MongoConfig from '@configs/mongo'
import userFactory, { UserInterface } from '@modules/users/model.user'
import otpFactory, { OtpInterface } from '@modules/auth/otp.model'
import calendarFactory, { CalendarInterface } from '@modules/users/model.calendar'
import portfolioFactory, { PortfolioInterface } from '@modules/users/model.portfolio'
import mediaFactory, { MediaInterface } from '@modules/media/model.media'
import reviewFactory, { ReviewInterface } from '@modules/reviews/model.reviews'


export const conn: Connection = createConnection(
    MongoConfig.uri
)

export const User: Model<UserInterface> = userFactory(conn)

export const Otp: Model<OtpInterface> = otpFactory(conn)
export const Calendar: Model<CalendarInterface> = calendarFactory(conn)

// Portfolio
export const Portfolio: Model<PortfolioInterface> = portfolioFactory(conn)

// Media
export const Media: Model<MediaInterface> = mediaFactory(conn)

// Reviews
export const Reviews: Model<ReviewInterface> = reviewFactory(conn)

conn.once('open', (): void => console.log('db connection open'))
