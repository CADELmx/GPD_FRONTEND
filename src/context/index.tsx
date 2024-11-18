
import { createContext, useContext, useEffect, useState } from 'react'
import { io, Socket } from 'socket.io-client'
import { deleteCookie, getCookie, setCookie } from 'cookies-next'
import { defaultActivity, defaultPartialTemplate } from '../utils'
import { Activity } from '../models/types/activity'
import { PartialTemplate } from '../models/types/partial-template'
import { EducationalProgram } from '../models/types/educational-program'
import { Area } from '../models/types/area'
import axios from 'axios'

interface MemoryState {
    memory: {
        partialTemplate?: PartialTemplate,
        activities?: Activity[],
        selectedActivity?: Activity,
        defaultGroups?: string[],
        socket: Socket,
        user: string | null
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
        const { data: { error, user } } = await axios.post('/api/login', {
            email, password
        })
        if (error) {
            return { error, user: null }
        }
        setMemory({ ...memory, user })
        setCookie('user', user, { secure: true })
        return { user, error: null }
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

interface AreaState {
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