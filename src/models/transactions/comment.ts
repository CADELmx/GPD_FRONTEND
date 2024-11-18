import { ApiResponse, GetById, serverClient } from "../apiClient";
import { Comment } from "../types/comment";

export interface CommentsResult extends ApiResponse {
    data: Comment[]
}

export interface CommentResult extends ApiResponse {
    data: Comment
}

export const getComment = (
    { partialTemplateId }: { partialTemplateId: number }
) => {
    return serverClient.get<CommentResult>('/comments', {
        params: {
            id: partialTemplateId
        }
    })
}

export const insertComment = (
    { partialTemplateId, comment }: { partialTemplateId: number, comment: Comment }
) => {
    return serverClient.post<CommentResult>('/comments', {
        partialTemplateId,
        comment
    })
}

export const updateComment = (
    { partialTemplateId, comment }: { partialTemplateId: number, comment: Comment }
) => {
    return serverClient.put<CommentResult>('/comments', { comment }, {
        params: {
            id: partialTemplateId
        }
    })
}

export const deleteComment = ({ partialTemplateId }: { partialTemplateId: number }) => {
    return serverClient.delete<CommentResult>(`/comments/${partialTemplateId}`,)
}
