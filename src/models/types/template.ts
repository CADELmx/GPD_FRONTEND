import { PartialTemplate } from "./partial-template";

export type templateState = 'pendiente' | 'aprobado' | 'corrección'

export type CreateTemplate = {
    id?: number;
    state: templateState;
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

export const DefaultTemplate: CreateTemplate = {
    areaId: undefined,
    period: '',
    state: 'pendiente',
    responsibleId: undefined,
    revisedById: undefined,
}