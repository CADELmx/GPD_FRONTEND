import { Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Select, Selection, SelectItem, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@nextui-org/react"
import { ModalProps } from "../educationalProgram/EducationalProgramModal"
import { UseSecretary } from "@/context"
import React, { ChangeEvent, Key, useEffect, useState } from "react"
import { CreateSubject, Subject } from "@/models/types/subject"
import toast from "react-hot-toast"
import { createSubject, updateSubject } from "@/models/transactions/subject"
import { EducationalProgram } from "@/models/types/educational-program"
import { getEducationalProgramsByArea } from "@/models/transactions/educational-program"
import { getFirstSetValue, InitiSelectedKeys } from "@/utils"
import { getAreaByEducationalProgram } from "@/models/transactions/area"
import { playNotifySound } from "@/toast"
import { tableClassNames } from "../educationalProgram/EducationalProgramCard"

export interface GenericTypeFn {
    <T>(e: T): T
}

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
        id: 6,
        name: '6'
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
    if (array.find(e => e.name === value)) return array
    return [...array, {
        id: array.length + 1,
        name: value
    }]
}

export const SubjectModal = ({ isOpen, onOpen, onOpenChange }: ModalProps) => {
    const { subjectState: { selectedSubject, subjects }, setStoredSubjects, areaState: { areas } } = UseSecretary()
    const [areaSelectedKeys, setAreaSelectedKeys] = useState(InitiSelectedKeys)
    const [selectedEduKeys, setSelectedEduKeys] = useState(InitiSelectedKeys)
    const [periodSelectedKeys, setPeriodSelectedKeys] = useState(InitiSelectedKeys);
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
                monthPeriod: getFirstSetValue(e)
            }
        })
        setPeriodSelectedKeys(e)
        console.log(periodSelectedKeys)
        console.log(selectedSubject)
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
                educationalProgramId: Number(getFirstSetValue(e))
            }
        })
    }
    const handleClose = () => {
        setStoredSubjects({
            selectedSubject: null
        })
        setAreaSelectedKeys(new Set<Key>([]))
        setSelectedEduKeys(new Set<Key>([]))
        setPeriodSelectedKeys(new Set<Key>([]))
        setEducationalPrograms([])
        onOpenChange()
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
                handleClose()
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
                handleClose()
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
                error: 'Error al cargar programas educativos'
            }, {
                id: 'get-areas-or-educational-programs'
            })
        }
        return () => {
            setEducationalPrograms([])
        }
    }, [areaSelectedKeys]);

    useEffect(() => {
        if (selectedSubject?.educationalProgramId) {
            setPeriodSelectedKeys(new Set<Key>([selectedSubject.monthPeriod]))
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
                                    aria-label="Cuatrimestre de la materia"
                                    label='Cuatrimestre'
                                    placeholder="Cuatrimestre de la materia"
                                    isDisabled={disabledSubjectFields}
                                    items={AddToArrayIfNotExists(periods, selectedSubject?.monthPeriod)}
                                    selectedKeys={periodSelectedKeys as Selection}
                                    onSelectionChange={handlePeriodChange}
                                >
                                    {
                                        (period: PeriodType) => (
                                            <SelectItem key={period.name}>
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
                                    aria-label="Horas semanales de la materia"
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

export const ChangeProgramModal = ({ isOpen, onOpen, onOpenChange, selectedSubjects }: ModalProps & { selectedSubjects: Subject[] }) => {
    const { areaState: { areas }, subjectState: { subjects }, setStoredSubjects } = UseSecretary()
    const [selectedEduKeys, setSelectedEduKeys] = useState(InitiSelectedKeys);
    const [educationalPrograms, setEducationalPrograms] = useState<EducationalProgram[]>([]);
    const handleSelectEducationalProgram = (e: Selection) => {
        if (e === "all") return
        setSelectedEduKeys(e)
    }
    const handleClose = () => {
        setSelectedEduKeys(new Set<Key>([]))
        setEducationalPrograms([])
        onOpenChange()
    }
    const handleUpdateMany = () => {
        const newProgramId = Number(getFirstSetValue(selectedEduKeys))
        const subjectPromises = selectedSubjects.map(subject => {
            return updateSubject({
                id: subject.id,
                data: {
                    ...subject,
                    educationalProgramId: newProgramId
                }
            })
        })
        toast.promise(Promise.all(subjectPromises), {
            loading: 'Actualizando materias',
            success: (results) => {
                onOpenChange()
                const promisesData = results.map(({ data }) => data)
                if (promisesData.some(({ error }) => error)) return 'Error al actualizar materias'
                playNotifySound()
                setStoredSubjects({
                    subjects: subjects.map(subject => {
                        const newSubject = promisesData.find(({ data }) => data.id === subject.id)
                        return newSubject ? newSubject.data : subject
                    })
                })
                return 'Materias actualizadas'
            },
            error: 'Error al actualizar materias, intente de nuevo'
        })
    }
    useEffect(() => {
        if (selectedEduKeys.size !== 0) {
            toast.promise(getEducationalProgramsByArea({
                id: Number(getFirstSetValue(selectedEduKeys))
            }), {
                loading: 'Cargando programas educativos',
                success: ({ data: { data, error, message } }) => {
                    if (error) return message
                    setEducationalPrograms(data)
                    return message
                },
                error: 'Error al cargar programas educativos'
            }, {
                id: 'get-areas-or-educational-programs'
            })
        }
        return () => {
            setEducationalPrograms([])
        }
    }, [selectedEduKeys]);
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
                                Cambiar de programa educativo
                            </ModalHeader>
                            <ModalBody>
                                <Select
                                    disallowEmptySelection
                                    label='Área'
                                    placeholder="Selecciona un área"
                                    aria-label="Selector área"
                                    items={areas}
                                    selectedKeys={selectedEduKeys as Selection}
                                    onSelectionChange={handleSelectEducationalProgram}
                                >
                                    {
                                        (area) => {
                                            return (
                                                <SelectItem key={area.id}>
                                                    {
                                                        area.name
                                                    }
                                                </SelectItem>
                                            )
                                        }
                                    }
                                </Select>
                                <Select
                                    label='Programa educativo'
                                    disallowEmptySelection
                                    placeholder="Selecciona un programa educativo"
                                    aria-label="Programa educativo"
                                    items={educationalPrograms}
                                    isDisabled={educationalPrograms.length === 0 || selectedEduKeys.size === 0}
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
                                <Table
                                    aria-label="Tabla de materias"
                                    selectionMode="none"
                                    classNames={{
                                        ...tableClassNames,
                                        th: 'text-center text-1xl',
                                        base: 'max-h-60 overflow-y-auto'
                                    }}
                                >
                                    <TableHeader>
                                        <TableColumn>
                                            Materias seleccionadas
                                        </TableColumn>
                                    </TableHeader>
                                    <TableBody
                                        items={selectedSubjects}
                                    >
                                        {
                                            selectedSubjects.map(subject => (
                                                <TableRow key={subject.id}>
                                                    <TableCell>
                                                        {subject.subjectName}
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        }
                                    </TableBody>
                                </Table>

                            </ModalBody>
                            <ModalFooter>
                                <Button
                                    color="danger"
                                    onPress={handleClose} variant="light"
                                >
                                    Cancelar
                                </Button>
                                <Button
                                    className="bg-utim"
                                    onPress={handleUpdateMany}
                                    isDisabled={selectedEduKeys.size === 0}
                                >
                                    Cambiar
                                </Button>
                            </ModalFooter>
                        </>
                    )
                }
            </ModalContent>
        </Modal>
    )
}
