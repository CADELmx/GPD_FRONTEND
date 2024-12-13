import { Activity } from "./activity";
import { Comment } from "./comment";
import { templateState } from "./template";

export type CreatePartialTemplate = {
    id?: number;
    nt: number;
    name: string;
    gender?: string;
    position: string;
    total: number;
    status: templateState;
    year: string;
    period: string;
    templateId?: number;
    activities?: Activity[];
    comments?: Comment[];
}

export type PartialTemplate = CreatePartialTemplate & {
    id: number;
}

export type UpdatePartialTemplate = {
    nt?: number;
    name?: string;
    gender?: string;
    position?: string;
    total?: number;
    status?: string;
    year?: string;
    period?: string;
}

export type PartialTemplateJoinActivity = PartialTemplate & {
    id: number,
    partialTemplateId: number,
    activities: Activity[]
}

export type PartialTemplateJoinComment = PartialTemplate & {
    id: number,
    partialTemplateId: number,
    comments: Comment[]
}

export const DefaultPartialTemplate: CreatePartialTemplate = {
    id: undefined,
    nt: 0,
    name: "",
    gender: "",
    position: "",
    status: "pendiente",
    templateId: undefined,
    year: `${new Date().getFullYear()}`,
    period: "",
    total: 0,
}