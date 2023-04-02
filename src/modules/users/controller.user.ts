import { Request, Response, RequestHandler } from 'express'
import Ctrl from '@modules/ctrl'
import UserService from '@modules/users/services.users'
import MediaService from '@modules/media/services.media'
import { BadInputFormatException } from '@src/exceptions'
import { PortfolioInterface } from './interfaces.portfolio'
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

    updateMyAvailability(): RequestHandler {
        return async (req: Request, res: Response): Promise<void> => {
            try {
                const { user, body: { update } } = req;
                if (!user) throw new BadInputFormatException("Could not verify your account")
                const updatedCalendar = await this.module.updateMyAvailability(user, update)
                this.ok(res, "Availability updated.", updatedCalendar.available)
            } catch (error) {
                this.handleError(error, req, res)
            }
        }
    }

    fetchMyAvailability(): RequestHandler {
        return async (req: Request, res: Response): Promise<void> => {
            try {
                const { user } = req;
                if (!user) throw new BadInputFormatException("Could not verify your account")
                const calendar = await this.module.fetchMyAvailability(user)
                this.ok(res, "Availability found.", calendar.available)
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

    updateMyPortfolio(): RequestHandler {
        return async (req: Request, res: Response): Promise<void> => {
            try {
                const { user, body, files } = req;
                let mediaData = [];
                if (!user) throw new BadInputFormatException("token not verified")
                if (files) {
                    if (Array.isArray(files.portfolio_images) && files.portfolio_images.length > 0) {
                        mediaData = await Promise.all(files.portfolio_images.map((file: fileUpload.UploadedFile) => {
                            return this.media.saveMedia(file)
                        }))

                        const portfolio = await this.module.updateMyPortfolio(user, {
                            gallery: [...mediaData.map(e => e._id), ...JSON.parse(body.gallery)],
                            embedded: JSON.parse(body.content)
                        })
                        this.ok(res, "Portfolio updated.", portfolio)
                    } else {
                        let fileList: fileUpload.UploadedFile[] = [files.portfolio_images as fileUpload.UploadedFile];
                        mediaData = await Promise.all(fileList.map((file: fileUpload.UploadedFile) => {
                            return this.media.saveMedia(file)
                        }))

                        const portfolio = await this.module.updateMyPortfolio(user, {
                            gallery: [...mediaData.map(e => e._id), ...JSON.parse(body.gallery)],
                            embedded: JSON.parse(body.content)
                        })
                        this.ok(res, "Portfolio updated.", portfolio)
                    }
                } else {
                    const portfolio = await this.module.updateMyPortfolio(user, {
                        embedded: JSON.parse(body.content),
                        gallery: JSON.parse(body.gallery)
                    })
                    this.ok(res, "Portfolio updated.", portfolio)
                }
            } catch (error) {
                this.handleError(error, req, res)
            }
        }
    }

    fetchMyPortfolio(): RequestHandler {
        return async (req: Request, res: Response): Promise<void> => {
            try {
                const { user } = req;
                if (!user) throw new BadInputFormatException("Could not verify your account")
                const portfolio = await this.module.fetchMyPortfolio(user)
                this.ok(res, "Portfolio found.", portfolio)
            } catch (error) {
                this.handleError(error, req, res)
            }
        }
    }

    deletePortfolioMedia(): RequestHandler {
        return async (req: Request, res: Response): Promise<void> => {
            try {
                await this.media.deleteMedia(req.params.mediaId)
                this.ok(res, "Media removed.")
            } catch (error) {
                this.handleError(error, req, res)
            }
        }
    }

    replyApplicationReview(): RequestHandler {
        return async (req: Request, res: Response): Promise<void> => {
            try {
                const { user, body } = req;
                const { review } = body
                if (!user) throw new BadInputFormatException("Could not verify your account")
                const app = await this.module.replyApplicationReview(user, review)
                this.ok(res, "Review replied to.", app)
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