
import { createContext, useContext, useEffect, useState } from 'react'
import { io } from 'socket.io-client'
import { deleteCookie, getCookie, setCookie } from 'cookies-next'
import { defaultActivity, defaultPartialTemplate } from '../utils'
import { Activity } from '../models/types/activity'
import { PartialTemplate } from '../models/types/partial-template'
import { EducationalProgram } from '../models/types/educational-program'
import { Area } from '../models/types/area'

type MemoryState = {
    memory: {
        partialTemplate: PartialTemplate,
        activities: Activity[],
        selectedActivity: Activity,
        defaultGroups: any[],
        socket: any,
        user: any | null
    },
    setStored: (prop: any) => void,
    handleGlobalChange: (event: any) => void,
    login: (email: string, password: string) => void,
    logout: () => void
}

const TemplateContext = createContext<MemoryState>({} as any)

export const UseTemplates = () => useContext(TemplateContext)

export const TemplatesProvider = ({ children }) => {
    const [memory, setMemory] = useState({
        partialTemplate: defaultPartialTemplate,
        activities: [defaultActivity],
        selectedActivity: defaultActivity,
        defaultGroups: [],
        socket: io(),
        user: getCookie('user', { secure: true })
    })
    const login = async (email, password) => {
        const res = await fetch('/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        })
        const { error, user } = await res.json()
        if (error) {
            return { error }
        }
        setMemory({ ...memory, user })
        setCookie('user', user, { secure: true })
    }
    const logout = async () => {
        await fetch('/api/logout')
        deleteCookie('user')
        setMemory({ ...memory, user: null })
    }
    const setStored = (prop) => setMemory((prev) => ({ ...prev, ...prop }))
    const handleGlobalChange = (event) => setStored({
        partialTemplate: {
            ...memory.partialTemplate,
            [event.target?.name]: event.target?.value
        }
    })
    useEffect(() => {
        const setupSocket = async () => {
            await fetch('/api/socket')
            return () => {
                memory.socket.disconnect()
            }
        }
        setupSocket()
    }, [])
    return (
        <TemplateContext.Provider value={{
            memory,
            setStored,
            handleGlobalChange,
            login,
            logout,
        }}>
            {children}
        </TemplateContext.Provider>
    )
}

type AreaState = {
    areaState: {
        areas: Area[],
        selectedArea: Area
    },
    setStoredAreas: (prop: any) => void,
    educationalState: {
        educationalPrograms: EducationalProgram[],
        selectedEducationalProgram: EducationalProgram
    },
    setStoredEducationalPrograms: (prop: any) => void,
    subjectState: {
        subjects: any[],
        selectedSubject: any
    },
    setStoredSubjects: (prop: any) => void
}

const AreaContext = createContext({} as any)

export const UseSecretary = () => useContext<AreaState>(AreaContext)

export const AreasProvider = ({ children }) => {
    const [areaState, setAreaState] = useState({
        areas: [],
        selectedArea: {
            name: '',
        }
    })
    const [educationalState, setEducationalState] = useState({
        educationalPrograms: [],
        selectedEducationalProgram: {
            areaId: '',
            abbreviation: '',
            description: ''
        }
    })
    const [subjectState, setSubjectState] = useState({
        subjects: [],
        selectedSubject: null
    })
    const setStoredEducationalPrograms = (prop) => {
        setEducationalState((educationalState) => ({ ...educationalState, ...prop }))
    }
    const setStoredAreas = (prop) => {
        setAreaState((areaState) => ({ ...areaState, ...prop }))
    }
    const setStoredSubjects = (prop) => {
        setSubjectState((areaState) => ({ ...areaState, ...prop }))
    }
    return (
        <AreaContext.Provider value={{
            areaState,
            setStoredAreas,
            educationalState,
            setStoredEducationalPrograms,
            subjectState,
            setStoredSubjects
        }}>
            {children}
        </AreaContext.Provider>
    )
}