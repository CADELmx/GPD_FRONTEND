
import { ChangeEvent, createContext, useContext, useEffect, useState } from 'react'
import { io, Socket } from 'socket.io-client'
import { CookieValueTypes, deleteCookie, getCookie, setCookie } from 'cookies-next'
import { defaultActivity, defaultPartialTemplate } from '../utils'
import { CreateActivity } from '../models/types/activity'
import { CreatePartialTemplate } from '../models/types/partial-template'
import { CreateEducationalProgram, EducationalProgram } from '../models/types/educational-program'
import { Area, CreateArea } from '../models/types/area'
import axios from 'axios'
import { CreateSubject } from '../models/types/subject'
import { CreateTemplate } from '../models/types/template'

interface MemoryState {
    memory: {
        partialTemplate: CreatePartialTemplate,
        activities: CreateActivity[],
        selectedActivity: CreateActivity,
        defaultGroups: string[],
        socket: Socket,
        user: CookieValueTypes
    },
    setStored: (prop: any) => void,
    handleGlobalChange: (event: any) => void,
    signIn: (email: string, password: string) => Promise<{
        error: string | null,
        user: CookieValueTypes
    }>,
    signUp: (email: string, password: string, nt: number) => Promise<{
        error: string | null,
        user: CookieValueTypes
    }>,
    signOut: () => Promise<void>
}

const TemplateContext = createContext<MemoryState>({} as any)

export const UseTemplates = () => useContext(TemplateContext)

export const TemplatesProvider = ({ children }: {
    children: React.ReactNode
}) => {
    const [memory, setMemory] = useState({
        partialTemplate: defaultPartialTemplate,
        activities: [defaultActivity],
        selectedActivity: defaultActivity,
        defaultGroups: [],
        socket: io(),
        user: undefined as CookieValueTypes
    })
    const signIn = async (email: string, password: string) => {
        const { data: { error, user } } = await axios.post('/api/auth/signin', {
            email, password
        })
        if (error) {
            return { error, user: undefined }
        }
        setMemory({ ...memory, user: getCookie('user') })
        return { error: null, user }
    }
    const signUp = async (email: string, password: string, nt: number) => {
        const { data: { error, user } } = await axios.post('/api/auth/signup', {
            email, password, nt
        })
        if (error) {
            return { error, user: undefined }
        }
        setMemory({ ...memory, user: getCookie('user') })
        return { error: null, user }
    }
    const signOut = async () => {
        await fetch('/api/auth/signout')
        setMemory({ ...memory, user: undefined })
    }
    const setStored = (prop: Object) => setMemory((prev) => ({ ...prev, ...prop }))
    const handleGlobalChange = (event: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>) => setStored({
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
        setStored({
            user: getCookie('user', { secure: true })
        })
        setupSocket()
    }, [])
    return (
        <TemplateContext.Provider value={{
            memory,
            setStored,
            handleGlobalChange,
            signIn,
            signOut,
            signUp,
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
        subjects: CreateSubject[],
        selectedSubject: CreateSubject
    },
    setStoredSubjects: (prop: any) => void
}

const AreaContext = createContext({} as any)

export const UseSecretary = () => useContext<AreaState>(AreaContext)

export const AreasProvider = ({ children }: {
    children: React.ReactNode
}) => {
    const [areaState, setAreaState] = useState<{
        areas: Area[], selectedArea: CreateArea
    }>({
        areas: [],
        selectedArea: {
            name: '',
        }
    })
    const [educationalState, setEducationalState] = useState<{
        educationalPrograms: EducationalProgram[],
        selectedEducationalProgram: CreateEducationalProgram
    }>({
        educationalPrograms: [],
        selectedEducationalProgram: {
            areaId: undefined,
            abbreviation: '',
            description: ''
        }
    })
    const [subjectState, setSubjectState] = useState<{
        subjects: CreateSubject[],
        selectedSubject: CreateSubject
    }>({
        subjects: [],
        selectedSubject: {
            monthPeriod: '',
            subjectName: '',
            totalHours: 0,
            weeklyHours: 0,
            educationalProgramId: undefined,
            id: undefined
        }
    })
    const setStoredEducationalPrograms = (prop: Object) => {
        setEducationalState((educationalState) => ({ ...educationalState, ...prop }))
    }
    const setStoredAreas = (prop: Object) => {
        setAreaState((areaState) => ({ ...areaState, ...prop }))
    }
    const setStoredSubjects = (prop: Object) => {
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