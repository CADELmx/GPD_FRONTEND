import { Modal, ModalBody, ModalContent, ModalHeader, Select, SelectItem } from "@nextui-org/react"
import { ModalProps } from "../educationalProgram/EducationalProgramModal"
import { UseSecretary } from "@/context"
import { ChangeEvent, useEffect, useState } from "react"
import { CreateSubject } from "@/models/types/subject"
import toast from "react-hot-toast"
import { createSubject, updateSubject } from "@/models/transactions/subject"
import { EducationalProgram } from "@/models/types/educational-program"
import { getEducationalPrograms, getEducationalProgramsByArea } from "@/models/transactions/educational-program"
import { getFirstSetValue } from "@/utils"

export const SubjectModal = ({ isOpen, onOpen, onOpenChange }: ModalProps) => {
    const { subjectState: { selectedSubject, subjects }, setStoredSubjects, areaState: { areas } } = UseSecretary()
    const [areaSelectedKeys, setAreaSelectedKeys] = useState<any>(new Set<any>([]));
    const [educationalPrograms, setEducationalPrograms] = useState<EducationalProgram[]>([]);
    const handleChange = (e: ChangeEvent<HTMLSelectElement> | ChangeEvent<HTMLInputElement>) => {
        setStoredSubjects({
            selectedSubject: {
                ...selectedSubject,
                [e.target.name]: e.target.value
            }
        })
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
            areaId: Number(selectedSubject.areaId)
        }
        if (selectedSubject?.id) {
            handleUpdate(selectedSubject.id, newEducationalProgram)
        } else {
            handleCreate(newEducationalProgram)
        }
    }
    useEffect(() => {
        if (areaSelectedKeys.size !== 0) {
            toast.promise(getEducationalProgramsByArea(getFirstSetValue(areaSelectedKeys)), {
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

    return (
        <Modal backdrop="blur" placement="center" isOpen={isOpen} onOpenChange={onOpenChange}>
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
                            </ModalBody>
                        </>
                    )
                }
            </ModalContent>
        </Modal>
    )
}

export const SubjectDeleteModal = ({ isOpen, onOpen, onOpenChange }: ModalProps) => {
    return (
        <Modal backdrop="blur" isOpen={isOpen} onOpenChange={onOpenChange}>
            <ModalBody></ModalBody>
        </Modal>
    )
}