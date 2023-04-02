import { Model } from 'mongoose'
import AppConfig from '@configs/app'
import { hashSync, compareSync } from "bcryptjs";
import Mailer from '@src/utils/mailer'
import { AccountTypeEnums, UserInterface } from '@modules/users/interfaces.users'
import Module from '@modules/module'
import { verify, sign } from 'jsonwebtoken'
var randomstring = require("randomstring");
import {
    BadInputFormatException,
    InvalidAccessCredentialsException,
} from '@exceptions/index'
import { AuthModuleProps, ForgotPasswordInput, GoogleProfile, LoginInput, LoginReturn, NewAccount, OtpInterface, OtpRoleEnums, ResetPasswordInput, SocialLoginReturn, TokenPayloadInterface, VerifyInput } from '@modules/auth/interfaces.auth'
export const tokenKey = '1Z2E3E4D5A6S7-8P9A0SSWORD'
export const PASSWORD = '@11Poster'



class Auth extends Module {
    private model: Model<UserInterface>
    private otps: Model<OtpInterface>

    constructor(props: AuthModuleProps) {
        super()
        this.model = props.model;
        this.otps = props.otps
    }

    public async create(data: NewAccount): Promise<void> {
        // check if email belongs to an existing account.
        const existingAccount = await this.model.findOne({ email: data.email });
        if (existingAccount) {
            throw new BadInputFormatException("There is an existing account with this email address. Try again or login to continue")
        }
        // save user info
        const hashedPassword = hashSync(data.password)
        await this.model.create({
            name: data.name,
            email: data.email,
            password: hashedPassword,
            confirmed: false
        })
        // send verification email
        this.resendVerifyEmail(data.email)
    }

    public async resendVerifyEmail(email: string): Promise<void> {
        const accountExists: UserInterface | null = await this.model
            .findOne({ email })
        if (accountExists) {
            const code = randomstring.generate({
                length: 6,
                charset: 'numeric'
            });
            const expiresIn = new Date().getDate() + (1000 * 60 * 60 * 5)
            await this.otps.create({
                code,
                expiryDate: new Date(expiresIn),
                account: accountExists._id,
                action: OtpRoleEnums.VERIFICATION
            })
            Mailer({
                destination: accountExists.email,
                subject: "Verify your email address",
                template: "verify-account",
                templateValues: {
                    code,
                    customer_name: accountExists.name,
                    app_name: AppConfig.appName
                }
            })
        }
    }

    public async login(data: LoginInput): Promise<LoginReturn> {
        let query: any = { email: data.email };
        if (data.admin) {
            query.accountType = AccountTypeEnums.ADMIN
        }
        const existingAccount = await this.model.findOne(query);
        if (!existingAccount) {
            throw new BadInputFormatException("invalid login credentials. Try again with valid crendentials or signup to continue")
        }

        if (!existingAccount.confirmed) {
            this.resendVerifyEmail(existingAccount.email);
            throw new BadInputFormatException("Your email address has not been confirmed. We have sent you a new email with the confirmation link")
        }

        // compare password
        const isPasswordCorrect = compareSync(data.password, existingAccount.password)
        if (!isPasswordCorrect) {
            throw new BadInputFormatException("invalid login credentials. Try again with valid crendentials or signup to continue")
        }

        const payload: TokenPayloadInterface = { user: existingAccount._id.toString(), type: "auth" }
        const expiresIn = 1000 * 60 * 60 * 24
        const token = sign(payload, tokenKey, { expiresIn })

        const returnObject: LoginReturn = {
            user: existingAccount,
            accessToken: {
                expires: new Date().getTime() + expiresIn,
                token
            }
        }
        return returnObject
    }

    public async forgotPassword(
        data: ForgotPasswordInput
    ): Promise<void> {
        const existingAccount = await this.model.findOne({ email: data.email });
        if (!existingAccount) {
            throw new BadInputFormatException("invalid account email. Try again with valid crendentials or signup to continue")
        }

        const otp = await this.otps.findOne({ account: existingAccount._id, action: OtpRoleEnums.RESET });
        // generate token
        let code = randomstring.generate({
            length: 6,
            charset: 'numeric'
        });
        const expiresIn = new Date().getDate() + (1000 * 60 * 60 * 5)
        if (otp) {
            code = otp.code;
            await this.otps.updateOne({ _id: otp._id }, {
                $set: {
                    expiryDate: new Date(expiresIn),
                }
            })
        } else {
            await this.otps.create({
                code,
                expiryDate: new Date(expiresIn),
                account: existingAccount._id,
                action: OtpRoleEnums.RESET
            })
        }
        Mailer({
            destination: existingAccount.email,
            subject: "Reset password request",
            template: "forgot-password",
            templateValues: {
                code,
                customer_name: existingAccount.name,
                app_name: AppConfig.appName
            }
        })
    }

    public async resetPassword(
        data: ResetPasswordInput
    ): Promise<void> {
        // @ts-ignore
        const otp = await this.otps.findOne({ code: data.token });

        if (otp && otp.action === OtpRoleEnums.RESET) {
            const existingAccount = await this.model.findOne({ _id: otp.account });
            if (!existingAccount) {
                throw new BadInputFormatException("Invalid account attached to this token")
            }
            const hashedPassword = hashSync(data.password)
            existingAccount.password = hashedPassword;
            await existingAccount.save()
            await otp.delete()
        } else {
            throw new BadInputFormatException("Provided token was not generated for reset password purposes")
        }
    }

    public async verifyAccount(
        data: VerifyInput
    ): Promise<LoginReturn> {
        const otp = await this.otps.findOne({ code: data.token });
        if (otp && otp.action === OtpRoleEnums.VERIFICATION) {
            const existingAccount = await this.model.findOne({ _id: otp.account });
            if (!existingAccount) {
                throw new BadInputFormatException("Invalid account attached to this token")
            }
            existingAccount.confirmed = true;
            await existingAccount.save()
            await otp.delete()
            const payload: TokenPayloadInterface = { user: existingAccount._id.toString(), type: "auth" }
            const expiresIn = 1000 * 60 * 60 * 24
            const token = sign(payload, tokenKey, { expiresIn })

            const returnObject: LoginReturn = {
                user: existingAccount,
                accessToken: {
                    expires: new Date().getTime() + expiresIn,
                    token
                }
            }
            return returnObject
        } else {
            throw new BadInputFormatException("Provided token was not generated for account verification purposes")
        }
    }

    public async SocialSignup(
        profile: GoogleProfile,
        accountType: string,
        country: string
    ): Promise<SocialLoginReturn> {
        const existingAccount = await this.model.findOne({ email: profile.email });
        if (existingAccount) {
            throw new BadInputFormatException("There is an existing account with this email address. Try again or login to continue")
        }
        const hashedPassword = hashSync(PASSWORD)
        // save user info
        const user = await this.model.create({
            name: profile.name,
            email: profile.email,
            confirmed: true,
            accountType,
            country,
            avatar: profile.avatar,
            password: hashedPassword
        })

        const payload: TokenPayloadInterface = { user: user._id.toString(), type: "auth" }
        const expiresIn = 1000 * 60 * 60 * 24
        const token = sign(payload, tokenKey, { expiresIn })
        const returnObject: LoginReturn = {
            user: user,
            accessToken: {
                expires: new Date().getTime() + expiresIn,
                token
            }
        }
        return { data: returnObject, message: "Logged in successfully" }
    }

    public async socialLogin(
        profile: GoogleProfile
    ): Promise<SocialLoginReturn> {
        const existingAccount = await this.model.findOne({ email: profile.email });
        if (!existingAccount) {
            throw new BadInputFormatException("invalid login credentials. Try again with valid crendentials or signup to continue")
        }

        existingAccount.avatar = profile.avatar;
        await existingAccount.save()

        const payload: TokenPayloadInterface = { user: existingAccount._id.toString(), type: "auth" }
        const expiresIn = 1000 * 60 * 60 * 24
        const token = sign(payload, tokenKey, { expiresIn })

        const returnObject: LoginReturn = {
            user: existingAccount,
            accessToken: {
                expires: new Date().getTime() + expiresIn,
                token
            }
        }
        return { data: returnObject, message: "Logged in successfully" }
    }

    public async getToken(user: string): Promise<string> {
        const accountExists: UserInterface | null = await this.model
            .findOne({ _id: user, deleted: false })
        if (!accountExists)
            throw new InvalidAccessCredentialsException('This user does not exist')

        const payload: TokenPayloadInterface = { user }
        const expiresIn = 1000 * 60 * 60 * 24
        const token = sign(payload, tokenKey, { expiresIn })
        return Promise.resolve(token)
    }
}
export default Auth