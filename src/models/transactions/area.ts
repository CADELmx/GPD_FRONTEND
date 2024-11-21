import { getCookie } from "cookies-next";
import { ApiResponse, GetById, serverClient } from "../apiClient";
import { Area, AreaJoinEducationalPrograms, CreateArea } from "../types/area";

export interface AreaResult extends ApiResponse {
    data: Area
}

export interface AreasResult extends ApiResponse {
    data: Area[]
}

export interface AreasJoinEducationalProgramsResult extends ApiResponse {
    data: AreaJoinEducationalPrograms[]
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
    return serverClient.get<AreasJoinEducationalProgramsResult>('/areas/educational-programs')
}

export const createArea = ({ data }: { data: CreateArea }) => {
    return serverClient.post<AreaResult>('/areas', data)
}

export const updateArea = ({ id, data }: { id: number, data: CreateArea }) => {
    return serverClient.put<AreaResult>(`/areas/${id}`, data)
}

export const deleteArea = ({ id }: GetById) => {
    return serverClient.delete<AreaResult>(`/areas/${id}`)
}