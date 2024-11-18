import { Socket } from "socket.io"
import { Activity, CreateActivity } from "../models/types/activity"
import { CreatePartialTemplate, PartialTemplate } from "../models/types/partial-template"
import { Toast,toast } from "react-hot-toast"
export const promiseResolver = async<T>(promises: Promise<T>[]) => {
    const result = await Promise.all(promises)
    return result
}
export const positions = [
    'Profesor de Tiempo Completo Titular "A"',
    'Profesor de Tiempo Completo Titular "B"',
    'Profesor de Tiempo Completo Asociado "A"',
    'Profesor de Tiempo Completo Asociado "B"',
    'Profesor de Tiempo Completo Asociado "C"',
    'Profesor de asignatura "B"',
    'Técnico de Apoyo',
]

export const titles = [
    'Sin título',
    'T.S.U.',
    'Licenciatura',
    'Maestría',
    'Doctorado',
]

export const activitiesDistribution = [
    'Docencia',
    'LIIAD',
    'Tutorías',
    'Gestión',
    'Estadía técnica',
]

export const modalidades = [
    'T.S.U. Escolarizada',
    'T.S.U. Despresurizada',
    'Licenciatura Escolarizada',
    'Licenciatura Mixta',
    'Ingeniería Escolarizada',
    'Ingeniería Mixta',
]
export const defaultActivity: CreateActivity = {
    id: crypto.randomUUID(),
    partialTemplateId: undefined,
    educationalProgramId: undefined,
    activityDistribution: "",
    managementType: "",
    stayType: "",
    numberStudents: 0,
    activityName: "",
    gradeGroups: [],
    weeklyHours: 0,
    subtotalClassification: 0,
}

export const defaultPartialTemplate: CreatePartialTemplate = {
    nt: 0,
    name: "",
    gender: "",
    position: "",
    status: "Pendiente",
    year: `${new Date().getFullYear()}`,
    period: "",
    total: 0,
}

export const generatePeriods = ({
    year, ordinary
}: {
    year: number,
    ordinary: boolean
}) => {
    const period = 4
    const generateMonthName = (
        m: number,
        y: number = year
    ) => {
        const date = new Date(y, m)
        return date.toLocaleString('es-MX', { month: 'long' })
    }
    const generateFormat = (
        month1: string,
        month2: string,
        o: boolean = ordinary,
        y: number = year
    ) => {
        return `${month1} - ${month2} ${y}: ${o ? 'Ordinario' : 'Extraordinario'}`
    }
    return Array.from({ length: 3 }, (_, k) => {
        const month1 = generateMonthName(k * period)
        const month2 = generateMonthName(k * period + period - 1)
        return generateFormat(month1, month2)
    })
}

export const checkEmptyStringOption = (string: string | undefined) => string === "" || string === undefined ? [] : [string]

export const getFirstSetValue = <T>(set: Set<T>) => {
    return Array.from(set)[0]
}

export const sumHours = ({ activities }: { activities: CreateActivity[] }) => {
    if (activities?.length) {
        return activities.map(activity => activity.subtotalClassification).reduce((p, c) => p + c, 0)
    }
    return 0
}

export const generateTemplateObject = (record: any) => {
    const template = Object.fromEntries(Object.entries(record).filter(([k, v]) => {
        if (k != 'activities') {
            return true
        }
    })
    )
    return template
}
type toasttype = typeof toast
/**
 * 
 * @param {Socket} socket 
 * @param {toasttype} toast 
 * @returns 
 */
export const checkSocketStatus = (socket: Socket, toast: toasttype) => {
    if (socket.disconnected) {
        toast.error('No hay conexión en tiempo real', {
            id: 'no-connection'
        })
        return true
    }
    return false
}