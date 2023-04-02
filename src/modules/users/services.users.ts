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
export const tokenKey = '1Z2E3E4D5A6S7-8P9A0SSWORD'


class UserService extends Module {
    private users: Model<UserInterface>

    constructor(props: UserModuleProps) {
        super()
        this.users = props.users
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