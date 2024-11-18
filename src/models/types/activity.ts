export type Activity = {
    id: string
    partialTemplateId: number;
    managementType?: string;
    educationalProgramId?: number;
    activityDistribution?: string;
    stayType?: string;
    activityName?: string;
    gradeGroups?: string[];
    weeklyHours: number;
    subtotalClassification: number;
    numberStudents?: number;
}