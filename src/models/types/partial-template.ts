import { Activity } from "./activity";
import { Comment } from "./comment";

export type PartialTemplate = {
    id?: number;
    nt: number;
    name: string;
    gender?: string;
    position: string;
    total: number;
    status: string;
    year: string;
    period: string;
    templateId?: number;
    activities?: Activity[];
    comments?: Comment[];
}