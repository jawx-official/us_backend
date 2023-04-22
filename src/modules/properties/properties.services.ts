import { Model } from 'mongoose'
import Module from '@modules/module'
import {
    InvalidAccessCredentialsException,
} from '@exceptions/index'
import { PropertiesModuleProps, PropertyInterface, PropertyStatusEnums, createPropertyDTO } from './properties.interfaces'
import { UserInterface } from '../users/interfaces.users'

class PropertyService extends Module {
    private properties: Model<PropertyInterface>

    constructor(props: PropertiesModuleProps) {
        super()
        this.properties = props.properties
    }


    public async createPropertyService(user: UserInterface, propertyData: createPropertyDTO): Promise<void> {
        await this.properties.create({ ...propertyData, agent: user._id });
    }

    public async fetchUserProperties(user: UserInterface, filter: "all" | PropertyStatusEnums | string): Promise<PropertyInterface[]> {
        let ft: { agent: string; status?: string } = { agent: user._id, status: filter };
        if (filter === "all") {
            delete ft.status;
        }
        return this.properties.find(ft)
    }

    public async fetchUserPropertyByID(user: UserInterface, propertyID: string): Promise<PropertyInterface | null> {
        let ft: { agent: string; _id: string } = { agent: user._id, _id: propertyID };
        return this.properties.findOne(ft);
    }

    public async publishUserPropertyByID(user: UserInterface, propertyID: string): Promise<void> {
        let ft: { agent: string; _id: string } = { agent: user._id, _id: propertyID };
        await this.properties.findOneAndUpdate(ft, { status: PropertyStatusEnums.OPEN });
    }

    public async disableUserPropertyByID(user: UserInterface, propertyID: string): Promise<void> {
        let ft: { agent: string; _id: string } = { agent: user._id, _id: propertyID };
        await this.properties.findOneAndUpdate(ft, { status: PropertyStatusEnums.DISABLED });
    }

    public async updateUserPropertyByID(user: UserInterface, propertyID: string, propertyData: createPropertyDTO): Promise<void> {
        let ft: { agent: string; _id: string } = { agent: user._id, _id: propertyID };
        await this.properties.findOneAndUpdate(ft, { ...propertyData });
    }

}
export default PropertyService