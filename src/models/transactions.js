import axios from "axios"
import { getCookie } from "cookies-next"

export const serverClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    headers: {
        Authorization: `Bearer ${getCookie('token')}`
    },
})

export const getPersonalData = (id) => {
    return serverClient.get('/personal-data', {
        params: {
            id
        }
    })
}

export const getAllPersonalData = () => {
    return serverClient.get('/personal-data')
}

export const insertActivities = (activities) => {
    return serverClient.post('/activity', activities, {
        params: {
            many: true
        }
    })
}

export const insertTemplate = (template) => {
    return serverClient.post('/templates', template)
}

export const insertPartialTemplate = (template) => {
    return serverClient.post('/templates', template)
}

export const getAcademicPrograms = () => {
    return serverClient.get('/educational-programs')
}

export const getTemplates = async () => {
    return serverClient.get('/templates')
}

export const getTemplate = (id) => {
    return serverClient.get('/templates', {
        params: {
            id
        }
    })
}

export const getPartialTemplates = () => {
    return serverClient.get('/partial-templates')
}

export const getPartialTemplate = (id) => {
    return serverClient.get('/partial-templates', {
        params: {
            id
        }
    })
}

export const setPartialTemplateStatus = (id, status) => {
    return serverClient.put('/partial-template', status, {
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

export const insertPartialTemplateAndActivities = async (template, activities) => {
    const { data: { data, error } } = await insertPartialTemplate(template)

}

export const getActivities = () => {
    return serverClient.get('/activity')
}

export const getActivitiesByPartialTemplate = (id) => {
    return serverClient.get('/activity', {
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

export const getArea = (id) => {
    return serverClient.get('/areas', {
        params: {
            id
        }
    })
}

export const getAreas = () => {
    return serverClient.get('/areas')
}

export const getAreasJoinEducationalPrograms = () => {
    return serverClient.get('/areas/educational-programs')
}

export const createArea = (area) => {
    return serverClient.post('/areas', area)
}

export const updateArea = (id, newArea) => {
    return serverClient.put(`/areas/${id}`, newArea)
}

export const deleteArea = (id) => {
    return serverClient.delete(`/areas/${id}`)
}

export const getEducationalPrograms = () => {
    return serverClient.get('/educational-programs')
}

export const createEducationalProgram = (educationalProgram) => {
    return serverClient.post('/educational-programs', educationalProgram)
}

export const createManyEducationalPrograms = (areaId, educationalPrograms) => {
    return serverClient.post('/educational-programs/many', educationalPrograms, {
        params: {
            id: areaId
        }
    })
}

export const updateEducationalProgram = (id, newEducationalProgram) => {
    return serverClient.put(`/educational-programs/${id}`, newEducationalProgram)
}

export const deleteEducationalProgram = (id) => {
    return serverClient.delete(`/educational-programs/${id}`)
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
    const { data: { data, error }, error: axiosError } = await getPartialTemplateJoinActivity(id)
    if (error || axiosError) {
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