import { Request, Response, Router as expressRouter } from 'express'
import Auth from '@src/middlewares/auth'
import { GeneralController } from '../controllers'
const auth = new Auth()
const router: expressRouter = expressRouter()


router.post("/upload", GeneralController.uploadFile())
// add non-token required endpoints before this line
router.use(auth.verify())
// add endpoints that need token after this line

export default router
