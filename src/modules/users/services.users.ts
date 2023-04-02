import { Model } from 'mongoose'
import { verify } from 'jsonwebtoken'
import { hashSync } from "bcryptjs";
import { AccountStatusEnums, AccountTypeEnums, ApplicationReview, ReviewTypeEnums, UserInterface, UserModuleProps } from '@modules/users/interfaces.users'
import Module from '@modules/module'
import {
    BadInputFormatException,
    InvalidAccessCredentialsException,
} from '@exceptions/index'
import { TokenPayloadInterface } from '@modules/auth/interfaces.auth'
import { AvailableSlots, CalendarInterface } from './interfaces.calendar'
import { PortfolioInterface } from './interfaces.portfolio'
import { ArtistApplication } from '../control/interfaces.admin';
export const tokenKey = '1Z2E3E4D5A6S7-8P9A0SSWORD'


class UserService extends Module {
    private users: Model<UserInterface>
    private portfolio: Model<PortfolioInterface>
    private calendar: Model<CalendarInterface>

    constructor(props: UserModuleProps) {
        super()
        this.users = props.users
        this.portfolio = props.portfolio;
        this.calendar = props.calendar;
    }

    public async fetchUserWithToken(token: string): Promise<UserInterface> {
        // @ts-ignore
        const decoded: TokenPayloadInterface = verify(token, tokenKey);
        if (decoded.type !== "auth") {
            throw new InvalidAccessCredentialsException("Provided token is invalid")
        }
        const user = await this.users.findOne({ _id: decoded.user })
        if (!user) throw new InvalidAccessCredentialsException("Account not found")
        return user
    }

    public async updateMyUserAccount(user: UserInterface, update: Partial<UserInterface>): Promise<UserInterface> {
        const updatedInfo = await this.users.findByIdAndUpdate(user._id, { $set: { ...update } }, { new: true })
        if (updatedInfo) {
            return updatedInfo;
        } else {
            throw new InvalidAccessCredentialsException("Could not update your account")
        }
    }

    public async updateMyAvailability(user: UserInterface, update: AvailableSlots[]): Promise<CalendarInterface> {
        let calendar = await this.calendar.findOne({ account: user._id });
        if (!calendar) {
            calendar = await this.calendar.create({
                account: user._id,
                available: update,
                booked: []
            })
        } else {
            calendar.available = update;
            await calendar.save()
        }
        return calendar;
    }

    public async updateMyPortfolio(user: UserInterface, update: { gallery: string[]; embedded: string[] }): Promise<PortfolioInterface> {
        let portfolio = await this.portfolio.findOne({ account: user._id });
        if (!portfolio) {
            portfolio = await this.portfolio.create({
                account: user._id,
                embeddedMedia: update.embedded || [],
                gallery: update.gallery || []
            })
        } else {
            portfolio.embeddedMedia = update.embedded;
            portfolio.gallery = update.gallery;
            await portfolio.save()
        }
        portfolio = await this.portfolio.findOne({ account: user._id }).populate('gallery');
        if (!portfolio) throw new BadInputFormatException("Portfolio not found")
        return portfolio;
    }


    public async fetchMyPortfolio(user: UserInterface): Promise<PortfolioInterface> {
        let portfolio = await this.portfolio.findOne({ account: user._id }).populate('gallery');
        if (!portfolio) {
            portfolio = await this.portfolio.create({
                account: user._id,
                embeddedMedia: [],
                gallery: []
            })
        }
        return portfolio;
    }

    public async fetchMyAvailability(user: UserInterface): Promise<CalendarInterface> {
        let calendar = await this.calendar.findOne({ account: user._id });
        if (!calendar) {
            calendar = await this.calendar.create({
                account: user._id,
                available: [],
                booked: []
            })
        }
        return calendar;
    }

    public async fetchArtistApplication(artistId: string): Promise<ArtistApplication> {
        const [artist, availability, portfolio] = await Promise.all([
            this.users.findById(artistId),
            this.calendar.findOne({ account: artistId }),
            this.portfolio.findOne({ account: artistId }).populate('gallery')
        ])

        return {
            artist, availability, portfolio
        }
    }

    public async replyApplicationReview(user: UserInterface, review: ApplicationReview): Promise<ArtistApplication> {
        const artist = await this.users.findById(user._id);
        if (!artist) throw new BadInputFormatException("Not found");
        if (review.reviewType == ReviewTypeEnums.RESPONSE) {
            artist.review = review;
        }

        await artist.save();

        return this.fetchArtistApplication(user._id);
    }

    public async seedAdmin() {
        const admin: Partial<UserInterface> = {
            name: "Saleh Prince",
            confirmed: true,
            email: "saleh.prince@mailinator.com",
            genres: [],
            bio: "this is a short bio",
            password: "Wdat1234!",
            referalCode: "",
            accountStatus: AccountStatusEnums.ACTIVE,
            accountType: AccountTypeEnums.ADMIN,
            deleted: false,
            setupComplete: true,
            online: false
        }
        const existingAccount = await this.users.findOne({ email: admin.email, accountType: AccountTypeEnums.ADMIN });
        if (existingAccount) {
            await existingAccount.delete();
        }
        // save user info
        const hashedPassword = hashSync(admin.password || "")
        await this.users.create({
            ...admin,
            password: hashedPassword,
        })
        console.info('Admin data loaded.')
    }




}
export default UserService