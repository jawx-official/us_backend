import { Model } from "mongoose";

export interface MediaServiceInputProps {
    media: Model<MediaInterface>
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