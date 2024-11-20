import { ApiResponse, serverClient } from "../apiClient"

export type AuthCredentials = {
    email: string
    password: string
}

export type SignUpCredentials = AuthCredentials & {
    nt: number,
    active: boolean,
}

export interface AuthResult extends ApiResponse {
    data: {
        access_token: string
    }
}

export const signIn = async ({ data }: { data: AuthCredentials }) => {
    return serverClient.post<AuthResult>('/auth/login', data)
}

export const signUp = async ({ data }: { data: SignUpCredentials }) => {
    return serverClient.post<AuthResult>('/auth/signup', data)
}