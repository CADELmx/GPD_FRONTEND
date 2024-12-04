import { ChangeEvent, Key, useEffect, useState } from 'react'
import { AcademicCharge } from './AcademicCharge'
import { YearSelectorAlter } from './Selector'
import { Button, Input, Select, Selection, SelectItem, Textarea } from '@nextui-org/react'
import { NtInput } from './WorkerNumber'
import { AddActivityButton } from './Activity'
import toast from 'react-hot-toast'
import { CheckIcon } from './Icons'
import { UseSecretary, UseTemplates } from '../context'
import { AddToPositionIfNotExists, checkEmptyStringOption, checkIfUndefined, getFirstSetValue, periods, positions, sumHours } from '../utils'
import { insertPartialTemplateAndActivities } from '../models/transactions/partial-template'
import { playNotifySound } from '../toast'
import { EducationalProgram } from '../models/types/educational-program'
import { PersonalData } from '../models/types/personal-data'
import { PartialTemplate } from '../models/types/partial-template'
import { Template } from '@/models/types/template'

export const AcademicTemplateForm = ({
    educationalPrograms,
    academicWorkers,
    partialTemplate: ssrPartialTemplate,
}: {
    educationalPrograms: EducationalProgram[],
    academicWorkers: PersonalData[],
    partialTemplate?: PartialTemplate,
    template?: Template
}) => {
    const { memory: { socket }, setStored } = UseTemplates()
    const {
        activityState: { activities },
        templateState: { selectedTemplate },
        partialTemplateState: { partialTemplates, selectedPartialTemplate },
        setStoredPartialTemplates,
    } = UseSecretary()
    const [loading, setLoading] = useState(false)
    const currentYear = String(new Date().getFullYear())
    const currentMonth = new Date().toLocaleString('es-MX', { month: 'long' })
    const currentPeriod = periods.find(p => p.months.includes(currentMonth))
    const defaultPeriodKey = `${currentPeriod?.period} ${currentYear}: Ordinario`
    const totalHours = sumHours({ activities: activities })

    const handlePartialTemplateChange = (e: ChangeEvent<HTMLInputElement>) => {
        setStoredPartialTemplates({
            selectedPartialTemplate: {
                ...selectedPartialTemplate,
                [e.target.name]: e.target.value
            }
        })
    }

    const handleSelectGender = (e: Selection) => {
        if (e === "all") return
        setStoredPartialTemplates({
            selectedPartialTemplate: {
                ...selectedPartialTemplate,
                gender: String(getFirstSetValue(e))
            }
        })
    }

    const handleSelectPosition = (e: Selection) => {
        if (e === "all") return
        setStoredPartialTemplates({
            selectedPartialTemplate: {
                ...selectedPartialTemplate,
                position: String(getFirstSetValue(e))
            }
        })
    }

    const handleSelectPeriod = (e: Set<Key>) => {
        const option = String(getFirstSetValue(e))
        const groups = periods.find(opt => {
            return e.has(opt.period)
        })
        const defaultGroups = option === "" ? [] :
            groups?.grades.map(g => [`${g}A`, `${g}B`, `${g}C`]).flat()
        setStored({
            defaultGroups
        })
        setStoredPartialTemplates({
            selectedPartialTemplate: {
                ...selectedPartialTemplate,
                period: String(getFirstSetValue(e)),
            }
        })
    }

    const handleSelectYear = (e: Set<Key>) => {
        setStoredPartialTemplates({
            selectedPartialTemplate: {
                ...selectedPartialTemplate,
                year: String(getFirstSetValue(e)),
                period: ''
            }
        })
    }

    const handleSubmit = () => {
        setLoading(true)
        const newPartialTemplate = {
            ...selectedPartialTemplate,
            total: Number(selectedPartialTemplate.total),
            nt: Number(selectedPartialTemplate.nt),
        }
        const newActivities = activities.map(activity => {
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
                setStoredPartialTemplates({ partialTemplates: [...partialTemplates, data?.template] })
                playNotifySound()
                socket.emit('createTemplate', data?.template)
                return 'Plantilla guardada'
            },
            error: 'Error al enviar plantilla'
        })
    }

    useEffect(() => {
        .log(selectedPartialTemplate)
    }, [selectedPartialTemplate])

    useEffect(() => {

        if (ssrPartialTemplate?.id) {
            setStoredPartialTemplates({
                selectedPartialTemplate: ssrPartialTemplate
            })
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
                !selectedPartialTemplate?.id && <NtInput academicWorkers={academicWorkers} />
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
                    onChange={handlePartialTemplateChange}
                    value={selectedPartialTemplate.name}
                />
                <Select
                    isRequired
                    className="w-40"
                    label="Sexo"
                    name="gender"
                    onSelectionChange={handleSelectGender}
                >
                    <SelectItem key={'H'} variant="flat">H</SelectItem>
                    <SelectItem key={'M'} variant="flat">M</SelectItem>
                </Select>
            </div>
            <Select
                items={AddToPositionIfNotExists(positions, selectedPartialTemplate.position)}
                label='Puesto'
                name='position'
                selectedKeys={checkEmptyStringOption(selectedPartialTemplate.position)}
                onSelectionChange={handleSelectPosition}
                isRequired
            >
                {
                    (p) => (
                        <SelectItem
                            key={p.name}
                            textValue={p.name}
                            variant="flat"
                        >
                            {p.name}
                        </SelectItem>
                    )
                }
            </Select>
            <YearSelectorAlter
                onSelectYear={handleSelectYear}
                onSelectPeriod={handleSelectPeriod}
                defaultYear={currentYear}
                defaultPeriod={defaultPeriodKey}
                isDisabled={Boolean(selectedTemplate.id)}
            />
            <AcademicCharge educationalPrograms={educationalPrograms} />
            <AddActivityButton isDisabled={Boolean(selectedPartialTemplate.id)} />
            <Input
                label="Total"
                type="number"
                min={0}
                name="total"
                value={`${totalHours == 0 ? '' : totalHours}`}
                defaultValue={`${selectedPartialTemplate?.total}`}
                isDisabled
                onChange={handlePartialTemplateChange}
            />
            <Button
                startContent={CheckIcon}
                className="w-full bg-utim"
                variant="solid"
                onPress={handleSubmit}
                isDisabled={Boolean((selectedPartialTemplate?.id) || (totalHours < 32))}
                isLoading={loading}
            >
                Guardar
            </Button>
        </div>
    )
}
