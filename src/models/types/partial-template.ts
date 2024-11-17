import { Activity } from "./activity";

export type PartialTemplate = {
    id: number;
    nt: number;
    name: string;
    gender?: string;
    position: string;
    total: number;
    status: string;
    year: string;
    period: string;
    templateId: number;
    activities?: Activity[];
}