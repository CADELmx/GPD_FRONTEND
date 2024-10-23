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

export const insertActivities = (activities) => {
    return serverClient.post('/activity', activities)
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
    return serverClient.get(`/templates/${id}`)
}

export const getPartialTemplatesJoinActivities = () => {
    return serverClient.get('/partial-templates', {
        params: {
            join: true
        }
    })
}

export const getPartialTemplateJoinActivitiesById = (id) => {
    return serverClient.get('/partial-templates/', {
        params: {
            join: true,
            id
        }
    })
}

export const getActivites = () => {
    return serverClient.get('/activity')
}

export const getActivitiesByPartialTemplate = (id) => {
    return serverClient.get('/activity/', {
        params: {
            template: id
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

export const insertComment = (template_id, comment) => {
    return supabase.from('comentarios').insert({ plantilla_id: template_id, comentario: comment }).select('id')
}

export const updateComment = (template_id, comment) => {
    return supabase.from('comentarios').update({ comentario: comment }).eq('plantilla_id', template_id).select('id')
}

export const deleteComment = (template_id) => {
    return supabase.from('comentarios').delete().eq('plantilla_id', template_id).select('id')
}

export const checkExistentComment = (template_id) => {
    return supabase.from('comentarios').select('id').eq('plantilla_id', template_id)
}

export const getTemplateJoinComment = () => {
    return supabase.from('plantilla').select('id,nombre,total,status,comentarios(*)')
}

export const generateRecords = async () => {
    const { data, error } = await getTemplateJoinActivities()
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
    const { data, error } = await getTemplateJoinActivitiesById(id)
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
            plantilla: data[0],
        }
    }
}