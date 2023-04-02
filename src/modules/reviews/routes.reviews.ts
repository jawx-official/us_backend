import { Request, Response, Router as expressRouter } from 'express'
import { ReviewController } from '../controllers'
const router: expressRouter = expressRouter()

router.post("/", ReviewController.createReview())

export default router
