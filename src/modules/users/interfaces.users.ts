import { Model, Schema, Document } from "mongoose";
import { MediaInterface } from "../media/interfaces.media";

export enum AccountStatusEnums {
    PENDING = "pending",
    ACTIVE = "active",
    DISABLED = "disabled"
}

export enum AccountTypeEnums {
    ADMIN = "admin",
    AGENT = "agent",
    MEMBER = "team-member",
    CLIENT = "client",
    LANDLORD = "landlord"
}

export enum ReviewTypeEnums {
    COMMENT = "comment",
    APPROVE = "approve",
    RESPONSE = "response"
}

export interface UserModuleProps {
    users: Model<UserInterface>
}

export interface ApplicationReview {
    comment: string;
    reviewType: ReviewTypeEnums;
    lastReviewed: AccountTypeEnums;
}

export interface Address {
    city: string;
    state: string;
    location?: {
        type: string;
        coordinates: number[];
        formattedAddress: string;
    },
}

export interface Certification {
    name: string;
    file: string | MediaInterface;
}

export enum IDTypes {
    NIN = "nin",
    BVN = "bvn"
}

export interface Identification {
    idType: IDTypes,
    idNumber: string;
    verified: boolean;
}

export interface KYCInformation {
    proofOfAddress: string | MediaInterface;
    identification: Identification;
    certifications: [Certification];
    nationality: string;
    incomeLevel: string;
    occupation: string;
    phoneNumber: string;
    isCompany: boolean;
    companyInformation: {
        name: string;
        registerationNumber: string;
        address: Address;
    };
    address: {
        coordinates: number[];
        formattedAddress: string;
    }
}

export interface UserInterface extends Document {
    comparePWD: Function;
    _id: string;
    name: string;
    confirmed?: boolean;
    address?: Address;
    email: string;
    phoneNumber: string;
    password: string;
    accountStatus: AccountStatusEnums;
    accountType: AccountTypeEnums;
    deleted: boolean;
    dob: Date;
    kyc: Partial<KYCInformation>;
    review?: ApplicationReview;
    setupComplete: boolean;
    online: boolean;
    avatar?: string | MediaInterface;
    avatarColor?: string;
    createdAt?: Date;
    updatedAt?: Date;
}
