import { Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Select, Selection, SelectItem } from "@nextui-org/react"
import { ModalProps } from "../educationalProgram/EducationalProgramModal"
import { UseSecretary } from "@/context"
import React, { ChangeEvent, Key, useEffect, useState } from "react"
import { CreateSubject } from "@/models/types/subject"
import toast from "react-hot-toast"
import { createSubject, updateSubject } from "@/models/transactions/subject"
import { EducationalProgram } from "@/models/types/educational-program"
import { getEducationalProgramsByArea } from "@/models/transactions/educational-program"
import { getFirstSetValue, InitiSelectedKeys } from "@/utils"
import { getAreaByEducationalProgram } from "@/models/transactions/area"

export type PeriodType = {
    id: number,
    name: string
}

const periods: PeriodType[] = [
    {
        id: 1,
        name: '1'
    },
    {
        id: 2,
        name: '2'
    },
    {
        id: 3,
        name: '3'
    },
    {
        id: 4,
        name: '4'
    },
    {
        id: 5,
        name: '5'
    },
    {
        id: 7,
        name: '7'
    },
    {
        id: 8,
        name: '8'
    },
    {
        id: 9,
        name: '9'
    },
    {
        id: 10,
        name: '10'
    },
    {
        id: 11,
        name: '11'
    }
]

export const AddToArrayIfNotExists = (array: any[], value: any) => {
    if (array.includes(value)) return array
    return [...array, value]
}


export const SubjectModal = ({ isOpen, onOpen, onOpenChange }: ModalProps) => {
    const { subjectState: { selectedSubject, subjects }, setStoredSubjects, areaState: { areas } } = UseSecretary()
    const [areaSelectedKeys, setAreaSelectedKeys] = useState(InitiSelectedKeys)
    const [selectedEduKeys, setSelectedEduKeys] = useState(InitiSelectedKeys)
    const [educationalPrograms, setEducationalPrograms] = useState<EducationalProgram[]>([]);
    const handleChange = (e: ChangeEvent<HTMLSelectElement> | ChangeEvent<HTMLInputElement>) => {
        setStoredSubjects({
            selectedSubject: {
                ...selectedSubject,
                [e.target.name]:
                    (e.target.name === "weeklyHours" || e.target.name === "totalHours") ? Number(e.target.value) : e.target.value
            }
        })
    }
    const handlePeriodChange = (e: Selection) => {
        if (e === "all") return
        setStoredSubjects({
            selectedSubject: {
                ...selectedSubject,
                monthPeriod: getFirstSetValue(new Set(e))
            }
        })
    }
    const handleAreaChange = (e: Selection) => {
        if (e === "all") return
        setAreaSelectedKeys(e)
    }
    const handleEducationalProgramChange = (e: Selection) => {
        if (e === "all") return
        setSelectedEduKeys(e)
        setStoredSubjects({
            selectedSubject: {
                ...selectedSubject,
                educationalProgramId: Number(getFirstSetValue(new Set(e)))
            }
        })
    }
    const handleClose = () => {
        onOpenChange()
        setStoredSubjects({
            selectedSubject: null
        })
        setAreaSelectedKeys(new Set<any>([]))
        setSelectedEduKeys(new Set<any>([]))
        setEducationalPrograms([])
    }
    const handleUpdate = (id: number, newSubject: CreateSubject) => {
        toast.promise(updateSubject({ id, data: newSubject }), {
            loading: 'Actualizando materia',
            success: ({ data: { data, error, message } }) => {
                if (error) return message
                setStoredSubjects({
                    selectedSubject: null,
                    subjects: subjects.map(subject => subject.id === data.id ? data : subject)
                })
                onOpenChange()
                return message
            },
            error: 'Error al actualizar, intente de nuevo'
        })
    }
    const handleCreate = (subject: CreateSubject) => {
        toast.promise(createSubject({ data: subject }), {
            loading: 'Registrando materia',
            success: ({ data: { error, data, message } }) => {
                if (error) return message
                setStoredSubjects({
                    selectedSubject: null,
                    subjects: [...subjects, data]
                })
                onOpenChange()
                return message
            },
            error: 'Error al enviar materia'
        })
    }

    const handleSubmit = () => {
        const newEducationalProgram = {
            ...selectedSubject,
            educationalProgramId: Number(selectedSubject.educationalProgramId)
        }
        if (selectedSubject?.id) {
            handleUpdate(selectedSubject.id, newEducationalProgram)
        } else {
            handleCreate(newEducationalProgram)
        }
    }

    const disabledSubjectFields = (areaSelectedKeys.size === 0
        || selectedEduKeys.size === 0)

    useEffect(() => {
        if (areaSelectedKeys.size !== 0) {
            toast.promise(getEducationalProgramsByArea({
                id: Number(getFirstSetValue(areaSelectedKeys))
            }), {
                loading: 'Cargando programas educativos',
                success: ({ data: { data, error, message } }) => {
                    if (error) return message
                    setEducationalPrograms(data)
                    setSelectedEduKeys(selectedSubject.id ? new Set([selectedSubject.educationalProgramId as Key]) : new Set([]))
                    return message
                },
                error: 'Error al cargar programas educativo'
            }, {
                id: 'get-areas-or-educational-programs'
            })
        }
        return () => {
            setEducationalPrograms([])
        }
    }, [areaSelectedKeys]);

    useEffect(() => {
        if (selectedSubject?.educationalProgramId)
            toast.promise(getAreaByEducationalProgram({
                id: Number(selectedSubject.educationalProgramId)
            }), {
                loading: 'Cargando área',
                success: ({ data: { data, error, message } }) => {
                    if (error) return message
                    setAreaSelectedKeys(new Set([data.id]))
                    return message
                },
                error: 'Error al cargar área'
            }, {
                id: 'get-areas-or-educational-programs'
            })
        return () => {
            setAreaSelectedKeys(new Set([]))
            setEducationalPrograms([])
        }
    }, [selectedSubject?.id]);

    return (
        <Modal
            backdrop="blur"
            placement="center"
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            onClose={handleClose}
        >
            <ModalContent>
                {
                    (onClose) => (
                        <>
                            <ModalHeader>
                                {
                                    selectedSubject?.id ? 'Editar materia' : 'Nueva materia'
                                }
                            </ModalHeader>
                            <ModalBody>
                                <Select
                                    disallowEmptySelection
                                    aria-label="Selector área"
                                    label='Área'
                                    placeholder="Selecciona un área"
                                    name="areaId"
                                    required
                                    selectedKeys={areaSelectedKeys as Selection}
                                    onSelectionChange={handleAreaChange}
                                    items={areas}
                                >
                                    {
                                        (area) =>
                                            <SelectItem key={area.id} value={area.id}>{area.name}</SelectItem>
                                    }
                                </Select>
                                <Select
                                    disallowEmptySelection
                                    placeholder="Selecciona un programa educativo"
                                    aria-label="Programa educativo"
                                    isDisabled={
                                        educationalPrograms.length === 0
                                    }
                                    selectedKeys={selectedEduKeys as Selection}
                                    onSelectionChange={handleEducationalProgramChange}
                                    label='Programa educativo'
                                    items={educationalPrograms}
                                >
                                    {
                                        (educationalProgram) => {
                                            return (
                                                <SelectItem key={educationalProgram.id}>
                                                    {
                                                        educationalProgram.description
                                                    }
                                                </SelectItem>
                                            )
                                        }
                                    }
                                </Select>
                                <Select
                                    label='Cuatrimestre'
                                    placeholder="Cuatrimestre de la materia"
                                    isDisabled={disabledSubjectFields}
                                    items={AddToArrayIfNotExists(periods, {
                                        id: 12,
                                        name: selectedSubject?.monthPeriod
                                    })}
                                    onSelectionChange={handlePeriodChange}
                                >
                                    {
                                        (period) => (
                                            <SelectItem key={period.id}>
                                                {period.name}
                                            </SelectItem>
                                        )
                                    }
                                </Select>
                                <Input
                                    aria-label="Nombre de la materia"
                                    onChange={handleChange}
                                    isDisabled={disabledSubjectFields}
                                    value={selectedSubject?.subjectName}
                                    label='Nombre'
                                    placeholder="Nombre de la materia"
                                    name="subjectName"
                                />
                                <Input
                                    aria-label="Periodo de la materia"
                                    type="number"
                                    isDisabled={disabledSubjectFields}
                                    value={`${selectedSubject?.weeklyHours}`}
                                    name="weeklyHours"
                                    onChange={(e) => {
                                        setStoredSubjects({
                                            selectedSubject: {
                                                ...selectedSubject,
                                                weeklyHours: Number(e.target.value),
                                                totalHours: 15 * Number(e.target.value)
                                            }
                                        })
                                    }}
                                    label='Horas semanales'
                                    placeholder="Horas semanales de la materia"
                                />
                                <Input
                                    onChange={handleChange}
                                    aria-label="Horas totales de la materia"
                                    isDisabled={disabledSubjectFields}
                                    type="number"
                                    value={`${selectedSubject?.totalHours}`}
                                    label='Horas totales'
                                    placeholder="Horas totales de la materia"
                                    name="totalHours"
                                />
                            </ModalBody>
                            <ModalFooter>
                                <Button color="danger" onPress={handleClose} variant="light">
                                    Cancelar
                                </Button>
                                <Button
                                    className="bg-utim"
                                    isDisabled={(disabledSubjectFields ||
                                        selectedSubject?.totalHours === 0 ||
                                        selectedSubject?.weeklyHours === 0 ||
                                        selectedSubject?.subjectName === '') || selectedSubject === null
                                    }
                                    onPress={handleSubmit}
                                >
                                    {
                                        selectedSubject?.id ? 'Actualizar' : 'Registrar'
                                    }
                                </Button>
                            </ModalFooter>
                        </>
                    )
                }
            </ModalContent>
        </Modal>
    )
}
