import * as Joi from 'joi';
import { PurchaseTypeEnum, createPropertyDTO, IPricing, RentDurationEnum, Installments } from '@modules/properties/properties.interfaces';

const InstallmentsValidator: Record<keyof Installments, any> = {
    enabled: Joi.boolean().required(),
    initial: Joi.when("enabled", {
        is: true,
        then: Joi.number().required().min(1),
        otherwise: Joi.any().strip()
    }),
    monthly: Joi.when("enabled", {
        is: true,
        then: Joi.number().required().min(1),
        otherwise: Joi.any().strip()
    }),
    numberOfMonths: Joi.when("enabled", {
        is: true,
        then: Joi.number().required().min(1),
        otherwise: Joi.any().strip()
    }),
}

const PricingValidator: Record<keyof IPricing, any> = {
    currency: Joi.string().required(),
    totalAmount: Joi.number().required().min(1),
    period: Joi.string().required().valid(...Object.values(RentDurationEnum)),
    installmental: Joi.object().keys(InstallmentsValidator)
}
const createPropertyData: Record<keyof createPropertyDTO, any> = {
    name: Joi.string().required(),
    category: Joi.string().required(),
    subCategory: Joi.string().required(),
    description: Joi.string().required(),
    purchaseType: Joi.string().required().valid(...Object.values(PurchaseTypeEnum)),
    features: Joi.array().items(Joi.string()).min(1),
    new: Joi.boolean(),
    furnished: Joi.boolean(),
    serviced: Joi.boolean(),
    toilets: Joi.number().min(0),
    bedrooms: Joi.number().min(0),
    bathrooms: Joi.number().min(0),
    pricing: Joi.object().keys(PricingValidator),
    address: Joi.object().keys({
        city: Joi.string().required(),
        state: Joi.string().required(),
        location: Joi.object().keys({
            coordinates: Joi.array().items(Joi.number()),
            formattedAddress: Joi.string().required()
        })
    })
};

export const createProperty = {
    body: Joi.object().keys(createPropertyData),
};


const updateInstallmentsValidator: Record<keyof Installments, any> = {
    enabled: Joi.boolean().required(),
    initial: Joi.when("enabled", {
        is: true,
        then: Joi.number().required().min(1),
        otherwise: Joi.any().strip()
    }),
    monthly: Joi.when("enabled", {
        is: true,
        then: Joi.number().required().min(1),
        otherwise: Joi.any().strip()
    }),
    numberOfMonths: Joi.when("enabled", {
        is: true,
        then: Joi.number().required().min(1),
        otherwise: Joi.any().strip()
    }),
}

const updatePricingValidator: Record<keyof IPricing, any> = {
    currency: Joi.string().required(),
    totalAmount: Joi.number().required().min(1),
    period: Joi.string().required().valid(...Object.values(RentDurationEnum)),
    installmental: Joi.object().keys(updateInstallmentsValidator)
}
const updatePropertyData: Record<keyof createPropertyDTO, any> = {
    name: Joi.string().optional(),
    category: Joi.string().optional(),
    subCategory: Joi.string().optional(),
    description: Joi.string().optional(),
    purchaseType: Joi.string().optional().valid(...Object.values(PurchaseTypeEnum)),
    features: Joi.array().items(Joi.string()).min(1),
    new: Joi.boolean().optional(),
    furnished: Joi.boolean().optional(),
    serviced: Joi.boolean().optional(),
    toilets: Joi.number().min(0),
    bedrooms: Joi.number().min(0),
    bathrooms: Joi.number().min(0),
    pricing: Joi.object().keys(updatePricingValidator).optional(),
    address: Joi.object().keys({
        city: Joi.string().optional(),
        state: Joi.string().optional(),
        location: Joi.object().keys({
            coordinates: Joi.array().items(Joi.number()).optional(),
            formattedAddress: Joi.string().optional()
        })
    })
};

export const updateProperty = {
    body: Joi.object().keys(updatePropertyData),
    params: Joi.object().keys({
        id: Joi.string().required()
    })
};
