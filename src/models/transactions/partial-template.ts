import { ApiResponse, GetById, serverClient } from "../apiClient";
import { CreateActivity } from "../types/activity";
import { CreatePartialTemplate, PartialTemplate, PartialTemplateJoinActivity, PartialTemplateJoinComment, UpdatePartialTemplate } from "../types/partial-template";
import { insertActivities } from "./activity";


export interface PartialTemplateResult extends ApiResponse {
    data: PartialTemplate
}

export interface PartialTemplatesResult extends ApiResponse {
    data: PartialTemplate[]
}

export interface PartialTemplateJoinActivityResult extends ApiResponse {
    data: PartialTemplateJoinActivity
}

export interface PartialTemplatesJoinActivitiesResult extends ApiResponse {
    data: PartialTemplateJoinActivity[]
}

export interface PartialTemplateJoinCommentResult extends ApiResponse {
    data: PartialTemplateJoinComment
}

export interface PartialTemplatesJoinCommentsResult extends ApiResponse {
    data: PartialTemplateJoinComment[]
}

export const insertPartialTemplate = (
    { data }: { data: CreatePartialTemplate }
) => {
    return serverClient.post<PartialTemplateResult>('/templates', data)
}

export const insertPartialTemlatesWithActivities = ({ data }: { data: CreatePartialTemplate }) => {
    return serverClient.post<PartialTemplateResult>('/partial-templates/activities', {
        partialTemplate: data
    })
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

export const updatePartialTemplate = (
    { id, data }: { id: number, data?: UpdatePartialTemplate }
) => {
    return serverClient.put<PartialTemplateResult>(`/partial-templates/${id}`, data)
}

export const getPartialTemplateJoinActivity = ({ id }: GetById) => {
    return serverClient.get<PartialTemplateJoinActivityResult>('/partial-templates/activities', {
        params: {
            id
        }
    })
}

export const getPartialTemplatesJoinActivities = () => {
    return serverClient.get<PartialTemplatesJoinActivitiesResult>('/partial-templates/activities')
}

export const getPartialTemplatesJoinComments = () => {
    return serverClient.get<PartialTemplateJoinCommentResult>('/partial-templates/comments')
}

export const getPartialTemplateJoinComment = ({ id }: GetById) => {
    return serverClient.get<PartialTemplatesJoinCommentsResult>('/partial-templates/comments', {
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
            activities: CreateActivity[],
            template: CreatePartialTemplate
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
    const newActivities: CreateActivity[] = activities.map(activity => ({ ...activity, partialTemplateId: id }))
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
