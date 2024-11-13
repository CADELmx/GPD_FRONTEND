export class PartialTemplate {
    nt: number;
    name: string;
    gender?: string;
    position: string;
    total: number;
    status: string;
    year: string;
    period: string;
    templateId: number;
}

export class CreateActivityDto {
    id: string
    educationalProgramId?: number;
    partialTemplateId: number;
    activityDistribution: string;
    managementType?: string;
    stayType?: string;
    activityName?: string;
    gradeGroups?: string[];
    weeklyHours: number;
    subtotalClassification: number;
    numberStudents?: number;
}
