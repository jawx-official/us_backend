import { Router as expressRouter } from 'express'
import { UserController } from '@modules/controllers'
import { validate } from '@middlewares/validate/index';
import { agentKYC, clientKYC } from '@modules/users/validators.users';
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

router.put(
    '/agent/kyc',
    validate(agentKYC),
    UserController.updateKYC()
)

router.put(
    '/client/kyc',
    validate(clientKYC),
    UserController.updateKYC()
)



export default router