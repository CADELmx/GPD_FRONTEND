import { UseTemplates } from "@/context"
import { activitiesDistribution, checkEmptyStringOption, generatePeriods } from "@/utils"
import { Input, Select, SelectItem, SelectSection, Switch, Textarea } from "@nextui-org/react"
import { useEffect, useState } from "react"
import { LockIcon } from "./Icons"

const YearSelector = ({ selectedYear, setState }) => {
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

const PeriodSelector = ({ selectedYear }) => {
    const { setStored, memory: { partialTemplate } } = UseTemplates()
    const periods = [
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
            grades: ['1', '4', '7'],
            months: ['septiembre', 'octubre', 'noviembre', 'diciembre']
        }
    ]
    const handleChange = (e) => {
        const option = e.target.value
        const groups = periods.find(opt => {
            return option.includes(opt.period)
        })
        const defaultGroups = option === "" ? [] :
            groups.grades.map(g => [`${g}A`, `${g}B`, `${g}C`]).flat()
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
    const defaultPeriod = `${actualPeriod.period} ${selectedYear}: Ordinario`
    useEffect(() => {
        if (!partialTemplate.period) {
            handleChange({ target: { value: defaultPeriod } })
        }
    }, [])
    return (
        <Select
            label='Periodo'
            autoCapitalize="words"
            isRequired
            onChange={handleChange}
            disallowEmptySelectio
            defaultSelectedKeys={[defaultPeriod]}
        >
            <SelectSection title={'Ordinario'}>
                {
                    generatePeriods(selectedYear, true).map(p => {
                        return <SelectItem key={p} variant="flat">{p}</SelectItem>
                    })
                }
            </SelectSection>
            <SelectSection title={'Extraordinario'}>
                {
                    generatePeriods(selectedYear, false).map(p => {
                        return <SelectItem key={p} variant="flat">{p}</SelectItem>
                    })
                }
            </SelectSection>
        </Select>
    )
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

export const ActTypeSelector = ({ act, handler }) => {
    return (
        <Select
            className={act?.activityDistribution === "Tutorías" ? '' : 'md:w-3/5'}
            label="Distribución"
            onChange={handler}
            name="activityDistribution"
            isRequired
            defaultSelectedKeys={checkEmptyStringOption(act?.activityDistribution)}
        >
            {
                activitiesDistribution.map((a) => {
                    return <SelectItem key={a} variant="flat">{a}</SelectItem>
                })
            }
        </Select>
    )
}

export const ManagementTypeSelector = ({ act, handler }) => {
    return (
        <Select className='md:w-2/4' name='managementType' label='Tipo de gestión' onSelectionChange={handler} defaultSelectedKeys={[act?.managementType]}>
            <SelectItem key={'INST'} variant="flat">Institucional</SelectItem>
            <SelectItem key={'ACAD'} variant="flat">Académica</SelectItem>
            <SelectItem key={'ASES'} variant='flat'>Asesoría</SelectItem>
        </Select>
    )
}

export const StayTypeSelector = ({ act, handler }) => {
    return (
        <Select
            className=''
            onSelectionChange={handler}
            name='stayType'
            label='Tipo de estadía'
            defaultSelectedKeys={checkEmptyStringOption(act.stayType)}
            disallowEmptySelection
        >
            <SelectItem key='TSU'>TSU</SelectItem>
            <SelectItem key='ING'>ING</SelectItem>
        </Select>
    )
}

export const GroupSelector = ({ act, handler }) => {
    const { memory: { defaultGroups } } = UseTemplates()
    return (
        <div className="flex flex-col gap-2 sm:flex-row">
            <Select isDisabled={!act.educationalProgramId} label="Grados y grupos" name="gradeGroups" selectionMode="multiple" description="Selección múltiple" defaultSelectedKeys={act.gradeGroups} onSelectionChange={handler}
            >
                {
                    defaultGroups.map((grupo) => (
                        <SelectItem key={grupo} variant="flat">{grupo}</SelectItem>
                    ))
                }
            </Select>
            <Input className="md:w-1/3" isReadOnly label='Nº de grupos' value={act.gradeGroups.length === 0 ? '' : act.gradeGroups.length} isDisabled />
        </div>
    )
}

export const AcademicProgramSelector = ({ act, educationalPrograms, handler }) => {
    return (
        <div className="flex flex-col md:flex-row gap-2">
            <Select isDisabled={act?.activityDistribution === ""} className="md:w-2/5" label='Programa educativo' name='educationalProgramId' defaultSelectedKeys={act.educationalProgramId ? [act.educationalProgramId] : []} onSelectionChange={handler} items={educationalPrograms}>
                {
                    (educationalProgram) => (
                        <SelectItem key={educationalProgram.id} variant="flat">{educationalProgram.abbreviation}</SelectItem>
                    )
                }
            </Select>
            <Textarea minRows={1} size="sm" radius="md" isReadOnly label='Detalles PE' isDisabled value={educationalPrograms.find(e => e.id == act.educationalProgramId)?.description} />
        </div>
    )
}

export const YearSelectorAlter = () => {
    const defaultYear = String(new Date().getFullYear())
    const [year, setYear] = useState(defaultYear)
    const yearList = Array.from({ length: 3 }, (_, k) => ({
        key: `${defaultYear - k + 1}`,
        value: `${defaultYear - k + 1}`
    }))
    const [isDisabled, setIsDisabled] = useState(true);
    return (
        <div className="flex sm:flex gap-2 items-center">
            <Select className="w-full" isDisabled={isDisabled} label='Año' disallowEmptySelection selectedKeys={[year]} onChange={e => setYear(e.target.value)} items={yearList}>
                {
                    ({ value, key }) => <SelectItem key={key} variant="flat">{value}</SelectItem>
                }
            </Select>
            <Switch
                thumbIcon={LockIcon}
                onChange={() => setIsDisabled(!isDisabled)}
            />
        </div>
    )
}