import { ApiResponse, GetById, serverClient } from "../apiClient";
import { Area } from "../types/area";

export interface AreaResult extends ApiResponse {
    data: Area
}

export interface AreasResult extends ApiResponse {
    data: Area[]
}

export const getArea = ({ id }: GetById) => {
    return serverClient.get<AreaResult>('/areas', {
        params: {
            id
        }
    })
}

export const getAreas = () => {
    return serverClient.get<AreasResult>('/areas')
}

export const getAreasJoinEducationalPrograms = () => {
    return serverClient.get<AreasResult>('/areas/educational-programs')
}

export const createArea = (area) => {
    return serverClient.post<AreaResult>('/areas', area)
}

export const updateArea = (id, newArea) => {
    return serverClient.put<AreaResult>(`/areas/${id}`, newArea)
}

export const deleteArea = (id) => {
    return serverClient.delete<AreaResult>(`/areas/${id}`)
}