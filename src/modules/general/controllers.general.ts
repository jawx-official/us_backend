import { Request, Response, RequestHandler } from 'express'
import Ctrl from '@modules/ctrl'
import { BadInputFormatException } from '@src/exceptions'
import ControlService from './services.general'
import MediaService from '@modules/media/services.media'
import fileUpload = require('express-fileupload')
import e = require('express')

/**
 * User controller
 * @category Controllers
 */
class GeneralController extends Ctrl {
    private module: ControlService
    private media: MediaService;
    /**
     * @constructor
     */
    constructor(module: ControlService, media: MediaService) {
        super()
        this.module = module;
        this.media = media;
    }


    uploadFile(): RequestHandler {
        return async (req: Request, res: Response): Promise<void> => {
            try {
                const { files } = req
                if (files && files.file) {
                    if (!Array.isArray(files.file)) {
                        const media = await this.media.saveMedia(files.file as fileUpload.UploadedFile)
                        this.ok(res, 'Media saved successfully', media)
                    } else {
                        this.ok(res, 'Could not upload')
                    }
                } else {
                    this.ok(res, 'Upload failed.')
                }
            } catch (error) {
                this.handleError(error, req, res)
            }
        }
    }
}
export default GeneralController