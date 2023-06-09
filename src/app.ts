import { join } from 'path'
import { json, urlencoded } from 'body-parser'
import * as cookieParser from 'cookie-parser'
import * as express from 'express'
import * as logger from 'morgan'
import * as helmet from 'helmet'
import * as cors from 'cors'
import * as compression from 'compression'
import * as fileupload from "express-fileupload"

import AppConfig from '@configs/app'
import { ctrl } from '@modules/controllers'
import router from '@modules/routes'
import EventsManager from './utils/events'

/**
 * Express application
 */
class Application {
	/**
	 * Express application
	 */
	public express: express.Application

	/**
	 * @constructor
	 */
	constructor() {
		const eventsManager = new EventsManager();
		this.express = express()
		this.configure()
		this.handleExceptions()
		this.express.listen(AppConfig.port, () => {
			console.log(`${AppConfig.appName} is listening at port ${AppConfig.port}`)
		})
		eventsManager.init();
	}

	/**
	 * Configure express application
	 */
	private configure(): void {
		this.express.use(logger('dev'))
		this.express.use(json({ limit: AppConfig.clientBodyLimit }))
		this.express.use(urlencoded({ extended: true }))
		this.express.use(cookieParser())
		this.express.use(compression())
		this.express.use(fileupload())
		this.express.use('*', cors())
		this.express.options('*', cors())
		this.express.use(helmet())
		this.express.use('/v1', router)

	}

	/**
	 * Handles express application exceptions
	 */
	private handleExceptions(): void {
		this.express.use(ctrl.handleNotFound)
		this.express.use(ctrl.handleError)
	}
}

export default Application
