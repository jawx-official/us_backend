import { Request, Response, RequestHandler } from 'express'
import { GoogleProfile } from "@modules/auth/interfaces.auth"
import { authGoogle } from "@modules/auth/passport";
import Ctrl from '@modules/ctrl'
import AuthService from '@modules/auth/services.auth'
/**
 * Authentication controller
 * @category Controllers
 */
class AuthCtrl extends Ctrl {
    private module: AuthService
    /**
     * @constructor
     */
    constructor(module: AuthService) {
        super()
        this.module = module
    }
    login(): RequestHandler {
        return async (req: Request, res: Response): Promise<void> => {
            try {
                const { email, password, admin } = req.body
                const acct = await this.module.login({ email, password, admin })
                this.ok(res, 'Logged in successfully', acct)
            } catch (error) {
                this.handleError(error, req, res)
            }
        }
    }

    resend(): RequestHandler {
        return async (req: Request, res: Response): Promise<void> => {
            try {
                const { email } = req.body
                await this.module.resendVerifyEmail(email)
                this.ok(res, 'Email Sent again successfully')
            } catch (error) {
                this.handleError(error, req, res)
            }
        }
    }

    register(): RequestHandler {
        return async (req: Request, res: Response): Promise<void> => {
            // create company account
            try {
                const { name,
                    email,
                    password,
                    state, city,
                    accountType
                } = req.body
                let input = {
                    email,
                    password,
                    name,
                    accountType,
                    state, city
                }
                await this.module.create(input)
                this.ok(res, 'Account Created. Confirm Account to Continue')
            } catch (error) {
                this.handleError(error, req, res)
            }
        }
    }


    verifyAccount(): RequestHandler {
        return async (req: Request, res: Response): Promise<void> => {
            try {
                const { token } = req.body
                const acct = await this.module.verifyAccount({ token })
                this.ok(res, 'Account confirmed successfully', acct)
            } catch (error) {
                this.handleError(error, req, res)
            }
        }
    }


    forgotPassword(): RequestHandler {
        return async (req: Request, res: Response): Promise<void> => {
            try {
                const { email } = req.body
                await this.module.forgotPassword({ email })
                this.ok(res, 'Password reset initiated')
            } catch (error) {
                this.handleError(error, req, res)
            }
        }
    }

    resetPassword(): RequestHandler {
        return async (req: Request, res: Response): Promise<void> => {
            try {
                const { token, password } = req.body
                await this.module.resetPassword({
                    token,
                    password
                })
                this.ok(res, 'Password reset completed')
            } catch (error) {
                // @ts-ignore
                this.handleError(error, req, res)
            }
        }
    }

    googleLogin(): RequestHandler {
        return async (req: Request, res: Response): Promise<void> => {
            try {
                const { accessToken } = req.body
                const result: GoogleProfile = await authGoogle(accessToken)
                const report = await this.module.socialLogin(result)
                this.ok(res, report.message, report.data)
            } catch (error) {
                this.handleError(error, req, res)
            }
        }
    }

    googleRegister(): RequestHandler {
        return async (req: Request, res: Response): Promise<void> => {
            try {
                const { accessToken, accountType, state, city } = req.body
                const result: GoogleProfile = await authGoogle(accessToken)
                const report = await this.module.SocialSignup(result, accountType, state, city)
                this.ok(res, report.message, report.data)
            } catch (error) {
                this.handleError(error, req, res)
            }
        }
    }
}
export default AuthCtrl