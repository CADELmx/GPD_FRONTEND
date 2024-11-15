import { StoredContext, UseTemplates } from '@/context'
import { defaultActivity } from '@/utils'
import { Button, Input, Textarea } from '@nextui-org/react'
import toast from 'react-hot-toast'
import { AcademicProgramSelector, ActTypeSelector, GroupSelector, ManagementTypeSelector, StayTypeSelector } from './Selector'
import { useEffect } from 'react'
import { PlusIcon } from './Icons'

export const Activity = ({ act, educationalPrograms }) => {
    const { memory: { partialTemplate, activities, selectedActivity }, setStored } = UseTemplates()
    const handleChange = (e) => {
        setStored({
            selectedActivity: { ...selectedActivity, [e.target.name]: e.target.value }
        })
    }
    const handleDelete = () => {
        const newActivities = activities.filter(activity => activity.id !== selectedActivity.id)
        const selectedItem = newActivities.length > 1 ? newActivities[newActivities.length - 1] : newActivities[0]
        setStored({
            selectedActivity: selectedItem,
            activities: newActivities
        })
    }
    const changeManagementType = (e) => {
        setStored({
            selectedActivity: {
                ...selectedActivity,
                managementType: e.size === 0 ? '' : e.anchorKey
            }
        })
    }
    const changeStayType = (e) => {
        const weeklyHours = e.anchorKey === 'TSU' ? 1 : 2
        setStored({
            selectedActivity: {
                ...selectedActivity,
                weeklyHours,
                subtotalClassification: weeklyHours * act.numberStudents, stayType: e.size === 0 ? '' : e.anchorKey
            }
        })
    }
    const changeGroup = (e) => {
        setStored({
            selectedActivity: {
                ...selectedActivity,
                gradeGroups: Array.from(e),
                subtotalClassification: Array.from(e).length * act.weeklyHours
            }
        })
    }
    const changeWeeklyHours = (e) => {
        if (act.activityDistribution === "Estadía técnica") {
            setStored({
                selectedActivity: {
                    ...selectedActivity, [e.target.name]: Number(e.target.value), subtotalClassification: Number(e.target.value) * (act.numberStudents || 1)
                }
            })
            return
        }
        if (
            act.activityDistribution === "Docencia"
            || act.activityDistribution === "Tutorías"
        ) {
            const subtotalClassification = act.gradeGroups.length === 0 || e.target.value === '' ? '' : act.gradeGroups.length * Number(e.target.value)
            setStored({
                selectedActivity: {
                    ...selectedActivity, [e.target.name]: Number(e.target.value), subtotalClassification
                }
            })
        } else {
            setStored({
                selectedActivity: {
                    ...selectedActivity, [e.target.name]: Number(e.target.value), subtotalClassification: Number(e.target.value)
                }
            })
        }
    }
    const changeActivityProgram = (e) => {
        setStored({
            selectedActivity: {
                ...selectedActivity, educationalProgramId: e.size === 0 ? "" : e.anchorKey
            }
        })
    }
    const changeStudentsNumber = (e) => {
        setStored({
            selectedActivity: {
                ...selectedActivity, [e.target.name]: Number(e.target.value), subtotalClassification: Number(e.target.value) * (act.weeklyHours || 1)
            }
        })
    }
    const updateTotal = () => {
        const total = activities
            .map(activity => activity.subtotalClassification)
            .reduce((p, c) => p + c, 0)
        setStored({
            partialTemplate: {
                ...partialTemplate,
                total
            }
        })
    }
    useEffect(() => {
        updateTotal()
    }, [act.subtotalClassification])

    useEffect(() => {
        setStored({
            activities: activities.map(activity => activity.id === selectedActivity.id ? selectedActivity : activity)
        })
    }, [selectedActivity])

    return (
        <div className='flex flex-col gap-2'>
            <div className='flex flex-col md:flex-row gap-2'>
                <ActTypeSelector act={act} handler={handleChange} />
                {
                    (
                        act.activityDistribution === "Gestión"
                    ) && (
                        <ManagementTypeSelector act={act} handler={changeManagementType} />
                    )
                }
                {
                    !(
                        act.activityDistribution === "Estadía técnica"
                        || act.activityDistribution === "Tutorías"
                    ) && (
                        <Textarea
                            minRows={1}
                            size='sm'
                            radius='md'
                            label="Nombre de actividades"
                            type="text"
                            name="activityName"
                            onChange={handleChange}
                            isRequired
                            defaultValue={act?.activityName}
                        />
                    )
                }
                {
                    (
                        act.activityDistribution === "Estadía técnica"
                    ) && (
                        <StayTypeSelector act={act} handler={changeStayType} />
                    )
                }
            </div>
            {
                !(
                    act.activityDistribution === "Estadía técnica"
                    || act.activityDistribution === "Gestión"
                    || act.activityDistribution === "LIIAD"
                ) && (
                    <AcademicProgramSelector act={act} educationalPrograms={educationalPrograms} handler={changeActivityProgram} />
                )
            }
            {
                !(
                    act.activityDistribution === "LIIAD"
                    || act.activityDistribution === "Estadía técnica"
                    || act.activityDistribution === "Gestión"
                ) && (
                    <GroupSelector act={act} handler={changeGroup} />
                )
            }
            <div className='flex gap-2'>
                {
                    (act.activityDistribution === "Estadía técnica") && (
                        <Input
                            label="Número de estudiantes"
                            type="number"
                            defaultValue={act.numberStudents}
                            name="numberStudents"
                            onChange={changeStudentsNumber}
                            min={1}
                        />
                    )
                }
                <Input label="Horas semanales" type="number" name="weeklyHours" min={1} value={act?.weeklyHours === 0 ? '' : act?.weeklyHours} onChange={changeWeeklyHours} />
            </div>
            <Input
                label="Subtotal por clasificación"
                type="number"
                name="subtotalClassification"
                value={act?.subtotalClassification === 0 ? '' : act?.subtotalClassification}
                isDisabled
            />
            {
                activities.length > 1 && <Button color='danger' onClick={handleDelete}>
                    Eliminar actividad
                </Button>
            }
        </div>
    )
}

export const AddActivityButton = ({ isDisabled }) => {
    const { memory: { activities }, setStored } = UseTemplates()
    const handleCreate = () => {
        if (activities.length >= 10) {
            return toast.error('No puedes agregar más carga academica', {
                id: 'max-activities'
            })
        }
        const newActivity = {
            ...defaultActivity,
            id: crypto.randomUUID()
        }
        setStored({
            activities: [
                ...activities,
                newActivity
            ],
            selectedActivity: newActivity
        })
    }
    return (
        <Button
            isDisabled={isDisabled}
            startContent={PlusIcon}
            className="w-full"
            variant="solid"
            color="primary"
            onClick={handleCreate}
        >
            Agregar actividad
        </Button>
    )
}
