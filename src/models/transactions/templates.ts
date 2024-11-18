import { ApiResponse, GetById, serverClient } from "../apiClient";
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

export const insertTemplate = ({ data }: { data: Template }) => {
    return serverClient.post<TemplateResult>('/templates', data)
}

export const getTemplate = ({ id }: GetById) => {
    return serverClient.get<TemplateResult>('/templates', {
        params: {
            id
        }
    })
}