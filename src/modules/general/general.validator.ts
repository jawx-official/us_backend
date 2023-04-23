import * as Joi from 'joi';
import { PurchaseTypeEnum, createPropertyDTO, IPricing, RentDurationEnum, Installments } from '@modules/properties/properties.interfaces';


export const fetchPropertiesValidator = {
    body: Joi.object().keys({
        price: Joi.object().optional().keys({
            max: Joi.number().required(),
            min: Joi.number().required()
        }),
        location: Joi.object().optional().keys({
            state: Joi.string().required(),
            city: Joi.string().required()
        }),
        installmentEnabled: Joi.boolean().optional(),
        category: Joi.string().optional(),
        subCategory: Joi.string().optional(),
        purchaseType: Joi.string().valid(...Object.values(PurchaseTypeEnum)).optional(),
        bedrooms: Joi.number().optional(),
        bathrooms: Joi.number().optional()
    })
};
