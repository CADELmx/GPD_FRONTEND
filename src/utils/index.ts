import { Socket } from "socket.io"
import { CreateActivity } from "../models/types/activity"
import { toast } from "react-hot-toast"
import { Key } from "react"

export const promiseResolver = async<T>(promises: Promise<T>[]) => {
    const result = await Promise.all(promises)
    return result
}

export const periods = [
    {
        period: "enero - abril",
        grades: ['2', '5', '8'],
        months: ['enero', 'febrero', 'marzo', 'abril']
    },
    {
        period: "mayo - agosto",
        grades: ['3', '6', '9'],
        months: ['mayo', 'junio', 'julio', 'agosto']
    },
    {
        period: "septiembre - diciembre",
        grades: ['1', '4', '7', '10'],
        months: ['septiembre', 'octubre', 'noviembre', 'diciembre']
    }
]

export type PositionType = {
    name: string,
    minHours: number,
    maxHours: number
}

export const positions: PositionType[] = [
    {
        name: 'Profesor de Tiempo Completo Titular "A"',
        minHours: 40,
        maxHours: 40
    },
    {
        name: 'Profesor de Tiempo Completo Titular "B"',
        minHours: 40,
        maxHours: 40
    },
    {
        name: 'Profesor de Tiempo Completo Asociado "A"',
        minHours: 40,
        maxHours: 40
    },
    {
        name: 'Profesor de Tiempo Completo Asociado "B"',
        minHours: 40,
        maxHours: 40
    },
    {
        name: 'Profesor de Tiempo Completo Asociado "C"',
        minHours: 40,
        maxHours: 40
    },
    {
        name: 'Profesor de asignatura "B"',
        minHours: 17,
        maxHours: 32
    },
    {
        name: 'Técnico de Apoyo',
        minHours: 17,
        maxHours: 32
    }
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
        const finalPeriod = generateFormat(month1, month2)
        return {
            id: k,
            period: finalPeriod
        }
    })
}

export const checkEmptyStringOption = (string: string | undefined) => string === "" || string === undefined ? [] : [string]

export const checkIfUndefined = (v: number | undefined) => {
    if (v === undefined) return v
    if (isNaN(Number(v))) return v
    return Number(v)
}

export const getFirstSetValue = <T>(set: Set<T>): T => {
    return Array.from(set)[0]
}

export const InitSelectedKeys = () => {
    return new Set<Key>([])
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

export const AddToArrayIfNotExists = (array: any[], value: any) => {
    if (array.find(e => e.name === value)) return array
    return [...array, {
        id: array.length + 1,
        name: value
    }]
}

export const AddToPositionIfNotExists = (array: PositionType[], value: string) => {
    if (!value) return array
    if (array.find(e => e.name === value)) return array
    return [...array, {
        name: value,
        minHours: 0,
        maxHours: 40
    }]
}