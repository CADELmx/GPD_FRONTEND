
import { createContext, useContext, useEffect, useState } from 'react'
import { io, Socket } from 'socket.io-client'
import { CookieValueTypes, getCookie } from 'cookies-next'
import { Activity, CreateActivity, DefaultActivity } from '../models/types/activity'
import { CreatePartialTemplate, DefaultPartialTemplate, PartialTemplate } from '../models/types/partial-template'
import { CreateEducationalProgram, DefaultEducationalProgram, EducationalProgram } from '../models/types/educational-program'
import { Area, CreateArea, DefaultArea } from '../models/types/area'
import axios from 'axios'
import { CreateSubject, DefaultSubject, Subject } from '../models/types/subject'
import { CreateTemplate, DefaultTemplate, Template } from '../models/types/template'

interface MemoryState {
    memory: {
        defaultGroups: string[],
        socket: Socket,
        user: CookieValueTypes,
        isSecretary: CookieValueTypes
    },
    setStored: (prop: any) => void,
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
        defaultGroups: [],
        socket: io(),
        user: undefined as CookieValueTypes,
        isSecretary: undefined as CookieValueTypes
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
        selectedArea: CreateArea
    },
    setStoredAreas: (prop: any) => void,
    educationalState: {
        educationalPrograms: EducationalProgram[],
        selectedEducationalProgram: CreateEducationalProgram
    },
    setStoredEducationalPrograms: (prop: any) => void,
    subjectState: {
        subjects: Subject[],
        selectedSubject: CreateSubject
    },
    setStoredSubjects: (prop: any) => void
    templateState: {
        templates: Template[],
        selectedTemplate: CreateTemplate
    }
    setStoredTemplates: (prop: any) => void
    partialTemplateState: {
        partialTemplates: PartialTemplate[],
        selectedPartialTemplates: CreatePartialTemplate[],
        selectedPartialTemplate: CreatePartialTemplate
    }
    setStoredPartialTemplates: (prop: any) => void
    activityState: {
        activities: CreateActivity[],
        selectedActivity: CreateActivity,
        groups: {
            id: string,
            name: string
        }[]
    }
    setStoredActivities: (prop: any) => void
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
        selectedArea: DefaultArea
    })
    const [educationalState, setEducationalState] = useState<{
        educationalPrograms: EducationalProgram[],
        selectedEducationalProgram: CreateEducationalProgram
    }>({
        educationalPrograms: [],
        selectedEducationalProgram: DefaultEducationalProgram
    })
    const [subjectState, setSubjectState] = useState<{
        subjects: Subject[],
        selectedSubject: CreateSubject
    }>({
        subjects: [],
        selectedSubject: DefaultSubject
    })
    const [templateState, setTemplateState] = useState<{
        templates: Template[],
        selectedTemplate: CreateTemplate
    }>({
        templates: [],
        selectedTemplate: DefaultTemplate
    })
    const [partialTemplateState, setPartialTemplateState] = useState<{
        partialTemplates: PartialTemplate[],
        selectedPartialTemplates: CreatePartialTemplate[],
        selectedPartialTemplate: CreatePartialTemplate
    }>({
        partialTemplates: [],
        selectedPartialTemplates: [],
        selectedPartialTemplate: DefaultPartialTemplate
    });
    const [activityState, setActivityState] = useState<{
        activities: CreateActivity[],
        selectedActivity: CreateActivity,
        groups: []
    }>({
        activities: [DefaultActivity],
        selectedActivity: DefaultActivity,
        groups: []
    });
    const setStoredEducationalPrograms = (prop: Object) => {
        setEducationalState((educationalState) => ({ ...educationalState, ...prop }))
    }
    const setStoredAreas = (prop: Object) => {
        setAreaState((areaState) => ({ ...areaState, ...prop }))
    }
    const setStoredSubjects = (prop: Object) => {
        setSubjectState((areaState) => ({ ...areaState, ...prop }))
    }
    const setStoredTemplates = (prop: Object) => {
        setTemplateState((areaState) => ({ ...areaState, ...prop }))
    }
    const setStoredPartialTemplates = (prop: Object) => {
        setPartialTemplateState((areaState) => ({ ...areaState, ...prop }))
    }
    const setStoredActivities = (prop: Object) => {
        setActivityState((areaState) => ({ ...areaState, ...prop }))
    }
    return (
        <AreaContext.Provider value={{
            areaState,
            setStoredAreas,
            educationalState,
            setStoredEducationalPrograms,
            subjectState,
            setStoredSubjects,
            templateState,
            setStoredTemplates,
            partialTemplateState,
            setStoredPartialTemplates,
            activityState,
            setStoredActivities
        }}>
            {children}
        </AreaContext.Provider>
    )
}