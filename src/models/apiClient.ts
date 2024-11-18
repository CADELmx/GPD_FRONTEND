import axios from "axios"
import { getCookie } from "cookies-next"
import { getPartialTemplateJoinActivity, getPartialTemplatesJoinActivities } from "./transactions/partial-template"

export const serverClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    headers: {
        Authorization: `Bearer ${getCookie('token')}`
    },
})

export interface ApiResponse<T = any> {
    data: T
    error: string | null
    message: string
}

export interface CreateManyResult extends ApiResponse {
    data: {
        count: number
    }
}

export type GetById = {
    id: number
}


export const generateRecords = async () => {
    const { data: { data, error } } = await getPartialTemplatesJoinActivities()
    if (error) {
        console.error('#ERROR# Error al obtener datos de plantillas y/o actividades')
        return {
            props: {
                error: 'Error al obtener las plantillas, recarga la página'
            }
        }
    }
    return {
        props: {
            plantillas: data,
        }
    }
}

export const generateSingleRecord = async (id) => {
    const { data: { data, error } } = await getPartialTemplateJoinActivity(id)
    if (error) {
        console.error('#ERROR# Error al obtener datos de plantilla')
        return {
            props: {
                error: 'Error al obtener la plantilla, recarga la página'
            }
        }
    }
    return {
        props: {
            plantilla: data,
        }
    }
}