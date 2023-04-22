import { Request, Response, RequestHandler } from 'express'
import Ctrl from '@modules/ctrl'
import { BadInputFormatException, InvalidAccessCredentialsException } from '@src/exceptions'
import PropertyService from './properties.services'
import fileUpload = require('express-fileupload')
import e = require('express')
import { PropertyStatusEnums } from './properties.interfaces'

/**
 * User controller
 * @category Controllers
 */
class PropertyController extends Ctrl {
    private module: PropertyService
    /**
     * @constructor
     */
    constructor(module: PropertyService) {
        super()
        this.module = module;
    }


    createPropertyFn(): RequestHandler {
        return async (req: Request, res: Response): Promise<void> => {
            try {
                const { user, body } = req
                if (!user) throw new InvalidAccessCredentialsException()
                await this.module.createPropertyService(user, body)

            } catch (error) {
                this.handleError(error, req, res)
            }
        }
    }

    updatePropertyFn(): RequestHandler {
        return async (req: Request, res: Response): Promise<void> => {
            try {
                const { user, body } = req
                const { id } = req.params
                if (!user) throw new InvalidAccessCredentialsException()
                await this.module.updateUserPropertyByID(user, id, body)

            } catch (error) {
                this.handleError(error, req, res)
            }
        }
    }

    publishPropertyFn(): RequestHandler {
        return async (req: Request, res: Response): Promise<void> => {
            try {
                const { user } = req
                const { id } = req.params
                if (!user) throw new InvalidAccessCredentialsException()
                await this.module.publishUserPropertyByID(user, id)

            } catch (error) {
                this.handleError(error, req, res)
            }
        }
    }

    fetchUserPropertiesFn(): RequestHandler {
        return async (req: Request, res: Response): Promise<void> => {
            try {
                const { user } = req
                let { filter } = req.query
                if (filter) {
                    filter = filter as "all" | PropertyStatusEnums
                } else {
                    filter = "all"
                }

                if (!user) throw new InvalidAccessCredentialsException()
                await this.module.fetchUserProperties(user, filter)

            } catch (error) {
                this.handleError(error, req, res)
            }
        }
    }

    fetchUserPropertyFn(): RequestHandler {
        return async (req: Request, res: Response): Promise<void> => {
            try {
                const { user } = req
                const { id } = req.params
                if (!user) throw new InvalidAccessCredentialsException()
                await this.module.fetchUserPropertyByID(user, id)

            } catch (error) {
                this.handleError(error, req, res)
            }
        }
    }

    disablePropertyFn(): RequestHandler {
        return async (req: Request, res: Response): Promise<void> => {
            try {
                const { user } = req
                const { id } = req.params
                if (!user) throw new InvalidAccessCredentialsException()
                await this.module.disableUserPropertyByID(user, id)

            } catch (error) {
                this.handleError(error, req, res)
            }
        }
    }
}
export default PropertyController