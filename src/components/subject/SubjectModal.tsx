import { Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Select, SelectItem } from "@nextui-org/react"
import { ModalProps } from "../educationalProgram/EducationalProgramModal"
import { UseSecretary } from "@/context"
import { ChangeEvent, useEffect, useState } from "react"
import { CreateSubject } from "@/models/types/subject"
import toast from "react-hot-toast"
import { createSubject, updateSubject } from "@/models/transactions/subject"
import { EducationalProgram } from "@/models/types/educational-program"
import { getEducationalProgramsByArea } from "@/models/transactions/educational-program"
import { getFirstSetValue } from "@/utils"

export type PeriodType = {
    id: number,
    name: string
}

const periods: PeriodType[] = [
    {
        id: 1,
        name: '1o'
    },
    {
        id: 2,
        name: '2o'
    },
    {
        id: 3,
        name: '3o'
    },
    {
        id: 4,
        name: '4o'
    },
    {
        id: 5,
        name: '5o'
    },
    {
        id: 7,
        name: '7o'
    },
    {
        id: 8,
        name: '8o'
    },
    {
        id: 9,
        name: '9o'
    },
    {
        id: 10,
        name: '10o'
    },
    {
        id: 11,
        name: 'Estadía'
    }
]

export const SubjectModal = ({ isOpen, onOpen, onOpenChange }: ModalProps) => {
    const { subjectState: { selectedSubject, subjects }, setStoredSubjects, areaState: { areas } } = UseSecretary()
    const [areaSelectedKeys, setAreaSelectedKeys] = useState<any>(new Set<any>([]))
    const [selectedEduKeys, setSelectedEduKeys] = useState<any>(new Set<any>([]))
    const [educationalPrograms, setEducationalPrograms] = useState<EducationalProgram[]>([]);
    const handleChange = (e: ChangeEvent<HTMLSelectElement> | ChangeEvent<HTMLInputElement>) => {
        setStoredSubjects({
            selectedSubject: {
                ...selectedSubject,
                [e.target.name]:
                    (e.target.name === "weeklyHours" || e.target.name === "totalHours") ? Number(e.target.value) : e.target.value
            }
        })
        console.log(selectedSubject)
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
            educationalProgramId: selectedSubject.educationalProgramId
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
        console.log(areaSelectedKeys, selectedEduKeys)
        if (areaSelectedKeys.size !== 0) {
            toast.promise(getEducationalProgramsByArea({
                id: Number(getFirstSetValue(areaSelectedKeys))
            }), {
                loading: 'Cargando programas educativos',
                success: ({ data: { data, error, message } }) => {
                    if (error) return message
                    setEducationalPrograms(data)
                    return message
                },
                error: 'Error al cargar programas educativo'
            })
        }
        return () => {

        }
    }, [areaSelectedKeys]);


    useEffect(() => {
        console.log(selectedEduKeys, areaSelectedKeys)
        return () => {
        }
    }, [selectedEduKeys])


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
                                    name="areaId"
                                    required
                                    defaultSelectedKeys={areaSelectedKeys}
                                    onSelectionChange={setAreaSelectedKeys}
                                    items={areas}
                                >
                                    {
                                        (area) =>
                                            <SelectItem key={area.id} value={area.id}>{area.name}</SelectItem>
                                    }
                                </Select>
                                <Select
                                    disallowEmptySelection
                                    aria-label="Programa educativo"
                                    isDisabled={
                                        educationalPrograms.length === 0
                                    }
                                    selectedKeys={selectedEduKeys}
                                    onSelectionChange={(e) => {
                                        console.log('Programa educativo', e)
                                        setSelectedEduKeys(e)
                                        setStoredSubjects({
                                            selectedSubject: {
                                                ...selectedSubject,
                                                educationalProgramId: Number(getFirstSetValue(new Set(e)))
                                            }
                                        })
                                    }}
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
                                    items={periods}
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
                                    defaultValue={selectedSubject?.subjectName}
                                    label='Nombre'
                                    placeholder="Nombre de la materia"
                                    name="subjectName"
                                />
                                <Input
                                    aria-label="Periodo de la materia"
                                    type="number"
                                    isDisabled={disabledSubjectFields}
                                    defaultValue={`${selectedSubject?.weeklyHours}`}
                                    name="weeklyHours"
                                    onChange={(e) => {
                                        setStoredSubjects({
                                            selectedSubject: {
                                                ...selectedSubject,
                                                weeklyHours: Number(e.target.value),
                                                totalHours: 15 * Number(e.target.value)
                                            }
                                        })
                                        console.log(selectedSubject)
                                    }}
                                    label='Horas semanales'
                                    placeholder="Horas semanales de la materia"
                                />
                                <Input
                                    onChange={handleChange}
                                    aria-label="Horas totales de la materia"
                                    isDisabled
                                    type="number"
                                    value={`${15 * (selectedSubject?.weeklyHours || 0)}`}
                                    label='Horas totales'
                                    placeholder="Horas totales de la materia"
                                    name="totalHours"
                                />
                            </ModalBody>
                            <ModalFooter>
                                <Button color="danger" variant="light">
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
