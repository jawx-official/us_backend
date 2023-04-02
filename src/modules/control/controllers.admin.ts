import { Request, Response, RequestHandler } from 'express'
import Ctrl from '@modules/ctrl'
import { BadInputFormatException } from '@src/exceptions'
import ControlService from './services.admin'

/**
 * User controller
 * @category Controllers
 */
class AdminControl extends Ctrl {
    private module: ControlService
    /**
     * @constructor
     */
    constructor(module: ControlService) {
        super()
        this.module = module;
    }

}
export default AdminControl