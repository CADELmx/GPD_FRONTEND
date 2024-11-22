import { ApiResponse, GetById, serverClient } from "../apiClient"
import { PersonalData } from "../types/personal-data"

export interface PersonalDataResult extends ApiResponse {
    data: PersonalData
}

export interface PersonalDataResults extends ApiResponse {
    data: PersonalData[]
}

export const getPersonalData = ({ id }: GetById) => {
    return serverClient.get<PersonalDataResult>('/personal-data', {
        params: {
            id
        }
    })
}

export const getAllPersonalData = () => {
    return serverClient.get<PersonalDataResults>('/personal-data')
}

export const getInsesnsitivePersonalData = ({ area, position }: { area: string, position: string }) => {
    return serverClient.get<PersonalDataResults>('/personal-data/insensitive', {
        params: {
            area,
            position
        }
    })
}