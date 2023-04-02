import { Model, Schema, Document } from "mongoose";

export enum AccountStatusEnums {
    PENDING = "pending",
    ACTIVE = "active",
    DISABLED = "disabled"
}

export enum AccountTypeEnums {
    ADMIN = "admin",
    ARTIST = "artist",
    ORGANIZER = "organizer"
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

export interface UserInterface extends Document {
    comparePWD: Function;
    _id: string;
    name: string;
    confirmed?: boolean;
    email: string;
    genres: string[];
    bio: string;
    password: string;
    referalCode?: string;
    accountStatus: AccountStatusEnums;
    accountType: AccountTypeEnums;
    deleted: boolean;
    setupComplete: boolean;
    review?: ApplicationReview;
    online: boolean;
    country?: string;
    avatar?: string;
    avatarColor?: string;
    createdAt?: Date;
    updatedAt?: Date;
}
