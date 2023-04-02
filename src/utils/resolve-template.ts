import {join} from 'path'
import {existsSync, readFileSync} from 'fs'
export type Template = {
	name?: string
	url?: string
	email?: string
	company?: string
	role?: string
	amount?: string
}
export async function getTemplate(
	template: string,
	data: Template
): Promise<any> {
    const templates = [
        {
            name: "referal",
            id: 3059070
        },
        {
            name: "charge-receipt",
            id: 3059067
        },
        {
            name: 'free-credit',
            id: 3059069
        },
        {
            name: 'alert-condition-1',
            id: 3059065
        },
        {
            name: 'alert-condition-2',
            id: 3060728
        },
        {
            name: 'alert-condition-3',
            id: 3059054
        },
        {
            
            name: 'alert-condition-4',
            id: 3059064
        }
    ]
    let templateNode =  templates.find(x=>x.name===template)
    let content = {
        variables: data,
        TemplateID: templateNode?templateNode.id:3059213
    }
	return content
  }
