import { ApiResponse, GetById, serverClient } from "../apiClient";
import { CreateTemplate, Template, TemplateJoinPartialTemplate } from "../types/template";

export interface TemplatesResult extends ApiResponse {
    data: Template[]
}

export interface TemplateResult extends ApiResponse {
    data: Template
}

export interface TemplateJoinPartialTemplateResult extends ApiResponse {
    data: TemplateJoinPartialTemplate[]
}

export const getTemplates = async () => {
    return serverClient.get<TemplatesResult>('/templates')
}

export const insertTemplate = ({ data }: { data: CreateTemplate }) => {
    return serverClient.post<TemplateResult>('/templates', data)
}

export const getTemplate = ({ id }: GetById) => {
    return serverClient.get<TemplateResult>('/templates', {
        params: {
            id
        }
    })
}

export const getTemplateJoinPartialTemplates = ({ id }: GetById) => {
    return serverClient.get<TemplateJoinPartialTemplateResult>('/templates/', {
        params: {
            id
        }
    })
} 