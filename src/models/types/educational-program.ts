export type CreateEducationalProgram = {
    id?: number;
    abbreviation: string;
    description: string;
    areaId?: number;
}

export type EducationalProgram = CreateEducationalProgram & {
    id: number;
    areaId: number;
}