import { Model } from "mongoose";
import { UserInterface } from "../users/interfaces.users";

export interface ReviewServiceInputProps {
    reviews: Model<ReviewInterface>
    users: Model<UserInterface>
}

export interface ReviewInterface extends CreateReviewInterface {
    _id: string;
    reviewedBy: string | UserInterface;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface CreateReviewInterface {
    account: string | UserInterface;
    comment: string;
    response_rate: number;
    professionalism: number;
    approachability: number;
    rating: number;
}


export interface IReviewDoc extends ReviewInterface, Document {

}