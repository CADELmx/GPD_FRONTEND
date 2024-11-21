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
