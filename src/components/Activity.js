import { StoredContext } from '@/context'
import { defaultActivity } from '@/utils'
import { Button, Input, Textarea } from '@nextui-org/react'
import toast from 'react-hot-toast'
import { AcademicProgramSelector, ActTypeSelector, GroupSelector, ManagementTypeSelector, StayTypeSelector } from './Selector'
import { useEffect } from 'react'

export const Activity = ({ act, eduPrograms }) => {
    const { memory: { record, selectedItem }, setStored } = StoredContext()
    const { activities: acts } = record
    const handleChange = (e) => {
        const activities = acts.map((activity) => {
            return (activity.id === selectedItem) ? { ...activity, [e.target.name]: e.target.value } : activity
        })
        setStored({
            record: {
                ...record,
                activities
            }
        })
    }
    const handleDelete = () => {
        const newActivities = acts.filter((activity) => activity.id !== act.id)
        const selectedItem = newActivities.length > 1 ? newActivities[newActivities.length - 1].id : newActivities[0].id
        setStored({
            selectedItem,
            record: {
                ...record,
                activities: newActivities
            }
        })
    }
    const changeManagementType = (e) => {
        setStored({
            record: {
                ...record, activities: acts.map((activity) => (activity.id === selectedItem) ? {
                    ...activity, managementType: e.size === 0 ? '' : e.anchorKey
                } : activity)
            }
        })
    }
    const changeStayType = (e) => {
        const weeklyHours = e.anchorKey === 'TSU' ? 1 : 2
        setStored({
            record: {
                ...record, activities: acts.map((activity) => (activity.id === selectedItem) ? {
                    ...activity, weeklyHours, subtotalClassification: weeklyHours * act.numberStudents, stayType: e.size === 0 ? '' : e.anchorKey
                } : activity)
            }
        })
    }
    const changeGroup = (e) => {
        setStored({
            record: {
                ...record, activities: acts.map((activity) => activity.id === selectedItem ? {
                    ...activity, gradeGroups: Array.from(e), subtotalClassification: Array.from(e).length * act.weeklyHours
                } : a)
            }
        })
    }
    const changeWeekleyHours = (e) => {
        if (act.activityDistribution === "Estadía técnica") {
            setStored({
                record: {
                    ...record, activities: acts.map(
                        (activity) => activity.id === selectedItem ? { ...activity, [e.target.name]: Number(e.target.value), subtotalClassification: Number(e.target.value) * (act.numberStudents || 1) } : activity)
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
                record: {
                    ...record, activities: acts.map((activity) => activity.id === selectedItem ? {
                        ...activity, [e.target.name]: Number(e.target.value), subtotalClassification
                    } : activity)
                }
            })
        } else {
            setStored({
                record: {
                    ...record, activities: acts.map(
                        (activity) => activity.id === selectedItem ? { ...activity, [e.target.name]: Number(e.target.value), subtotalClassification: Number(e.target.value) } : activity)
                }
            })
        }
    }
    const changeActivityProgram = (e) => {
        setStored({
            record: {
                ...record, activities: acts.map((activity) => (activity.id === selectedItem) ? {
                    ...activity, pe: e.size === 0 ? "" : e.anchorKey
                } : activity)
            }
        })
    }
    const changeStudentsNumber = (e) => {
        setStored({
            record: {
                ...record, activities: acts.map(
                    (activity) => activity.id === selectedItem ? {
                        ...activity, [e.target.name]: Number(e.target.value), subtotalClassification: Number(e.target.value) * (act.weeklyHours || 1)
                    } : activity)
            }
        })
    }
    const updateTotal = () => {
        const total = record.activities
            .map(e => e.subtotalClassification)
            .reduce((p, c) => p + c, 0)
        setStored({
            selectedItem: acts.length > 1 ? acts[acts.length - 2].id : acts[0].id,
            record: {
                ...record,
                total
            }
        })
    }
    useEffect(() => {
        updateTotal()
    }, [act.subtotalClassification])

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
                        <Textarea minRows={1} size='sm' radius='md' label="Nombre de actividades" type="text" name="activityName" onChange={handleChange} isRequired defaultValue={act.activityName} />
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
                    <AcademicProgramSelector act={act} eduPrograms={eduPrograms} handler={changeActivityProgram} />
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
                        <Input label="Número de estudiantes" type="number" defaultValue={act.numberStudents} name="numberStudents" onChange={changeStudentsNumber} min={1} />
                    )
                }
                <Input label="Horas semanales" type="number" name="weeklyHours" min={1} value={act?.weeklyHours === 0 ? '' : act?.weeklyHours} onChange={changeWeekleyHours} />
            </div>
            <Input label="Subtotal por clasificación" type="number" name="subtotalClassification" value={act?.subtotalClassification === 0 ? '' : act?.subtotalClassification} isDisabled />
            {
                acts.length > 1 && <Button color='danger' onClick={handleDelete}>
                    Eliminar actividad
                </Button>
            }
        </div>
    )
}

export const AddActivityButton = ({ isDisabled }) => {
    const { memory: { record, selectedItem }, setStored } = StoredContext()
    const { activities } = record
    const handleCreate = () => {
        if (activities.length >= 10) {
            return toast.error('No puedes agregar más carga academica', {
                id: 'max-activities'
            })
        }
        const uuid = crypto.randomUUID()
        setStored({
            record: {
                ...record, activities: [...activities, {
                    ...defaultActivity,
                    id: uuid
                }]
            },
            selectedItem: uuid
        })
        console.log('Activity created', selectedItem)
    }
    return (
        <Button
            isDisabled={isDisabled}
            startContent={
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
            }
            className="w-full"
            variant="solid"
            color="primary"
            onClick={handleCreate}
        >
            Agregar actividad
        </Button>
    )
}
