import { ApiResponse, CreateManyResult, GetById, serverClient } from "../apiClient";
import { EducationalProgram } from "../types/educational-program";

export interface EducationalProgramResult extends ApiResponse {
    data: EducationalProgram
}

export interface EducationalProgramsResult extends ApiResponse {
    data: EducationalProgram[]
}

export const getEducationalPrograms = () => {
    return serverClient.get<EducationalProgramsResult>('/educational-programs')
}

export const createEducationalProgram = ({ data }: { data: EducationalProgram }) => {
    return serverClient.post<EducationalProgramResult>('/educational-programs', data)
}

export const createManyEducationalPrograms = ({ areaId, data }: { areaId: number, data: EducationalProgram[] }) => {
    return serverClient.post<CreateManyResult>('/educational-programs/many', data, {
        params: {
            id: areaId
        }
    })
}

export const updateEducationalProgram = ({ id, data }: { id: number, data: EducationalProgram }) => {
    return serverClient.put<EducationalProgramResult>(`/educational-programs/${id}`, data)
}

export const deleteEducationalProgram = ({ id }: GetById) => {
    return serverClient.delete<EducationalProgramResult>(`/educational-programs/${id}`)
}