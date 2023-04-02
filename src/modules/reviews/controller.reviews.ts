import { Request, Response, RequestHandler } from 'express'
import Ctrl from '@modules/ctrl'
import { BadInputFormatException } from '@src/exceptions'
import ReviewService from './services.reviews'

/**
 * User controller
 * @category Controllers
 */
class ReviewController extends Ctrl {
    private module: ReviewService
    /**
     * @constructor
     */
    constructor(module: ReviewService) {
        super()
        this.module = module;
    }

    createReview(): RequestHandler {
        return async (req: Request, res: Response): Promise<void> => {
            try {
                const { user, body } = req;
                if (!user) throw new BadInputFormatException("User account not decoded");
                const savedReview = await this.module.saveReview(body.review, user);
                this.ok(res, "Your review has been saved", savedReview)
            } catch (error) {
                this.handleError(error, req, res)
            }
        }
    }

}
export default ReviewController