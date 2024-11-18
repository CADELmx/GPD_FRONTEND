import { ApiResponse, serverClient } from "../apiClient";
import { Template } from "../types/template";

export interface TemplatesResult extends ApiResponse {
    data: Template[]
}

export interface TemplateResult extends ApiResponse {
    data: Template
}

export const getTemplates = async () => {
    return serverClient.get<TemplatesResult>('/templates')
}

export const insertTemplate = (template: Template) => {
    return serverClient.post<TemplateResult>('/templates', template)
}

export const getTemplate = (id: number) => {
    return serverClient.get<TemplateResult>('/templates', {
        params: {
            id
        }
    })
}