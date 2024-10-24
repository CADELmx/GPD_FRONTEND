import axios from "axios"
import { supabase } from "./conector"
import { getCookie } from "cookies-next"

const academicWorkersFilter = [
    '%asignatura%',
    '%Tiempo Completo%',
    '%de Apoyo%',
]

const areaFiter = [
    'P.E. de Tecnologías de la Información',
    'P.E. de Lengua Inglesa',
]

export const getAllAcademicWorkers = () => {
    return supabase.from('dpersonales').select('ide,nombre,puesto,area')
        .likeAnyOf('puesto', academicWorkersFilter)
        .in('area', areaFiter)
}

export const getOneAcademicWorker = (id) => {
    return supabase.from('dpersonales').select('ide,nombre,puesto,area')
        .eq('ide', id)
        .ilikeAnyOf('puesto', academicWorkersFilter)
}

const serverClient = axios.create({
    baseURL: process.env.API_URL,
    headers: {
        Authorization: `Bearer ${getCookie('token')}`
    },
})
/**
 * 
 * @param {import("axios").AxiosPromise} AxiosPromise 
 */
export const AxiosAbtraction = async (AxiosPromise) => {
    const { data } = await AxiosPromise
    return data
}

export const insertActivities = (activities) => {
    return serverClient.post('/activity', activities, {
        params: {
            many: true
        }
    })
}

export const insertTemplate = (template) => {
    return serverClient.post('/template', template)
}

export const insertPartialTemplate = (template) => {
    return serverClient.post('/template', template)
}

export const getAcademicPrograms = () => {
    return serverClient.post('/educational-programs')
}

export const getTemplates = async () => {
    return serverClient.get('/templates')
}

export const getTemplate = (id) => {
    return serverClient.get('/templates/', {
        params: {
            id
        }
    })
}

export const getPartialTemplates = () => {
    return serverClient.get('/partial-templates')
}

export const getPartialTemplate = (id) => {
    return serverClient.get('/partial-templates/', {
        params: {
            id
        }
    })
}

export const setPartialTemplateStatus = (id, status) => {
    return serverClient.put('partial-template', status, {
        params: {
            id
        }
    })
}

export const getPartialTemplatesJoinActivities = () => {
    return serverClient.get('/partial-templates/activities')
}

export const getPartialTemplateJoinActivity = (id) => {
    return serverClient.get('/partial-templates/activities', {
        params: {
            id
        }
    })
}

export const getActivities = () => {
    return serverClient.get('/activity')
}

export const getActivitiesByPartialTemplate = (id) => {
    return serverClient.get('/activity/', {
        params: {
            template: id
        }
    })
}

export const insertComment = (partialTemplateId, comment) => {
    return serverClient.post('/comments', {
        partialTemplateId,
        comment
    })
}

export const updateComment = (partialTemplateId, comment) => {
    return serverClient.put('/comments', { comment }, {
        params: {
            id: partialTemplateId
        }
    })
}

export const deleteComment = (partialTemplateId) => {
    return serverClient.delete('/comments', null, {
        params: {
            id: partialTemplateId
        }
    })
}

export const checkExistentComment = (partialTemplateId) => {
    return serverClient.get('/comments', {
        params: {
            id: partialTemplateId
        }
    })
}

export const getPartialTemplateJoinComment = (templateId) => {
    return serverClient.get('/partial-templates/comments', {
        params: {
            id: templateId
        }
    })
}

export const generateRecords = async () => {
    const { data, error } = await AxiosAbtraction(
        getPartialTemplatesJoinActivities()
    )
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
    const { data, error } = await AxiosAbtraction(
        getPartialTemplateJoinActivity(id)
    )
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