import { useEffect, useState } from 'react'
import { AcademicCharge } from './AcademicCharge'
import { YearAndPeriodSelector } from './Selector'
import { Button, Input, Select, SelectItem, Textarea } from '@nextui-org/react'
import { NtInput } from './WorkerNumber'
import { AddActivityButton } from './Activity'
import toast from 'react-hot-toast'
import { CheckIcon } from './Icons'
import { UseTemplates } from '../context'
import { checkSocketStatus, positions, sumHours } from '../utils'
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
    const getPosition = (position) => {
        if (position === "") return []
        if (!positions.includes(position)) {
            positions.push(position)
            return [position]
        }
        return [partialTemplate.position]
    }
    const totalHours = sumHours({ activities: activities })
    const handleSubmit = () => {
        setLoading(true)
        toast.promise(insertPartialTemplateAndActivities({
            data: { template: partialTemplate, activities }
        }), {
            loading: 'Guardando plantilla...',
            success: ({ data, error, message }) => {
                if (error) return message
                setStored({ partialTemplate: data.template })
                playNotifySound()
                if (checkSocketStatus(socket, toast)) {
                    socket.connect()
                } else {
                    socket.emit('createTemplate', data.template)
                }
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
        <form className="flex flex-col gap-2">
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
        </form>
    )
}
