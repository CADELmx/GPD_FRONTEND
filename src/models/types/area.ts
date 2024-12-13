import { EducationalProgram } from "./educational-program";


export type CreateArea = {
    id?: number;
    name: string;
    educationalPrograms?: EducationalProgram[];
}

export type Area = CreateArea & {
    id: number;
}

export type AreaJoinEducationalPrograms = Area & {
    educationalPrograms: EducationalProgram[];
}

export type AreaEducationalProgramCount = Area & {
    _count: {
        educationalPrograms: number;
    }
}

export const DefaultArea: CreateArea = {
    id: undefined,
    name: '',
}