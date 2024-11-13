import { StoredContext } from "@/context"
import { activitiesDistribution, checkEmptyStringOption, generatePeriods } from "@/utils"
import { Input, Select, SelectItem, SelectSection, Textarea } from "@nextui-org/react"
import { useEffect, useState } from "react"

const YearSelector = ({ selectedYear, setState }) => {
    const { memory: { record }, setStored } = StoredContext()
    const year = new Date().getFullYear()
    const yearList = Array.from({ length: 3 }, (_, k) => `${year - k + 1}`)
    return (
        <Select label='Año' disallowEmptySelection defaultSelectedKeys={[selectedYear]} className="md:w-2/5" onChange={e => {
            setState(e.target.value)
            setStored({ record: { ...record, year: e.target.value } })
        }}>
            {
                yearList.map((year) => {
                    return <SelectItem key={year} variant="flat">{year}</SelectItem>
                })
            }
        </Select>
    )
}

const PeriodSelector = ({ selectedYear }) => {
    const { setStored, memory: { record } } = StoredContext()
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
        setStored({ defaultGroups, record: { ...record, period: option, year: selectedYear } })
    }
    const actualMonth = new Date().toLocaleString('es-MX', { month: 'long' })
    const actualPeriod = periods.find(p => p.months.includes(actualMonth))
    const defaultPeriod = `${actualPeriod.period} ${selectedYear}: Ordinario`
    useEffect(() => {
        if (!record.period) {
            handleChange({ target: { value: defaultPeriod } })
        }
    }, [])
    return (
        <Select label='Periodo' autoCapitalize="words" onChange={handleChange} disallowEmptySelection defaultSelectedKeys={[defaultPeriod]}>
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
        <Select className={act?.activityDistribution === "Tutorías" ? '' : 'md:w-3/5'} label="Distribución" onChange={handler} name="activityDistribution" defaultSelectedKeys={checkEmptyStringOption(act?.activityDistribution)}>
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
        <Select className='' onSelectionChange={handler} name='stayType' label='Tipo de estadía' defaultSelectedKeys={checkEmptyStringOption(act.stayType)}>
            <SelectItem key='TSU'>TSU</SelectItem>
            <SelectItem key='ING'>ING</SelectItem>
        </Select>
    )
}

export const GroupSelector = ({ act, handler }) => {
    const { memory: { defaultGroups } } = StoredContext()
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

export const AcademicProgramSelector = ({ act, eduPrograms, handler }) => {
    return (
        <div className="flex flex-col md:flex-row gap-2">
            <Select isDisabled={act?.activityDistribution === ""} className="md:w-2/5" label='Programa educativo' name='educationalProgramId' defaultSelectedKeys={act.educationalProgramId ? [act.educationalProgramId] : []} onSelectionChange={handler} >
                {eduPrograms.length === 0 ? null :
                    eduPrograms.map((e) =>
                        <SelectItem key={e.id} variant="flat">{e.abbreviation}</SelectItem>)
                }
            </Select>
            <Textarea minRows={1} size="sm" radius="md" isReadOnly label='Detalles PE' isDisabled value={eduPrograms.find(e => e.id == act.educationalProgramId)?.description} />
        </div>
    )
}