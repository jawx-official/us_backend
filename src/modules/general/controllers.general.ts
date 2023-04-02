import { Request, Response, RequestHandler } from 'express'
import Ctrl from '@modules/ctrl'
import { BadInputFormatException } from '@src/exceptions'
import ControlService from './services.general'

/**
 * User controller
 * @category Controllers
 */
class GeneralController extends Ctrl {
    private module: ControlService
    /**
     * @constructor
     */
    constructor(module: ControlService) {
        super()
        this.module = module;
    }

    fetchApprovedArtists(): RequestHandler {
        return async (req: Request, res: Response): Promise<void> => {
            try {
                const { page = 1, limit = 20 } = req.query;
                const approvals = await this.module.approvedArtists(Number(page as string), Number(limit as string))
                this.ok(res, "These are the approved artists.", approvals)
            } catch (error) {
                this.handleError(error, req, res)
            }
        }
    }

    fetchArtistAccount(): RequestHandler {
        return async (req: Request, res: Response): Promise<void> => {
            try {
                const { id } = req.params;
                const data = await this.module.singleArtist(id);
                this.ok(res, "artist found", data)
            } catch (error) {
                this.handleError(error, req, res)
            }
        }
    }

}
export default GeneralController