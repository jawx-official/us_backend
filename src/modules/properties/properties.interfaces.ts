import { Model, Schema, Document } from "mongoose";
import { MediaInterface } from "../media/interfaces.media";
import { ApplicationReview, UserInterface } from "../users/interfaces.users";

export enum PropertyStatusEnums {
    PENDING = "pending",
    OPEN = "open",
    CLOSED = "closed",
    DISABLED = "disabled"
}

export enum PropertyTypeEnum {

}

export enum PropertyTypeEnum {

}

export enum PurchaseTypeEnum {
    RENT = "rent",
    SALE = "sale",
    LEASE = "lease"
}


export enum RentDurationEnum {
    MONTHLY = "per month",
    YEARLY = "per year",
    DAILY = "per day"
}


export interface PropertiesModuleProps {
    properties: Model<PropertyInterface>
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

export interface PropertyCost {
    amount: number;
    currency: string;
}

export interface Installments {
    enabled: boolean;
    initial: number;
    monthly: number;
    numberOfMonths: number;
}

export interface IPricing {
    installmental: Installments;
    totalAmount: number;
    currency: string;
    period?: RentDurationEnum;
}

export interface Sponsorship {
    transaction: string;
    validTill: Date;
    enabled: boolean;
}

export interface createPropertyDTO {
    name: string;
    address: Address;
    purchaseType: PurchaseTypeEnum;
    category: string;
    subCategory: string;
    features: string[];
    description: string;
    pricing: IPricing;
    new: boolean;
    furnished: boolean;
    serviced: boolean;
    toilets: number;
    bathrooms: number;
    bedrooms: number;
}


export interface PropertyInterface extends Document {
    _id: string;
    name: string;
    address: Address;
    agent: string | UserInterface;
    landlord: string | UserInterface;
    status: PropertyStatusEnums;
    purchaseType: PurchaseTypeEnum;
    category: string;
    subCategory: string;
    description: string;
    pricing: IPricing;
    media: string[] | MediaInterface[];
    sponsored?: Sponsorship;
    viewers: string[];
    new: boolean;
    furnished: boolean;
    serviced: boolean;
    toilets: number;
    features: string[];
    bathrooms: number;
    bedrooms: number;
    review?: ApplicationReview;
    approved: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}
