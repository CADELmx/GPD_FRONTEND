import { Subject } from "./subject";

export type CreateEducationalProgram = {
    id?: number;
    abbreviation: string;
    description: string;
    areaId?: number;
    subjects?: Subject[]
}

export type EducationalProgram = CreateEducationalProgram & {
    id: number;
    areaId: number;
}

export type EducationalProgramJoinSubject = EducationalProgram & {
    subjects: Subject[]
}

export const DefaultEducationalProgram: CreateEducationalProgram = {
    areaId: undefined,
    abbreviation: '',
    description: '',
}