export type Comment = {
    id?: number;
    comment: string;
    partialTemplateId: number;
    createAt?: string;
}

export type CreateComment = Comment & {
    comment: string;
    partialTemplateId: number;
}

export type UpdateComment = {
    comment?: string;
}