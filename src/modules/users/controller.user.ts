import { Request, Response, RequestHandler } from 'express'
import Ctrl from '@modules/ctrl'
import UserService from '@modules/users/services.users'
import MediaService from '@modules/media/services.media'
import { BadInputFormatException, InvalidAccessCredentialsException } from '@src/exceptions'
import { AccountTypeEnums } from './interfaces.users'

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
                if (!req.user?._id) throw new InvalidAccessCredentialsException("You dont have the neccessary credentials");
                const acct = await this.module.fetchUserById(req.user?._id);
                this.ok(res, "Account found.", acct)
            } catch (error) {
                this.handleError(error, req, res)
            }
        }
    }

    updateMyAccount(): RequestHandler {
        return async (req: Request, res: Response): Promise<void> => {
            try {
                const { user, body: update } = req;
                if (!user) throw new BadInputFormatException("Could not verify your account")
                const updatedUser = await this.module.updateMyUserAccount(user, update)
                this.ok(res, "Account updated.", updatedUser)
            } catch (error) {
                this.handleError(error, req, res)
            }
        }
    }

    updateKYC(): RequestHandler {
        return async (req: Request, res: Response): Promise<void> => {
            try {
                const { user, body: update } = req;
                if (!user) throw new BadInputFormatException("Could not verify your account")
                let updatedUser;
                switch (user.accountType) {
                    case AccountTypeEnums.CLIENT:
                        updatedUser = await this.module.updateClientKYC(user, update)
                        this.ok(res, "KYC updated.", updatedUser)
                        break;
                    case AccountTypeEnums.AGENT:
                        updatedUser = await this.module.updateAgentKYC(user, update)
                        this.ok(res, "KYC updated.", updatedUser)
                        break;

                    default:
                        this.ok(res, "KYC updated.", updatedUser)
                        break;
                }
            } catch (error) {
                this.handleError(error, req, res)
            }
        }
    }


    seedAdmin(): RequestHandler {
        return async (req: Request, res: Response): Promise<void> => {
            try {
                await this.module.seedAdmin()
                this.ok(res, "Admin seeded.")
            } catch (error) {
                this.handleError(error, req, res)
            }
        }
    }

}
export default UserCtrl