import { Model } from 'mongoose'
import Module from '@modules/module'
import { S3 } from 'aws-sdk'
import {
    InvalidAccessCredentialsException,
} from '@exceptions/index'
import { MediaInterface, MediaServiceInputProps } from './interfaces.media'
import { Readable, PassThrough, Stream } from 'stream'
import * as ffmpeg from "fluent-ffmpeg"
import * as fileUpload from 'express-fileupload'

class MediaService extends Module {
    private media: Model<MediaInterface>

    constructor(props: MediaServiceInputProps) {
        super()
        this.media = props.media
    }

    private bufferToStream(buffer: Buffer): Readable {
        const readable = new Readable()
        readable._read = () => { }
        readable.push(buffer)
        readable.push(null)
        return readable
    }

    private convertImage(image: Readable, outputFormat: string): Promise<Buffer> {
        return new Promise((resolve, reject) => {
            const chunks: Buffer[] = []
            const passthrough = new PassThrough()
            ffmpeg()
                .input(image)
                .outputFormat(outputFormat)
                .on("error", reject)
                .stream(passthrough, { end: true })
            passthrough.on("data", data => chunks.push(data))
            passthrough.on("error", reject)
            passthrough.on("end", () => {
                const originalImage = Buffer.concat(chunks)
                const editedImage = originalImage
                    // copy everything after the last 4 bytes into the 4th position
                    .copyWithin(4, -4)
                    // trim off the extra last 4 bytes ffmpeg added
                    .slice(0, -4)
                return resolve(editedImage)
            })
        })
    }

    private async deleteFromS3(mediaId: string) {
        const s3Client = new S3({
            credentials: {
                accessKeyId: process.env.AWS_ACCESS_KEY || '',
                secretAccessKey: process.env.AWS_ACCESS_SECRET || ""
            },
            s3ForcePathStyle: true,
        })
        await s3Client.deleteObject({
            Bucket: process.env.AWS_BUCKET_NAME || '',
            Key: mediaId,
        }).promise().then(async (data) => {
            // delete media with id=mediaId
            await this.media.findByIdAndDelete(mediaId);
            // pull all media from property where id is mediaId
        }).catch(async (err) => {
        })
    }


    private async uploadToS3(mediaId: string, file: fileUpload.UploadedFile, newFileName: string) {
        const s3Client = new S3({
            credentials: {
                accessKeyId: process.env.AWS_ACCESS_KEY || '',
                secretAccessKey: process.env.AWS_ACCESS_SECRET || ""
            },
            s3ForcePathStyle: true,
        })
        const stream = this.bufferToStream(file.data);
        const output = await this.convertImage(stream, "webp")
        await s3Client.upload({
            ContentType: "image/webp",
            Bucket: process.env.AWS_BUCKET_NAME || '',
            Key: newFileName,
            Body: output
        }).promise().then(async (data) => {
            await this.media.findByIdAndUpdate(mediaId, { $set: { url: data.Location, aws_id: data.Key } });
        }).catch(async (err) => {
            if (err) {
                console.log(err);

                // delete media with id=mediaId
                await this.media.findByIdAndDelete(mediaId);
                // pull all media from property where id is mediaId
            }
        })
    }



    public async saveMedia(file: fileUpload.UploadedFile): Promise<MediaInterface> {
        const new_media = new this.media({
            file_type: "image/webp",
        })
        let fileName = new_media._id + ".webp"
        //  + file.mimetype.split('/')[1];
        new_media.url = process.env.AWS_S3_BASE_URL + 'stage-seekers-0/' + fileName;
        await new_media.save()
        // upload to aws
        this.uploadToS3(new_media._id, file, fileName);
        return new_media;
    }

    public async deleteMedia(mediaId: string): Promise<void> {
        await this.deleteFromS3(mediaId)
    }

}
export default MediaService