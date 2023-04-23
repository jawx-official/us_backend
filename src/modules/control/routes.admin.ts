import { Request, Response, Router as expressRouter } from 'express'
import Auth from '@src/middlewares/auth'
import { AdminController } from '../controllers'
const auth = new Auth()
const router: expressRouter = expressRouter()

router.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*')
    next()
})

// add non-token required endpoints before this line
router.use(auth.verifyAdmin())
// add endpoints that need token after this line
router.get("/approvals", AdminController.fetchPendingApprovalUsers())

router.get("/approvals/:userId", AdminController.fetchUserApplication())
router.put("/approvals/:userId", AdminController.reviewApplication())

// property approvals
router.get("/property-approvals", AdminController.fetchPendingApprovalProperties())

router.get("/property-approvals/:propertyId", AdminController.fetchPropertyApplication())
router.put("/property-approvals/:propertyId", AdminController.reviewPropertyApplication())

export default router
