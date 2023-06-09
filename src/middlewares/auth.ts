import { RequestHandler, Request, Response, NextFunction } from 'express'
import Ctrl from '@modules/ctrl'
import { Exception, InvalidAccessCredentialsException } from '@exceptions/index'
import { User } from "@modules/services";
import { AccountTypeEnums } from '@src/modules/users/interfaces.users';
/**
 * Middleware to handles token authentication
 * @category Controllers
 */
class AuthMiddleware extends Ctrl {
	/**
	 * @return {ValidationChain[]}
	 */
	verify(): RequestHandler {
		return async (
			req: Request,
			res: Response,
			next: NextFunction
		): Promise<void> => {
			try {

				let token: string | undefined = req.headers['authorization']
				if (!token || !token.includes('Bearer')) {
					throw new InvalidAccessCredentialsException(
						'Invalid bearer token provided'
					)
				}
				token = token.split('Bearer ')[1]
				const account = await User.fetchUserWithToken(token);
				req.user = account;
				next()
			} catch (ex) {
				let error = new Exception(ex.message)
				this.handleError(error, req, res)
			}
		}
	}

	verifyAdmin(): RequestHandler {
		return async (
			req: Request,
			res: Response,
			next: NextFunction
		): Promise<void> => {
			try {

				if (!req.user) {
					throw new InvalidAccessCredentialsException();
				}
				if (req.user.accountType === AccountTypeEnums.ADMIN) {
					next()
				} else {
					throw new InvalidAccessCredentialsException("Only admins can access these resources");
				}
			} catch (ex) {
				let error = new Exception(ex.message)
				this.handleError(error, req, res)
			}
		}
	}

	verifyClients(): RequestHandler {
		return async (
			req: Request,
			res: Response,
			next: NextFunction
		): Promise<void> => {
			try {

				if (!req.user) {
					throw new InvalidAccessCredentialsException();
				}
				if (req.user.accountType === AccountTypeEnums.CLIENT) {
					next()
				} else {
					throw new InvalidAccessCredentialsException("Only clients can access these resources");
				}
			} catch (ex) {
				let error = new Exception(ex.message)
				this.handleError(error, req, res)
			}
		}
	}

	verifyAgents(): RequestHandler {
		return async (
			req: Request,
			res: Response,
			next: NextFunction
		): Promise<void> => {
			try {

				if (!req.user) {
					throw new InvalidAccessCredentialsException();
				}
				if (req.user.accountType === AccountTypeEnums.AGENT) {
					next()
				} else {
					throw new InvalidAccessCredentialsException("Only agents can access these resources");
				}
			} catch (ex) {
				let error = new Exception(ex.message)
				this.handleError(error, req, res)
			}
		}
	}



	verifyLandlords(): RequestHandler {
		return async (
			req: Request,
			res: Response,
			next: NextFunction
		): Promise<void> => {
			try {

				if (!req.user) {
					throw new InvalidAccessCredentialsException();
				}
				if (req.user.accountType === AccountTypeEnums.LANDLORD) {
					next()
				} else {
					throw new InvalidAccessCredentialsException("Only landlords can access these resources");
				}
			} catch (ex) {
				let error = new Exception(ex.message)
				this.handleError(error, req, res)
			}
		}
	}



}

export default AuthMiddleware
