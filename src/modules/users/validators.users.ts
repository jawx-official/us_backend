import * as Joi from 'joi';
import { NewAccount, LoginInput } from '@modules/auth/interfaces.auth';
import { AccountTypeEnums, IDTypes, KYCInformation } from '../users/interfaces.users';
// 'phoneNumber: Joi.string().pattern(/^\+[1-9]\d{0,2}\s\d{3}\s\d{4}$/),'

const clientKycBody: Record<keyof Omit<KYCInformation, "isCompany" | "companyInformation">, any> = {
    proofOfAddress: Joi.string().required(),
    identification: Joi.object().keys({
        idType: Joi.string().required().valid(...Object.values(IDTypes)),
        idNumber: Joi.string().required()
    }).required(),
    certifications: Joi.array().items({
        name: Joi.string().required(),
        file: Joi.string().required()
    }),
    nationality: Joi.string().required(),
    incomeLevel: Joi.string().required(),
    occupation: Joi.string().required(),
    phoneNumber: Joi.string().pattern(/^(?:\+234|0)[7-9][01]\d{8}$/),
    address: Joi.object().keys({
        coordinates: Joi.array().items(Joi.number()),
        formattedAddress: Joi.string().required()
    })
};

const agentKycBody: Record<keyof KYCInformation, any> = {
    proofOfAddress: Joi.string().required(),
    identification: Joi.object().keys({
        idType: Joi.string().required().valid(...Object.values(IDTypes)),
        idNumber: Joi.string().required()
    }).required(),
    certifications: Joi.array().items({
        name: Joi.string().required(),
        file: Joi.string().required()
    }),
    nationality: Joi.string().required(),
    incomeLevel: Joi.string().required(),
    occupation: Joi.string().required(),
    phoneNumber: Joi.string().pattern(/^(?:\+234|0)[7-9][01]\d{8}$/),
    isCompany: Joi.boolean(),
    companyInformation: Joi.when("isCompany", {
        is: true,
        then: Joi.object().keys({
            name: Joi.string().required(),
            registerationNumber: Joi.string().required(),
            address: Joi.object().keys({
                city: Joi.string().required(),
                state: Joi.string().required(),
                location: Joi.object().keys({
                    coordinates: Joi.array().items(Joi.number()),
                    formattedAddress: Joi.string().required()
                })
            })
        }),
        otherwise: Joi.any().strip()
    }),
    address: Joi.object().keys({
        coordinates: Joi.array().items(Joi.number()),
        formattedAddress: Joi.string().required()
    })
};


export const clientKYC = {
    body: Joi.object().keys(clientKycBody),
};

export const agentKYC = {
    body: Joi.object().keys(agentKycBody),
};
