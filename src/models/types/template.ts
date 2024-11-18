import { PartialTemplate } from "./partial-template";

export type Template = {
    id: number;
    state: string;
    areaId: number;
    period: string;
    responsibleId: number;
    revisedById: number;
    partialTemplate?: PartialTemplate[];
}