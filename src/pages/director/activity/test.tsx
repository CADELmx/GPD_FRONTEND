import { ModalError } from "@/components/ModalError";
import { PeriodAccordions } from "@/components/partialTemplate/Accordion";
import { YearSelectorAlter } from "@/components/Selector";
import { UseSecretary } from "@/context";
import { getAreas, getAreasByWorkers } from "@/models/transactions/area";
import { getEducationalPrograms, getEducationalProgramsByArea } from "@/models/transactions/educational-program";
import { getInsesnsitivePersonalData } from "@/models/transactions/personal-data";
import { getSubjectsByProgramGroupedByPeriod, SubjectGrouped } from "@/models/transactions/subject";
import { Area } from "@/models/types/area";
import { EducationalProgram } from "@/models/types/educational-program";
import { PersonalData } from "@/models/types/personal-data";
import { getFirstSetValue, InitSelectedKeys, periods } from "@/utils";
import { Select, Selection, SelectItem } from "@nextui-org/react";
import { Key, useEffect, useState } from "react";
import toast from "react-hot-toast";

export const getStaticProps = async () => {
    const { data: {
        data: areas,
        error: areaError
    } } = await getAreasByWorkers({ director: false })
    const { data: {
        data: educationalPrograms,
        error: educationalError
    } } = await getEducationalPrograms()
    return {
        props: {
            error: (areaError || educationalError) ? 'Error al cargar las áreas, recarga la página' : null,
            areas,
            educationalPrograms
        }
    }
}

export default function DirectorActivity({
    educationalPrograms: ssrEducationalPrograms,
    areas: ssrAreas,
    error
}: {
    educationalPrograms: EducationalProgram[],
    areas: Area[],
    error: string | null
}) {
    const {
        educationalState: { educationalPrograms },
        areaState: { areas },
        setStoredAreas,
        setStoredEducationalPrograms,
    } = UseSecretary()
    const [subjects, setSubjects] = useState<SubjectGrouped[]>([]);
    const [originalSubjects, setOriginalSubjects] = useState<SubjectGrouped[]>([]);
    const [personalData, setPersonalData] = useState<PersonalData[]>([]);
    const [selectedAreaKeys, setSelectedAreaKeys] = useState(InitSelectedKeys);
    const [selectedEduKeys, setSelectedEduKeys] = useState(InitSelectedKeys);
    const handleSelectArea = (e: Selection) => {
        if (e === "all") return
        toast.promise(getEducationalProgramsByArea({
            id: Number(getFirstSetValue(e))
        }), {
            loading: 'Cargando programas educativos',
            success: ({ data: { data, error, message } }) => {
                if (error) return message
                setStoredEducationalPrograms({
                    educationalPrograms: data
                })
                return `${data.length} programas educativos cargados`
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
                setSubjects(data)
                setOriginalSubjects(data)
                return `${data.length} materias cargadas`
            },
            error: 'Error al cargar las materias'
        })
        setSelectedEduKeys(e)
    }
    const handleSelectYear = () => {
        setSubjects(originalSubjects)
    }
    const handleSelectPeriod = (e: Set<Key>) => {
        if (e.size === 0) {
            setSubjects(originalSubjects)
            return
        }
        const currentCourse = periods.find(period => String(getFirstSetValue(e)).includes(period.period))
        const newSubjects = originalSubjects.filter(subject => {
            return currentCourse?.grades.includes(subject.period)
        })
        setSubjects(newSubjects)
    }
    useEffect(() => {
        const fetchPersonalData = async () => {
            const { data: { data, error } } = await getInsesnsitivePersonalData({
                area: String(areas.find(area => area.id === getFirstSetValue(selectedAreaKeys))?.name)
            })
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
        setStoredAreas({
            areas: ssrAreas
        })
        setStoredEducationalPrograms({
            educationalPrograms: ssrEducationalPrograms
        })
        return () => {
        };
    }, []);
    return (
        <div className="flex flex-col gap-2">
            <ModalError error={error} />
            <YearSelectorAlter
                defaultYear={String(new Date().getFullYear())}
                onSelectPeriod={handleSelectPeriod}
                onSelectYear={handleSelectYear}
                isDisabled={false}
                key={1}
            />
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
            <PeriodAccordions subjects={subjects} personalData={personalData} />
        </div >
    )
}