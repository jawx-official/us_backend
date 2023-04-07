import { Request, Response, Router as expressRouter } from 'express'
import AppConfig from '@configs/app'
import Auth from '@src/middlewares/auth'
import AuthRoutes from "@modules/auth/routes.auth"
import UserRoutes from "@modules/users/routes.user"
import AdminRoutes from "@modules/control/routes.admin"
import GeneralRoutes from "@modules/general/routes.general"
import ReviewRoutes from "@modules/reviews/routes.reviews"
import { UserController } from './controllers'
const auth = new Auth()
const router: expressRouter = expressRouter()

router.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*')
    next()
})
router.get('/', (req: Request, res: Response): void => {
    res.send(`You've reached api routes of ${AppConfig.appName}`)
})
router.use("/auth", AuthRoutes)
router.use("/admin", AdminRoutes)
router.use("/general", GeneralRoutes)
router.post(
    '/admin-seed',
    UserController.seedAdmin()
)
// add non-token required endpoints before this line
router.use(auth.verify())
// add endpoints that need token after this line
router.use("/users", UserRoutes)
router.use("/reviews", ReviewRoutes)

export default router
