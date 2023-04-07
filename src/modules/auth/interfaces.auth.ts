import { Model, Document } from "mongoose"
import { AccountTypeEnums, UserInterface } from "@modules/users/interfaces.users"

export enum OtpRoleEnums {
    VERIFICATION = 'verification',
    RESET = 'reset-password'
}
export interface AuthModuleProps {
    model: Model<UserInterface>
    otps: Model<OtpInterface>
}
export interface NewAccount {
    email: string
    password: string
    name: string
    accountType: AccountTypeEnums.AGENT | AccountTypeEnums.CLIENT;
    city: string;
    state: string;
}


export interface OtpInterface extends Document {
    comparePWD: Function;
    _id: string;
    code: string;
    action: OtpRoleEnums;
    expiryDate: Date;
    account: string;
    createdAt?: Date;
    updatedAt?: Date;
}


export interface TokenInterface {
    expires: number
    token: string
}
export interface TokenPayloadInterface {
    user: string
    type?: string
}

export type Template = {
    name?: string
    url?: string
    email?: string
}

export interface LoginReturn {
    user: UserInterface
    accessToken: TokenInterface
}

export interface SocialLoginReturn {
    data: {
        user: UserInterface
        accessToken: TokenInterface
    }
    message: string
}

export interface LoginInput {
    email: string
    password: string
    admin?: boolean
}

export interface ForgotPasswordInput {
    email: string
}

export interface ResetPasswordInput {
    password: string
    token: string
}

export interface VerifyInput {
    token: string
}

export interface GoogleProfile {
    channel: string
    email: string
    name: string
    phoneNumber: string;
    avatar: string
    accessToken?: string
}


interface GoogleEmail {
    value: string;
}

interface GooglePhoto {
    url: string;
}

interface GoogleName {
    displayName: string;
}

interface GooglePhonenumber {
    value: string;
}



export interface GoogleReturn {
    emailAddresses: GoogleEmail[]
    photos: GooglePhoto[]
    names: GoogleName[]
    phoneNumbers: GooglePhonenumber[]
}

