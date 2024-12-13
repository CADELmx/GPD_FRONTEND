
import { Button, Input, Select, Selection, SelectItem, SelectSection, Switch, Textarea } from "@nextui-org/react"
import { ChangeEvent, Key, useEffect, useState } from "react"
import { UseSecretary, UseTemplates } from "../context"
import { activitiesDistribution, checkEmptyStringOption, generatePeriods, getFirstSetValue, InitSelectedKeys, periods } from "../utils"
import { EducationalProgram } from "../models/types/educational-program"
import { CreateActivity } from "../models/types/activity"

interface SelectorProps {
    activity: CreateActivity
    handler: any
}

export const ActTypeSelector = ({ activity, handler }: SelectorProps) => {
    return (
        <Select
            className={activity?.activityDistribution === "Tutorías" ? '' : 'md:w-3/5'}
            label="Distribución"
            onChange={handler}
            name="activityDistribution"
            isRequired
            defaultSelectedKeys={checkEmptyStringOption(activity?.activityDistribution)}
        >
            {
                activitiesDistribution.map((a) => {
                    return <SelectItem key={a} variant="flat">{a}</SelectItem>
                })
            }
        </Select>
    )
}

export const ManagementTypeSelector = ({ activity, handler }: SelectorProps) => {
    return (
        <Select className='md:w-2/4' name='managementType' label='Tipo de gestión' onSelectionChange={handler} defaultSelectedKeys={checkEmptyStringOption(activity?.managementType)}>
            <SelectItem key={'INST'} variant="flat">Institucional</SelectItem>
            <SelectItem key={'ACAD'} variant="flat">Académica</SelectItem>
            <SelectItem key={'ASES'} variant='flat'>Asesoría</SelectItem>
        </Select>
    )
}

export const StayTypeSelector = ({ activity, handler }: SelectorProps) => {
    return (
        <Select
            className=''
            onSelectionChange={handler}
            name='stayType'
            label='Tipo de estadía'
            defaultSelectedKeys={checkEmptyStringOption(activity.stayType)}
            disallowEmptySelection
        >
            <SelectItem key='TSU'>TSU</SelectItem>
            <SelectItem key='ING'>ING</SelectItem>
        </Select>
    )
}

export const GroupSelector = ({ activity, handler }: SelectorProps) => {
    const { partialTemplateState: { selectedPartialTemplate } } = UseSecretary()
    const currentPeriod = periods.find(p => selectedPartialTemplate.period.includes(p.period)
    )
    const defaultGrades = [
        {
            id: 1,
            name: 'A',
        },
        {
            id: 2,
            name: 'B',
        },
        {
            id: 3,
            name: 'C',
        },
    ]
    const defaultGroups = currentPeriod?.grades.map(grade => {
        return (
            defaultGrades.map(g => `${grade}${g.name}`)
        )
    }).flat()
    if (!defaultGroups) {
        return (<div>
            No hay grupos disponibles
        </div>)
    }
    return (
        <div className="flex flex-col gap-2 sm:flex-row">
            <Select
                isDisabled={!activity.educationalProgramId}
                label="Grados y grupos"
                name="gradeGroups"
                selectionMode="multiple"
                description="Selección múltiple"
                defaultSelectedKeys={activity.gradeGroups}
                onSelectionChange={handler}
            >
                {
                    defaultGroups.map((grupo) => (
                        <SelectItem key={grupo} variant="flat">{grupo}</SelectItem>
                    ))
                }
            </Select>
            <Input className="md:w-1/3" isReadOnly label='Nº de grupos' value={activity.gradeGroups.length === 0 ? '' : `${activity.gradeGroups.length}`} isDisabled />
        </div>
    )
}

interface AcademicProgramSelectorProps extends SelectorProps {
    educationalPrograms: EducationalProgram[]
}

export const AcademicProgramSelector = (
    { activity, educationalPrograms, handler }: AcademicProgramSelectorProps
) => {
    return (
        <div className="flex flex-col md:flex-row gap-2">
            <Select
                isDisabled={activity?.activityDistribution === ""}
                className="md:w-2/5"
                label='Programa educativo'
                name='educationalProgramId'
                defaultSelectedKeys={activity.educationalProgramId ? [activity.educationalProgramId] : []}
                onSelectionChange={handler}
                items={educationalPrograms}
            >
                {
                    (educationalProgram) => (
                        <SelectItem
                            key={educationalProgram.id} variant="flat">{educationalProgram.abbreviation}</SelectItem>
                    )
                }
            </Select>
            <Textarea
                minRows={1}
                size="sm"
                radius="md"
                isReadOnly
                label='Detalles PE'
                isDisabled
                value={educationalPrograms.find(educationalProgram => educationalProgram.id == activity.educationalProgramId)?.description}
            />
        </div>
    )
}

export const YearSelectorAlter = ({
    defaultYear,
    defaultPeriod,
    onSelectPeriod,
    onSelectYear,
    isDisabled = false
}: {
    defaultYear: string,
    defaultPeriod?: string,
    onSelectYear: (e: Set<Key>) => void,
    onSelectPeriod: (e: Set<Key>) => void,
    isDisabled?: boolean
}) => {
    const [selectedYearKeys, setSelectedYearKeys] = useState(new Set([defaultYear as Key]))
    const [selectedPeriodKeys, setSelectedPeriodKeys] = useState(new Set(defaultPeriod === "" ? [] : [defaultPeriod as Key]))
    const handleSelectYear = (e: Selection) => {
        if (e === "all") return
        setSelectedPeriodKeys(InitSelectedKeys())
        onSelectYear(e)
        setSelectedYearKeys(e)
    }
    const handleSelectPeriod = (e: Selection) => {
        if (e === "all") return
        onSelectPeriod(e)
        setSelectedPeriodKeys(e)
    }
    const yearList = Array.from({ length: 3 }, (_, k) => ({
        key: `${Number(defaultYear) - k + 1}`,
        value: `${Number(defaultYear) - k + 1}`
    }))
    const ordinaryPeriods = generatePeriods({ ordinary: true, year: Number(getFirstSetValue(selectedYearKeys)) })
    const notOrdinaryPeriods = generatePeriods({ ordinary: false, year: Number(getFirstSetValue(selectedYearKeys)) })
    return (
        <div className="flex flex-col sm:flex-row gap-2 items-center">
            <Select
                className="sm:w-1/4 md:w-1/3"
                label='Año'
                isRequired
                isDisabled={isDisabled}
                disallowEmptySelection
                defaultSelectedKeys={[defaultYear]}
                selectedKeys={selectedYearKeys as Selection}
                onSelectionChange={handleSelectYear}
                items={yearList}
            >
                {
                    ({ value, key }) => (
                        <SelectItem key={key} variant="flat">
                            {value}
                        </SelectItem>
                    )
                }
            </Select>
            <Select
                isRequired
                isDisabled={isDisabled}
                label='Periodo'
                disallowEmptySelection
                defaultSelectedKeys={defaultPeriod ? [defaultPeriod] : []}
                placeholder="Selecciona un periodo"
                selectedKeys={selectedPeriodKeys as Selection}
                onSelectionChange={handleSelectPeriod}
            >
                <SelectSection title={'Ordinario'} items={ordinaryPeriods}>
                    {
                        (p) => <SelectItem key={p.period}>
                            {p.period}
                        </SelectItem>
                    }
                </SelectSection>
                <SelectSection title={'Extraordinario'} items={notOrdinaryPeriods}>

                    {(p) => <SelectItem key={p.period}>
                        {p.period}
                    </SelectItem>}
                </SelectSection>
            </Select>
        </div>
    )
}