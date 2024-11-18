import { ApiResponse, GetById, serverClient } from "../apiClient";
import { Activity } from "../types/activity";
import { PartialTemplate } from "../types/partial-template";
import { insertActivities } from "./activity";

export interface PartialTemplateResult extends ApiResponse {
    data: PartialTemplate
}

export interface PartialTemplatesResult extends ApiResponse {
    data: PartialTemplate[]
}

export const insertPartialTemplate = (
    { data }: { data: PartialTemplate }
) => {
    return serverClient.post<PartialTemplateResult>('/templates', data)
}

export const getPartialTemplates = () => {
    return serverClient.get<PartialTemplatesResult>('/partial-templates')
}

export const getPartialTemplate = (
    { id }: GetById
) => {
    return serverClient.get<PartialTemplateResult>('/partial-templates', {
        params: {
            id
        }
    })
}

export const setPartialTemplateStatus = (
    { id, status }: { id: number, status: string }
) => {
    return serverClient.put<PartialTemplateResult>('/partial-template', status, {
        params: {
            id
        }
    })
}

export const getPartialTemplateJoinActivity = ({ id }: GetById) => {
    return serverClient.get<PartialTemplateResult>('/partial-templates/activities', {
        params: {
            id
        }
    })
}

export const getPartialTemplatesJoinActivities = () => {
    return serverClient.get<PartialTemplatesResult>('/partial-templates/activities')
}

export const getPartialTemplateJoinComment = ({ id }: GetById) => {
    return serverClient.get('/partial-templates/comments', {
        params: {
            id
        }
    })
}

export const insertPartialTemplateAndActivities = async (
    { data: {
        activities,
        template
    } }: {
        data: {
            activities: Activity[],
            template: PartialTemplate
        }
    }) => {
    const {
        data: {
            data: templateData,
            error: templateError,
            message: templateMessage
        }
    } = await insertPartialTemplate({ data: template })
    if (templateError) return {
        error: templateError,
        data: null,
        message: templateMessage
    }
    const { id } = templateData
    const newActivities = activities.map(activity => ({ ...activity, partialTemplateId: id }))
    const {
        data: {
            data: activitiesData,
            error: activitiesError,
        } } = await insertActivities({ data: newActivities })
    if (activitiesError) return {
        error: activitiesError,
        data: null,
        message: 'Error al insetar las actividades, solo se insertó la plantilla parcial vacía'
    }
    return {
        data: {
            template: templateData,
            activities: activitiesData
        },
        error: null,
        message: 'Resgistro exitoso'
    }
}
