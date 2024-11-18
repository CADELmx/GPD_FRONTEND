import { PartialTemplate } from "./partial-template";

export type CreateTemplate = {
    id?: number;
    state: string;
    areaId?: number;
    period: string;
    responsibleId?: number;
    revisedById?: number;
    partialTemplate?: PartialTemplate[];
}

export type Template = CreateTemplate & {
    id: number;
    areaId: number;
    responsibleId: number;
    revisedById: number;
}

export type TemplateJoinPartialTemplate = Template & {
    partialTemplate: PartialTemplate[];
}