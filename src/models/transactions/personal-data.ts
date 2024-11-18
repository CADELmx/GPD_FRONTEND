import { serverClient } from "../apiClient"

export const getPersonalData = (id: number) => {
    return serverClient.get('/personal-data', {
        params: {
            id
        }
    })
}

export const getAllPersonalData = () => {
    return serverClient.get('/personal-data')
}