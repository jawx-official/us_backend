import { MediaInterface } from "../media/interfaces.media";

export interface PortfolioInterface {
    _id: string;
    account: string;
    gallery: string[];
    embeddedMedia: string[];
    createdAt?: Date;
    updatedAt?: Date;
}


export interface IPortfolioDoc extends PortfolioInterface, Document {

}