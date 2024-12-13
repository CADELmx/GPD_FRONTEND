import { ApiResponse, CreateManyResult, GetById, serverClient } from "../apiClient";
import { CreateSubject, Subject } from "../types/subject";

export interface SubjectResult extends ApiResponse {
    data: Subject
}

export interface SubjectsResult extends ApiResponse {
    data: Subject[]
}

export type SubjectGrouped = {
    period: string,
    subjects: Subject[]
}

export interface SubjectGroupedResult extends ApiResponse {
    data: SubjectGrouped[]
}

export const getSubject = ({ id }: GetById) => {
    return serverClient.get<SubjectResult>('/subject/', {
        params: {
            id
        }
    })
}

export const getSubjects = () => {
    return serverClient.get<SubjectsResult>('/subject')
}

export const getSubjectsByEducationalProgram = ({ id }: GetById) => {
    return serverClient.get<SubjectsResult>('/subject', {
        params: {
            programid: id
        }
    })
}

export const getSubjectsByProgramGroupedByPeriod = ({ id }: GetById) => {
    return serverClient.get<SubjectGroupedResult>('/subject/grouped', {
        params: {
            id
        }
    })
}

export const createSubject = ({ data }: { data: CreateSubject }) => {
    return serverClient.post<SubjectResult>('/subject', data)
}

export const createManySubjects = ({ educationalProgramId, data }: { educationalProgramId: number, data: CreateSubject[] }) => {
    return serverClient.post<CreateManyResult>('/subject/many', data, {
        params: {
            id: educationalProgramId
        }
    })
}

export const updateSubject = ({ id, data }: { id: number, data: CreateSubject }) => {
    return serverClient.put<SubjectResult>(`/subject/${id}`, data)
}

export const deleteSubject = ({ id }: GetById) => {
    return serverClient.delete<SubjectResult>(`/subject/${id}`)
}