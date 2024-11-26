
import { Input, Select, Selection, SelectItem, SelectSection, Switch, Textarea } from "@nextui-org/react"
import { ChangeEvent, Key, useEffect, useState } from "react"
import { LockIcon } from "./Icons"
import { UseTemplates } from "../context"
import { activitiesDistribution, checkEmptyStringOption, generatePeriods, getFirstSetValue, InitSelectedKeys, periods } from "../utils"
import { EducationalProgram } from "../models/types/educational-program"
import { CreateActivity } from "../models/types/activity"

const YearSelector = ({ selectedYear, setState }: { selectedYear: string, setState: any }) => {
    const { memory: { partialTemplate }, setStored } = UseTemplates()
    const year = new Date().getFullYear()
    const yearList = Array.from({ length: 3 }, (_, k) => `${year - k + 1}`)
    return (
        <Select
            label='Año'
            disallowEmptySelection
            defaultSelectedKeys={[selectedYear]}
            className="md:w-2/5"
            isRequired
            onChange={e => {
                setState(e.target.value)
                setStored({
                    partialTemplate: {
                        ...partialTemplate,
                        year: e.target.value
                    }
                })
            }}
        >
            {
                yearList.map((year) => {
                    return <SelectItem key={year} variant="flat">{year}</SelectItem>
                })
            }
        </Select>
    )
}

const PeriodSelector = ({ selectedYear }: { selectedYear: string }) => {
    const { setStored, memory: { partialTemplate } } = UseTemplates()

    const handleChange = (e: ChangeEvent<HTMLInputElement> | { target: { value: string } }) => {
        const option = e.target.value
        const groups = periods.find(opt => {
            return option.includes(opt.period)
        })
        const defaultGroups = option === "" ? [] :
            groups?.grades.map(g => [`${g}A`, `${g}B`, `${g}C`]).flat()
        setStored({
            defaultGroups,
            partialTemplate: {
                ...partialTemplate,
                period: option,
                year: selectedYear
            }
        })
    }
    const actualMonth = new Date().toLocaleString('es-MX', { month: 'long' })
    const actualPeriod = periods.find(p => p.months.includes(actualMonth))
    const defaultPeriod = `${actualPeriod?.period} ${selectedYear}: Ordinario`
    useEffect(() => {
        if (!partialTemplate?.period) {
            handleChange({ target: { value: defaultPeriod } })
        }
    }, [])
    return (
        <Select
            label='Periodo'
            autoCapitalize="words"
            isRequired
            onChange={handleChange}
            disallowEmptySelection
            defaultSelectedKeys={[defaultPeriod]}
        >
            <SelectSection title={'Ordinario'}>
                {
                    generatePeriods({ year: Number(selectedYear), ordinary: true }).map(p => {
                        return <SelectItem key={p.id} variant="flat">{p.period}</SelectItem>
                    })
                }
            </SelectSection>
            <SelectSection title={'Extraordinario'}>
                {
                    generatePeriods({
                        year: Number(selectedYear),
                        ordinary: false
                    }).map(p => {
                        return <SelectItem key={p.id} variant="flat">{p.period}</SelectItem>
                    })
                }
            </SelectSection>
        </Select>
    )
}

interface SelectorProps {
    activity: CreateActivity
    handler: any
}

export const YearAndPeriodSelector = () => {
    const year = new Date().getFullYear()
    const [selectedYear, setSelectedYear] = useState(`${year}`)
    return (
        <div className="flex flex-col sm:flex-row gap-2">
            <YearSelector setState={setSelectedYear} selectedYear={selectedYear} />
            <PeriodSelector selectedYear={selectedYear} />
        </div>
    )
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
    const { memory: { defaultGroups } } = UseTemplates()
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

export const YearSelectorAlter = ({ defaultYear, defaultPeriod, onSelectPeriod, onSelectYear }: { defaultYear: string, defaultPeriod?: string, onSelectYear: (e: Set<Key>) => void, onSelectPeriod: (e: Set<Key>) => void }) => {
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
                label='Periodo'
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