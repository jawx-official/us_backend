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

router.put(
    '/me/availability',
    UserController.updateMyAvailability()
)

router.get(
    '/me/availability',
    UserController.fetchMyAvailability()
)

router.put(
    '/me/portfolio',
    UserController.updateMyPortfolio()
)

router.get(
    '/me/portfolio',
    UserController.fetchMyPortfolio()
)

router.put("/reviews/reply", UserController.replyApplicationReview())

router.delete('/me/portfolio/media/:mediaId', UserController.deletePortfolioMedia())



export default router