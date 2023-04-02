import * as Joi from 'joi';
import { NewAccount, LoginInput } from '@modules/auth/interfaces.auth';
import { AccountTypeEnums } from '../users/interfaces.users';

const registerBody: Record<keyof NewAccount, any> = {
    email: Joi.string().required().email(),
    password: Joi.string().required().regex(/[A-Z]/).message("must contain one uppercase")
        .regex(/([a-z])/).message("must contain one lowercase")
        .regex(/(\d)/).message("must contain one number")
        .regex(/(\W)/).message("must contain one special character"),
    name: Joi.string().required(),
    country: Joi.string().required(),
    accountType: Joi.string().required().valid(...Object.values(AccountTypeEnums))
};

const LoginBody: Record<keyof LoginInput, any> = {
    email: Joi.string().required().email(),
    password: Joi.string().required(),
    admin: Joi.boolean().optional()
};

export const register = {
    body: Joi.object().keys(registerBody),
};

export const login = {
    body: Joi.object().keys(LoginBody),
};

export const resend = {
    body: Joi.object().keys({
        email: Joi.string().required().email({ tlds: false })
    }),
};

export const verify = {
    body: Joi.object().keys({
        token: Joi.string().required().min(6).max(6)
    }),
};

export const reset = {
    body: Joi.object().keys({
        password: Joi.string().required().regex(/[A-Z]/).message("must contain one uppercase")
            .regex(/([a-z])/).message("must contain one lowercase")
            .regex(/(\d)/).message("must contain one number")
            .regex(/(\W)/).message("must contain one special character"),
        token: Joi.string().required().min(6).max(6)
    }),
};

export const forgot = {
    body: Joi.object().keys({
        email: Joi.string().required().email({ tlds: false })
    }),
};

export const googleLogin = {
    body: Joi.object().keys({
        access_token: Joi.string().required()
    }),
};

export const googleRegister = {
    body: Joi.object().keys({
        accountType: Joi.string().required().valid(...Object.values(AccountTypeEnums)),
        country: Joi.string().required(),
        access_token: Joi.string().required(), referalCode: Joi.string().optional(), inviteId: Joi.string().optional()
    }),
};
