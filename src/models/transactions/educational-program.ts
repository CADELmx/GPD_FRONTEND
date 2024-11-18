import { ApiResponse, CreateManyResult, serverClient } from "../apiClient";
import { EducationalProgram } from "../types/educational-program";

export interface EducationalProgramResult extends ApiResponse {
    data: EducationalProgram[]
}

export const getEducationalPrograms = () => {
    return serverClient.get<EducationalProgramResult>('/educational-programs')
}

export const createEducationalProgram = (educationalProgram: EducationalProgram) => {
    return serverClient.post<EducationalProgramResult>('/educational-programs', educationalProgram)
}

export const createManyEducationalPrograms = (areaId: number, educationalPrograms: EducationalProgram[]) => {
    return serverClient.post<CreateManyResult>('/educational-programs/many', educationalPrograms, {
        params: {
            id: areaId
        }
    })
}

export const updateEducationalProgram = (id: number, newEducationalProgram) => {
    return serverClient.put(`/educational-programs/${id}`, newEducationalProgram)
}

export const deleteEducationalProgram = (id) => {
    return serverClient.delete(`/educational-programs/${id}`)
}