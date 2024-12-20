
import { Button, Input, SharedSelection, Textarea } from '@nextui-org/react'
import toast from 'react-hot-toast'
import { AcademicProgramSelector, ActTypeSelector, GroupSelector, ManagementTypeSelector, StayTypeSelector } from './Selector'
import { ChangeEvent, useEffect } from 'react'
import { PlusIcon } from './Icons'
import { UseSecretary, UseTemplates } from '../context'
import { } from '../utils'
import { CreateActivity, DefaultActivity } from '../models/types/activity'
import { EducationalProgram } from '../models/types/educational-program'
import { v4 as uuidv4 } from 'uuid'

type Event = React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>

export const ActivityCard = ({ activity, educationalPrograms }: {
    activity: CreateActivity,
    educationalPrograms: EducationalProgram[]
}) => {
    const {
        partialTemplateState: { selectedPartialTemplate },
        activityState: { activities, selectedActivity },
        setStoredPartialTemplates,
        setStoredActivities
    } = UseSecretary()
    const handleChange = (e: Event) => {
        setStoredActivities({
            selectedActivity: { ...selectedActivity, [e.target.name]: e.target.value }
        })
    }
    const handleDelete = () => {
        const newActivities = activities.filter(activity => activity.id !== selectedActivity.id)
        const selectedItem = newActivities.length > 1 ? newActivities[newActivities.length - 1] : newActivities[0]
        setStoredActivities({
            selectedActivity: selectedItem,
            activities: newActivities
        })
    }
    const changeManagementType = (e: SharedSelection) => {
        if (e === "all") return
        setStoredActivities({
            selectedActivity: {
                ...selectedActivity,
                managementType: e.size === 0 ? '' : e.anchorKey
            }
        })
    }
    const changeStayType = (e: SharedSelection) => {
        if (e === "all") return
        const weeklyHours = e.anchorKey === 'TSU' ? 1 : 2
        setStoredActivities({
            selectedActivity: {
                ...selectedActivity,
                weeklyHours,
                subtotalClassification: weeklyHours * (activity?.numberStudents || 0), stayType: e.size === 0 ? '' : e.anchorKey
            }
        })
    }
    const changeGroup = (e: SharedSelection) => {
        setStoredActivities({
            selectedActivity: {
                ...selectedActivity,
                gradeGroups: Array.from(e),
                subtotalClassification: Array.from(e).length * activity.weeklyHours
            }
        })
    }
    const changeWeeklyHours = (e: ChangeEvent<HTMLInputElement>) => {
        if (activity.activityDistribution === "Estadía técnica") {
            setStoredActivities({
                selectedActivity: {
                    ...selectedActivity, [e.target.name]: Number(e.target.value),
                    subtotalClassification: Number(e.target.value) * (activity.numberStudents || 1)
                }
            })
            return
        }
        if (
            activity.activityDistribution === "Docencia"
            || activity.activityDistribution === "Tutorías"
        ) {
            const subtotalClassification = activity.gradeGroups.length === 0 || e.target.value === '' ? '' : activity.gradeGroups.length * Number(e.target.value)
            setStoredActivities({
                selectedActivity: {
                    ...selectedActivity, [e.target.name]: Number(e.target.value),
                    subtotalClassification
                }
            })
        } else {
            setStoredActivities({
                selectedActivity: {
                    ...selectedActivity, [e.target.name]: Number(e.target.value),
                    subtotalClassification: Number(e.target.value)
                }
            })
        }
    }
    const changeActivityProgram = (e: SharedSelection) => {
        if (e === "all") return
        setStoredActivities({
            selectedActivity: {
                ...selectedActivity,
                educationalProgramId: e.size === 0 ? "" : e.anchorKey
            }
        })
    }
    const changeStudentsNumber = (e: ChangeEvent<HTMLInputElement>) => {
        setStoredActivities({
            selectedActivity: {
                ...selectedActivity, [e.target.name]: Number(e.target.value),
                subtotalClassification: Number(e.target.value) * (activity.weeklyHours || 1)
            }
        })
    }
    const updateTotal = () => {
        const total = activities
            .map(activity => activity.subtotalClassification)
            .reduce((p, c) => p + c, 0)
        setStoredPartialTemplates({
            selectedPartialTemplate: {
                ...selectedPartialTemplate,
                total
            }
        })
    }
    useEffect(() => {
        updateTotal()
    }, [activity.subtotalClassification])

    useEffect(() => {
        setStoredActivities({
            activities: activities.map(activity => activity.id === selectedActivity.id ? selectedActivity : activity)
        })
    }, [selectedActivity])

    return (
        <div className='flex flex-col gap-2'>
            <div className='flex flex-col md:flex-row gap-2'>
                <ActTypeSelector activity={activity} handler={handleChange} />
                {
                    (
                        activity.activityDistribution === "Gestión"
                    ) && (
                        <ManagementTypeSelector activity={activity} handler={changeManagementType} />
                    )
                }
                {
                    !(
                        activity.activityDistribution === "Estadía técnica"
                        || activity.activityDistribution === "Tutorías"
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
                            defaultValue={activity?.activityName}
                        />
                    )
                }
                {
                    (
                        activity.activityDistribution === "Estadía técnica"
                    ) && (
                        <StayTypeSelector activity={activity} handler={changeStayType} />
                    )
                }
            </div>
            {
                !(
                    activity.activityDistribution === "Estadía técnica"
                    || activity.activityDistribution === "Gestión"
                    || activity.activityDistribution === "LIIAD"
                ) && (
                    <AcademicProgramSelector activity={activity} educationalPrograms={educationalPrograms} handler={changeActivityProgram} />
                )
            }
            {
                !(
                    activity.activityDistribution === "LIIAD"
                    || activity.activityDistribution === "Estadía técnica"
                    || activity.activityDistribution === "Gestión"
                ) && (
                    <GroupSelector activity={activity} handler={changeGroup} />
                )
            }
            <div className='flex gap-2'>
                {
                    (activity.activityDistribution === "Estadía técnica") && (
                        <Input
                            label="Número de estudiantes"
                            type="number"
                            defaultValue={`${activity.numberStudents}`}
                            name="numberStudents"
                            onChange={changeStudentsNumber}
                            min={1}
                        />
                    )
                }
                <Input label="Horas semanales" type="number" name="weeklyHours" min={1} value={activity?.weeklyHours === 0 ? '' : `${activity?.weeklyHours}`} onChange={changeWeeklyHours} />
            </div>
            <Input
                label="Subtotal por clasificación"
                type="number"
                name="subtotalClassification"
                value={activity?.subtotalClassification === 0 ? '' : `${activity?.subtotalClassification}`}
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

export const AddActivityButton = ({ isDisabled }: { isDisabled: boolean }) => {
    const { activityState: { activities }, setStoredActivities } = UseSecretary()
    const handleCreate = () => {
        if (activities.length >= 10) {
            return toast.error('No puedes agregar más carga academica', {
                id: 'max-activities'
            })
        }
        const newActivity = {
            ...DefaultActivity,
            id: uuidv4()
        }
        setStoredActivities({
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
