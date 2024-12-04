export type CreateComment = {
    id?: number;
    comment?: string;
    partialTemplateId?: number;
    createAt?: string;
}

export type Comment = CreateComment & {
    id: number;
    comment: string;
    partialTemplateId: number;
}

export type UpdateComment = {
    comment: string;
}