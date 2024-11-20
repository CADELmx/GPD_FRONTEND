import { ApiResponse, serverClient } from "../apiClient"

export type AuthCredentials = {
    email: string
    password: string
}

export type SignUpCredentials = {
    nt: number,
    active: boolean,
}

export interface AuthResult extends ApiResponse {
    data: {
        access_token: string
    }
}

export const login = async ({ email, password }: { email: string, password: string }) => {
    return serverClient.post<AuthResult>('/auth/login', { email, password })
}

export const signUp = async () => {

}