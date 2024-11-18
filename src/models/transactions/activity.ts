import { ApiResponse, serverClient } from "../apiClient"
import { Activity } from "../types/activity"
import { getTemplates } from "./templates"

export interface ActivityResult extends ApiResponse {
    data: Activity
}

export interface ActivitiesResult extends ApiResponse {
    data: Activity[]
}

export const insertActivities = ({ data }: { data: Activity[] }) => {
    return serverClient.post<ActivitiesResult>('/activity/many', data)
}

export const getActivities = () => {
    return serverClient.get<ActivityResult>('/activity')
}

export const getActivitiesByPartialTemplate = ({ id }: { id: number }) => {
    return serverClient.get<ActivitiesResult>('/activity', {
        params: {
            template: id
        }
    })
}
