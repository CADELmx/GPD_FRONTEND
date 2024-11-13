import { checkSocketStatus, positions, sumHours } from '@/utils'
import { useEffect, useState } from 'react'
import { AcademicCharge } from './AcademicCharge'
import { YearAndPeriodSelector } from './Selector'
import { Button, Input, Select, SelectItem, Textarea } from '@nextui-org/react'
import { NtInput } from './WorkerNumber'
import { AddActivityButton } from './Activity'
import { UseTemplates } from '@/context'
import toast from 'react-hot-toast'

export const AcademicTemplateForm = ({ academicPrograms, academicWorkers, template }) => {
    const { memory: { partialTemplate, selectedActivity, activities, socket }, setStored, handleGlobalChange } = UseTemplates()
    const [loading, setLoading] = useState(false)
    const getPosition = (position) => {
        if (position === "") return []
        if (!positions.includes(position)) {
            positions.push(position)
            return [position]
        }
        return [partialTemplate.position]
    }
    const totalHours = sumHours(activities)
    const handleSubmit = () => {
        if (checkSocketStatus(socket, toast)) return socket.connect()
        setLoading(true)
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
        <div className="flex flex-col items-center justify-center">
            <div className="flex-col object-fill w-5/6 sm:w-2/3 pt-5 mt-5">
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
                            className="w-40"
                            label="Sexo"
                            name="gender"
                            onChange={handleGlobalChange}
                        >
                            <SelectItem key={'H'} variant="flat">H</SelectItem>
                            <SelectItem key={'M'} variant="flat">M</SelectItem>
                        </Select>
                    </div>
                    <Select selectedKeys={getPosition(partialTemplate.position)} label='Puesto' name='position' onChange={handleGlobalChange}>
                        {
                            positions.map((p) => <SelectItem key={p} textValue={p} variant="flat">{p}</SelectItem>)
                        }
                    </Select>
                    <YearAndPeriodSelector />
                    <AcademicCharge academicPrograms={academicPrograms} />
                    <AddActivityButton isDisabled={partialTemplate?.id} />
                    <Input
                        label="Total"
                        type="number"
                        min={0}
                        name="total"
                        value={totalHours == 0 ? '' : totalHours}
                        defaultValue={partialTemplate?.total}
                        isDisabled
                        onChange={handleGlobalChange}
                    />
                    <Button
                        startContent={
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                            </svg>
                        }
                        className="w-full bg-utim"
                        variant="solid"
                        onPress={handleSubmit}
                        isDisabled={(partialTemplate?.id) || (totalHours < 32)}
                        isLoading={loading}
                    >
                        Guardar
                    </Button>
                </form>
            </div>
        </div>
    )
}
