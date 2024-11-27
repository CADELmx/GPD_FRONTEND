import { useEffect, useState } from 'react'
import { AcademicCharge } from './AcademicCharge'
import { YearAndPeriodSelector, YearSelectorAlter } from './Selector'
import { Button, Input, Select, SelectItem, Textarea } from '@nextui-org/react'
import { NtInput } from './WorkerNumber'
import { AddActivityButton } from './Activity'
import toast from 'react-hot-toast'
import { CheckIcon } from './Icons'
import { UseTemplates } from '../context'
import { getFirstSetValue, periods, positions, sumHours } from '../utils'
import { insertPartialTemplateAndActivities } from '../models/transactions/partial-template'
import { playNotifySound } from '../toast'
import { EducationalProgram } from '../models/types/educational-program'
import { PersonalData } from '../models/types/personal-data'
import { PartialTemplate } from '../models/types/partial-template'

export const AcademicTemplateForm = ({ educationalPrograms, academicWorkers, template }: {
    educationalPrograms: EducationalProgram[],
    academicWorkers: PersonalData[],
    template?: PartialTemplate
}) => {
    const { memory: { partialTemplate, activities, socket }, setStored, handleGlobalChange } = UseTemplates()
    const [loading, setLoading] = useState(false)
    const currentYear = String(new Date().getFullYear())
    const currentMonth = new Date().toLocaleString('es-MX', { month: 'long' })
    const currentPeriod = periods.find(p => p.months.includes(currentMonth))
    const defaultPeriodKey = `${currentPeriod?.period} ${currentYear}: Ordinario`
    const getPosition = (position: string) => {
        if (position === "") return []
        if (!positions.includes(position)) {
            positions.push(position)
            return [position]
        }
        return [partialTemplate?.position]
    }
    const totalHours = sumHours({ activities: activities })
    const handleSubmit = () => {
        setLoading(true)
        const newPartialTemplate = {
            ...partialTemplate,
            total: Number(partialTemplate.total),
            nt: Number(partialTemplate.nt),
        }
        const newActivities = activities.map(activity => {
            const checkIfUndefined = (v: number | undefined) => {
                if (v === undefined) return v
                if (isNaN(Number(v))) return v
                return Number(v)
            }
            return {
                ...activity,
                educationalProgramId: checkIfUndefined(activity.educationalProgramId),
                numberStudents: checkIfUndefined(activity.numberStudents),
                partialTemplateId: checkIfUndefined(activity.partialTemplateId),
                subtotalClassification: Number(activity.subtotalClassification),
                weeklyHours: Number(activity.weeklyHours),
            }
        })
        toast.promise(insertPartialTemplateAndActivities({
            data: { template: newPartialTemplate, activities: newActivities }
        }), {
            loading: 'Guardando plantilla...',
            success: ({ data, error, message }) => {
                if (error) return message
                setStored({ partialTemplate: data?.template })
                playNotifySound()
                socket.emit('createTemplate', data?.template)
                return 'Plantilla guardada'
            },
            error: 'Error al enviar plantilla'
        })
    }
    useEffect(() => {
        if (partialTemplate?.id) {
            setStored({ partialTemplate: template })
        }
        const onCreatedTemplate = () => {
            setLoading(false)
            toast.success('Plantilla guardada', {
                id: 'template-save'
            })
        }
        const onTemplateError = () => {
            setLoading(false)
            toast.error('Error al guardar plantilla', {
                id: 'template-save'
            })
        }
        socket.on('createdTemplate', onCreatedTemplate)
        socket.on('templateError', onTemplateError)
        return () => {
            socket.off('createdTemplate', onCreatedTemplate)
            socket.off('templateError', onTemplateError)
        }
    }, [])
    return (
        <div className="flex flex-col gap-2">
            {
                !partialTemplate?.id && <NtInput academicWorkers={academicWorkers} />
            }
            <div className="flex gap-2" >
                <Textarea
                    minRows={1}
                    size="sm"
                    radius="md"
                    isRequired
                    label="Nombre"
                    type="text"
                    name="name"
                    onChange={handleGlobalChange}
                    value={partialTemplate?.name}
                />
                <Select
                    isRequired
                    className="w-40"
                    label="Sexo"
                    name="gender"
                    onChange={handleGlobalChange}
                >
                    <SelectItem key={'H'} variant="flat">H</SelectItem>
                    <SelectItem key={'M'} variant="flat">M</SelectItem>
                </Select>
            </div>
            <Select
                selectedKeys={getPosition(partialTemplate.position)}
                label='Puesto'
                name='position'
                onChange={handleGlobalChange}
                isRequired
            >
                {
                    positions.map((p) => <SelectItem key={p} textValue={p} variant="flat">{p}</SelectItem>)
                }
            </Select>
            <YearSelectorAlter
                onSelectPeriod={(e) => {
                    const option = String(getFirstSetValue(e))
                    const groups = periods.find(opt => {
                        return e.has(opt.period)
                    })
                    const defaultGroups = option === "" ? [] :
                        groups?.grades.map(g => [`${g}A`, `${g}B`, `${g}C`]).flat()
                    setStored({
                        defaultGroups,
                        partialTemplate: {
                            ...partialTemplate,
                            period: String(getFirstSetValue(e)),
                        }
                    })
                }}
                defaultYear={currentYear}
                defaultPeriod={defaultPeriodKey}
            />
            <YearAndPeriodSelector />
            <AcademicCharge educationalPrograms={educationalPrograms} />
            <AddActivityButton isDisabled={Boolean(partialTemplate.id)} />
            <Input
                label="Total"
                type="number"
                min={0}
                name="total"
                value={`${totalHours == 0 ? '' : totalHours}`}
                defaultValue={`${partialTemplate?.total}`}
                isDisabled
                onChange={handleGlobalChange}
            />
            <Button
                startContent={CheckIcon}
                className="w-full bg-utim"
                variant="solid"
                onPress={handleSubmit}
                isDisabled={Boolean((partialTemplate?.id) || (totalHours < 32))}
                isLoading={loading}
            >
                Guardar
            </Button>
        </div>
    )
}
