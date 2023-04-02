import { Request, Response, RequestHandler } from 'express'
import Ctrl from '@modules/ctrl'
import UserService from '@modules/users/services.users'
import MediaService from '@modules/media/services.media'
import { BadInputFormatException } from '@src/exceptions'
import { MediaInterface } from '../media/interfaces.media'
import fileUpload = require('express-fileupload')

/**
 * User controller
 * @category Controllers
 */
class UserCtrl extends Ctrl {
    private module: UserService
    private media: MediaService
    /**
     * @constructor
     */
    constructor(module: UserService, media: MediaService) {
        super()
        this.module = module;
        this.media = media;
    }
    fetchMyAccount(): RequestHandler {
        return async (req: Request, res: Response): Promise<void> => {
            try {
                this.ok(res)
            } catch (error) {
                this.handleError(error, req, res)
            }
        }
    }

    updateMyAccount(): RequestHandler {
        return async (req: Request, res: Response): Promise<void> => {
            try {
                const { user, body: { update } } = req;
                if (!user) throw new BadInputFormatException("Could not verify your account")
                const updatedUser = await this.module.updateMyUserAccount(user, update)
                this.ok(res, "Account updated.", updatedUser)
            } catch (error) {
                this.handleError(error, req, res)
            }
        }
    }


    seedAdmin(): RequestHandler {
        return async (req: Request, res: Response): Promise<void> => {
            try {
                console.log("here");

                await this.module.seedAdmin()
                this.ok(res, "Admin seeded.")
            } catch (error) {
                this.handleError(error, req, res)
            }
        }
    }

}
export default UserCtrl