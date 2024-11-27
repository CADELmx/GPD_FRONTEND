export type CreateSubject = {
    id?: number;
    educationalProgramId?: number;
    weeklyHours: number;
    totalHours: number;
    monthPeriod: string;
    subjectName: string;
}

export type Subject = CreateSubject & {
    id: number;
    educationalProgramId: number;
}

export const DefaultSubject: CreateSubject = {
    monthPeriod: '',
    subjectName: '',
    totalHours: 0,
    weeklyHours: 0,
    educationalProgramId: undefined,
    id: undefined
}