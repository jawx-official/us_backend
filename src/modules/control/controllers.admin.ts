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

    fetchPendingApprovalUsers(): RequestHandler {
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

    fetchUserApplication(): RequestHandler {
        return async (req: Request, res: Response): Promise<void> => {
            try {
                const { userId } = req.params;
                const application = await this.module.fetchUserApplication(userId)
                this.ok(res, "This is the application you requested", application)
            } catch (error) {
                this.handleError(error, req, res)
            }
        }
    }


    reviewApplication(): RequestHandler {
        return async (req: Request, res: Response): Promise<void> => {
            try {
                const { userId } = req.params;
                const { review } = req.body
                const application = await this.module.reviewApplication(userId, review)
                this.ok(res, "Your review has been saved", application)
            } catch (error) {
                this.handleError(error, req, res)
            }
        }
    }

}
export default AdminControl