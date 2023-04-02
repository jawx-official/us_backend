import { Router as expressRouter } from 'express'
import { UserController } from '@modules/controllers'
/**
 * auth routes
 * @category Routers
 */
const router: expressRouter = expressRouter()


// registration
router.get(
    '/me',
    UserController.fetchMyAccount()
)

router.put(
    '/me',
    UserController.updateMyAccount()
)



export default router