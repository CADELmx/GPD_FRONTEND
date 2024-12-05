import { ModalError } from "@/components/ModalError";
import { PeriodAccordions } from "@/components/partialTemplate/Accordion";
import { YearSelectorAlter } from "@/components/Selector";
import { UseSecretary } from "@/context";
import { getAreasByWorkers } from "@/models/transactions/area";
import { getEducationalProgramsByArea } from "@/models/transactions/educational-program";
import { insertPartialTemlatesWithActivities } from "@/models/transactions/partial-template";
import { getInsesnsitivePersonalData } from "@/models/transactions/personal-data";
import { getSubjectsByProgramGroupedByPeriod, SubjectGrouped } from "@/models/transactions/subject";
import { getTemplate, getTemplates } from "@/models/transactions/templates";
import { Area } from "@/models/types/area";
import { CreatePartialTemplate } from "@/models/types/partial-template";
import { PersonalData } from "@/models/types/personal-data";
import { Template } from "@/models/types/template";
import { playNotifySound } from "@/toast";
import { getFirstSetValue, InitSelectedKeys, periods } from "@/utils";
import { generatePaths } from "@/utils/routes";
import { Button, Divider, Select, Selection, SelectItem } from "@nextui-org/react";
import { useRouter } from "next/router";
import { Key, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { v4 as uuidv4 } from 'uuid'

export interface IFGroup {
    id: string;
    name: string;
}

export const getStaticPaths = async () => {
    const { data: { data, error } } = await getTemplates()
    const { fallback, paths } = generatePaths({ data, error })
    return {
        paths,
        fallback
    }
}

export const getStaticProps = async ({ params: { id } }: { params: { id: string } }) => {
    const { data: {
        data: areas,
        error: areaError
    } } = await getAreasByWorkers({ director: false })
    const { data: {
        data: template,
        error: templateError
    } } = await getTemplate({ id: Number(id) })
    const groups: IFGroup[] = [
        {
            id: uuidv4(),
            name: 'A'
        },
        {
            id: uuidv4(),
            name: 'B'
        },
        {
            id: uuidv4(),
            name: 'C'
        }
    ]
    return {
        props: {
            error: (areaError || templateError) ? 'Error al cargar las áreas, recarga la página' : null,
            areas,
            template,
            groups
        }, revalidate: 1
    }
}

const handleInsertPartialTemplates = (templateId: number, partialTemplates: CreatePartialTemplate[]) => {
    const router = useRouter()
    const newPartialTemplates = partialTemplates.map((partialTemplate) => {
        const newTotal = (partialTemplate.activities !== undefined) ? partialTemplate.activities.reduce((acc, activity) => acc + activity.subtotalClassification, 0) : 0
        return {
            ...partialTemplate,
            templateId: templateId,
            total: newTotal
        }
    })
    console.log(newPartialTemplates)
    const partialTemplatePromises = newPartialTemplates.map((partialTemplate) => insertPartialTemlatesWithActivities({
        data: partialTemplate
    }))
    toast.promise(Promise.all(partialTemplatePromises), {
        error: 'Error al guardar las plantillas parciales',
        loading: 'Guardando plantillas parciales',
        success: (partialTemplateResponses) => {
            const partialTemplateErrors = partialTemplateResponses.filter(({ data }) => data.error)
            const successLength = partialTemplateResponses.length - partialTemplateErrors.length
            const plural = successLength < 1 ? 's' : ''
            playNotifySound()
            router.push('/')
            return `${successLength} plantilla${plural} parciale${plural} guardada${plural}`
        }
    })
}

export default function DirectorActivity({
    template: ssrTemplate,
    areas: ssrAreas,
    groups: ssrGroups,
    error,
}: {
    template: Template,
    areas: Area[],
    error: string | null,
    groups: IFGroup[]
}) {
    const {
        educationalState: { educationalPrograms },
        areaState: { areas },
        partialTemplateState: { selectedPartialTemplates },
        setStoredAreas,
        setStoredEducationalPrograms,
        setStoredActivities
    } = UseSecretary()
    const [subjects, setSubjects] = useState<SubjectGrouped[]>([]);
    const [defaultYear, setDefaultYear] = useState(String(new Date().getFullYear()));
    const [originalSubjects, setOriginalSubjects] = useState<SubjectGrouped[]>([]);
    const [personalData, setPersonalData] = useState<PersonalData[]>([]);
    const [selectedAreaKeys, setSelectedAreaKeys] = useState(InitSelectedKeys);
    const [selectedEduKeys, setSelectedEduKeys] = useState(InitSelectedKeys);
    const [isDisabled, setIsDisabled] = useState(true);
    const handleSave = () => {
        console.log(selectedPartialTemplates)
        const firstString = ssrTemplate.period.split(':')[0]
        const firstStringLength = firstString.length
        const newPartialTemplates: CreatePartialTemplate[] = selectedPartialTemplates.map((partialTemplate: CreatePartialTemplate) => {
            return {
                ...partialTemplate,
                period: ssrTemplate.period,
                year: firstString.substring(firstStringLength - 4, firstStringLength),
            }
        })
        handleInsertPartialTemplates(Number(ssrTemplate.id), newPartialTemplates)
    }
    const handleSelectArea = (e: Selection) => {
        if (e === "all") return
        toast.promise(getEducationalProgramsByArea({
            id: Number(getFirstSetValue(e))
        }), {
            loading: 'Cargando programas educativos',
            success: ({ data: { data, error, message } }) => {
                if (error) return message
                setSelectedEduKeys(InitSelectedKeys)
                const plural = data.length > 1 ? 's' : ''
                setStoredEducationalPrograms({
                    educationalPrograms: data
                })
                if (data.length === 0) return 'No hay programas educativos en esta área'
                return `${data.length} programa${plural} educativo${plural} cargado${plural}`
            },
            error: 'Error al cargar los programas educativos'
        })
        setSelectedAreaKeys(e)
    }
    const handleSelectProgram = (e: Selection) => {
        if (e === "all") return
        toast.promise(getSubjectsByProgramGroupedByPeriod({
            id: Number(getFirstSetValue(e))
        }), {
            loading: 'Cargando materias',
            success: ({ data: { data, error, message } }) => {
                if (error) return message
                if (data.length === 0) return 'No hay materias en este programa educativo'
                setSubjects(data)
                setOriginalSubjects(data)
                return `${data.length} materias cargadas`
            },
            error: 'Error al cargar las materias'
        })
        setSelectedEduKeys(e)
    }
    const handleSelectYear = () => {
        setIsDisabled(true)
        setSubjects(originalSubjects)
    }
    const handleSelectPeriod = (e: Set<Key>) => {
        if (e.size === 0) {
            setSubjects(originalSubjects)
            setIsDisabled(true)
            return
        }
        setIsDisabled(false)
        const currentCourse = periods.find(period => String(getFirstSetValue(e)).includes(period.period))
        const newSubjects = originalSubjects.filter(subject => {
            return currentCourse?.grades.includes(subject.period)
        })
        setSubjects(newSubjects)
    }
    useEffect(() => {
        const fetchPersonalData = async () => {
            const { data: { data, error } } = await getInsesnsitivePersonalData({
                area: String(areas.find(area => area.id === Number(getFirstSetValue(selectedAreaKeys)))?.name)
            })
            console.log(data)
            if (error) {
                return
            }
            setPersonalData(data)
        }
        fetchPersonalData()
        return () => {

        };
    }, [selectedAreaKeys]);
    useEffect(() => {
        if (ssrTemplate.id) {
            setIsDisabled(false)
            handleSelectArea(new Set([String(ssrTemplate.areaId)]))
            const firstString = ssrTemplate.period.split(':')[0]
            const firstStringLength = firstString.length
            setDefaultYear(ssrTemplate.period.split(':')[0].substring(firstStringLength - 4, firstStringLength))
        }
        setStoredAreas({
            areas: ssrAreas
        })
        setStoredActivities({
            groups: ssrGroups
        })
        return () => {
        };
    }, []);
    const router = useRouter()
    if (router.isFallback) return <div>
        Cargando...
    </div>
    return (
        <div className="flex flex-col gap-2">
            <ModalError error={error} />
            <Select
                label='Área'
                placeholder="Escoge el área"
                items={areas}
                disallowEmptySelection
                selectedKeys={selectedAreaKeys as Selection}
                onSelectionChange={handleSelectArea}
            >
                {
                    (area) => {
                        return <SelectItem key={area.id}>{area.name}</SelectItem>
                    }
                }
            </Select>
            <Select
                isDisabled={selectedAreaKeys.size === 0}
                disallowEmptySelection
                label='Programa educativo'
                placeholder="Escoge el programa educativo"
                items={educationalPrograms}
                selectedKeys={selectedEduKeys as Selection}
                onSelectionChange={handleSelectProgram}
            >
                {
                    (educationalProgram) => (
                        <SelectItem key={educationalProgram.id}>
                            {educationalProgram.description}
                        </SelectItem>
                    )
                }
            </Select>
            <YearSelectorAlter
                defaultPeriod={ssrTemplate.period}
                defaultYear={defaultYear}
                onSelectPeriod={handleSelectPeriod}
                onSelectYear={handleSelectYear}
                isDisabled={selectedAreaKeys.size === 0 || selectedEduKeys.size === 0}
                key={1}
            />
            <Button className="bg-utim" onPress={handleSave}>
                Guardar
            </Button>
            <div className="rounded-md p-2 flex gap-2 flex-col lg:flex-row">
                <Divider className="w-full lg:w-1/3"></Divider>
                <div className="flex gap-2 w-full text-xs flex-col sm:flex-row">
                    <p className="px-1 w-full sm:w-1/3 md:w-1/3">Grupo A</p>
                    <p className="px-1 w-full sm:w-1/3 md:w-1/3">Grupo B</p>
                    <p className="px-1 w-full sm:w-1/3 md:w-1/3">Grupo C</p>
                </div>
            </div>
            <PeriodAccordions
                subjects={subjects}
                personalData={personalData}
                isDisabled={isDisabled}
            />
        </div >
    )
}