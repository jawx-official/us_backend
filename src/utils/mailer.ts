import { join } from 'path'
import { existsSync, readFileSync } from 'fs'
import { ServerClient } from "postmark"
const ClientId = "3f637f81-9dc0-4217-95d1-79f8ce8758ec"
export interface MailInput {
    template: string;
    templateValues: Record<string, any>;
    destination: string;
    subject: string;
}


export async function getTemplate(
    template: string,
    data: any
): Promise<string> {
    let path = join(__dirname, 'templates/' + template + '.hbs')
    let fileExists = existsSync(path)
    let content = ''

    if (fileExists) {
        let contents = readFileSync(path, 'utf-8')
        for (var i in data) {
            var x = '{{' + i + '}}'
            while (contents.indexOf(x) > -1) {
                // @ts-ignore
                contents = contents.replace(x, data[i])
            }
        }
        content = contents
    }
    return content
}
/**
 * Create an object composed of the picked object properties
 * @param {MailInput} object
 */
const sendMail = async ({ template, destination, subject, templateValues }: MailInput) => {
    try {
        var client = new ServerClient(ClientId);
        const content = await getTemplate(template, templateValues)
        await client.sendEmail({
            "From": `Stage Seekers<${process.env.MAIL_SENDER}>`,
            "To": destination,
            "Subject": subject,
            "HtmlBody": content,
            "MessageStream": "outbound"
        });
    } catch (error) {
        console.log(error);

    }
}

export default sendMail;
