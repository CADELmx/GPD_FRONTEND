import { ApiResponse, CreateManyResult, GetById, serverClient } from "../apiClient";
import { CreateEducationalProgram, EducationalProgram } from "../types/educational-program";

export interface EducationalProgramResult extends ApiResponse {
    data: EducationalProgram
}

export interface EducationalProgramsResult extends ApiResponse {
    data: EducationalProgram[]
}

export interface EducationalProgramsImportResult {
    data: EducationalProgram[]
}

export const getEducationalPrograms = () => {
    return serverClient.get<EducationalProgramsResult>('/educational-programs')
}

export const createEducationalProgram = ({ data }: { data: CreateEducationalProgram }) => {
    return serverClient.post<EducationalProgramResult>('/educational-programs', data)
}

export const createManyEducationalPrograms = ({ areaId, data }: { areaId: number, data: CreateEducationalProgram[] }) => {
    return serverClient.post<CreateManyResult>('/educational-programs/many', data, {
        params: {
            id: areaId
        }
    })
}

export const updateEducationalProgram = ({ id, data }: { id: number, data: CreateEducationalProgram }) => {
    return serverClient.put<EducationalProgramResult>(`/educational-programs/${id}`, data)
}

export const deleteEducationalProgram = ({ id }: GetById) => {
    return serverClient.delete<EducationalProgramResult>(`/educational-programs/${id}`)
}