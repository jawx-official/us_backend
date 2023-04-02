import { Model } from "mongoose";
import { PortfolioInterface } from "../users/interfaces.portfolio";

export interface MediaServiceInputProps {
    media: Model<MediaInterface>
    portfolio: Model<PortfolioInterface>
}

export interface MediaInterface {
    _id: string;
    url: string;
    aws_id: string;
    file_type: string;
    createdAt?: Date;
    updatedAt?: Date;
}


export interface IMediaDoc extends MediaInterface, Document {

}