import { Request, Response, RequestHandler } from 'express'
import Ctrl from '@modules/ctrl'
import { BadInputFormatException } from '@src/exceptions'
import ControlService from './services.admin'

/**
 * User controller
 * @category Controllers
 */
class AdminControl extends Ctrl {
    private module: ControlService
    /**
     * @constructor
     */
    constructor(module: ControlService) {
        super()
        this.module = module;
    }

    fetchPendingApprovalArtists(): RequestHandler {
        return async (req: Request, res: Response): Promise<void> => {
            try {
                const { page = 1, limit = 1 } = req.query;
                const approvals = await this.module.pendingApprovals(Number(page as string), Number(limit as string))
                this.ok(res, "These are the pending approvals.", approvals)
            } catch (error) {
                this.handleError(error, req, res)
            }
        }
    }

    fetchArtistApplication(): RequestHandler {
        return async (req: Request, res: Response): Promise<void> => {
            try {
                const { artistId } = req.params;
                const application = await this.module.fetchArtistApplication(artistId)
                this.ok(res, "This is the application you requested", application)
            } catch (error) {
                this.handleError(error, req, res)
            }
        }
    }


    reviewApplication(): RequestHandler {
        return async (req: Request, res: Response): Promise<void> => {
            try {
                const { artistId } = req.params;
                const { review } = req.body
                const application = await this.module.reviewApplication(artistId, review)
                this.ok(res, "Your review has been saved", application)
            } catch (error) {
                this.handleError(error, req, res)
            }
        }
    }

}
export default AdminControl