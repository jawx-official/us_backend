import { Router as expressRouter } from 'express'
import { AuthController } from '@modules/controllers'
import { validate } from '@middlewares/validate/index';
import { forgot, googleLogin, googleRegister, login, register, resend, reset, verify } from '@modules/auth/validators.auth';

/**
 * auth routes
 * @category Routers
 */
const router: expressRouter = expressRouter()


// registration
router.post(
    '/signup',
    validate(register),
    AuthController.register()
)
router.post(
    '/resend-verification',
    validate(resend),
    AuthController.resend()
)

router.post(
    '/verify-account',
    validate(verify),
    AuthController.verifyAccount()
)

// password recovery
router.post(
    '/forgot-password',
    validate(forgot),
    AuthController.forgotPassword()
)
router.post(
    '/reset-password',
    validate(reset),
    AuthController.resetPassword()
)

// login
router.post('/login', validate(login), AuthController.login())


// // google
router.post(
    '/login-with-google',
    validate(googleLogin),
    AuthController.googleLogin()
)

// // google
router.post(
    '/register-with-google',
    validate(googleRegister),
    AuthController.googleRegister()
)


export default router