import { v4 as uuidv4 } from 'uuid'

export type CreateActivity = {
    id?: string
    partialTemplateId?: number;
    managementType?: string;
    educationalProgramId?: number;
    activityDistribution?: string;
    stayType?: string;
    activityName?: string;
    gradeGroups: string[];
    weeklyHours: number;
    subtotalClassification: number;
    numberStudents?: number;
}

export type Activity = CreateActivity & {
    id: string;
    partialTemplateId: number;
    managementType: string;
}

export const DefaultActivity: CreateActivity = {
    id: uuidv4(),
    partialTemplateId: undefined,
    educationalProgramId: undefined,
    activityDistribution: "",
    managementType: "",
    stayType: "",
    numberStudents: 0,
    activityName: "",
    gradeGroups: [],
    weeklyHours: 0,
    subtotalClassification: 0,
}