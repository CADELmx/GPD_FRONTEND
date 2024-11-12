import { UseSecretary } from "@/context"
import { updateEducationalProgram } from "@/models/transactions"
import { Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Select, SelectItem } from "@nextui-org/react"

export const EducationalProgramModal = ({ areas, isOpen, onOpen, onOpenChange }) => {
    const { educationalState: { selectedEducationalProgram, educationalPrograms }, setStoredEducationalPrograms } = UseSecretary()
    const handleChange = (e) => {
        setStoredEducationalPrograms({
            selectedEducationalProgram: {
                ...selectedEducationalProgram,
                [e.target.name]: e.target.value
            }
        })
    }
    const handleClose = () => {
        setStoredEducationalPrograms({ selectedEducationalProgram: null })
        onOpenChange()
    }
    const handleUpdate = async (id, newEducationalProgram) => {
        toast.promise(updateEducationalProgram(id, newEducationalProgram), {
            loading: 'Actualizando programa educativo...',
            success: ({ data: { message, data, error } }) => {
                if (error) return message
                setStoredEducationalPrograms({
                    selectedEducationalProgram: null,
                    educationalPrograms: educationalPrograms.map(educationalProgram => educationalProgram.id === data.id ? data : educationalProgram)
                })
                onOpenChange()
                return message
            },
            error: 'Error al realizar esta acción, intente de nuevo'
        })
    }
    const handleCreate = async (educationalProgram) => {
        toast.promise(createEducationalProgram(educationalProgram), {
            loading: 'Creando programa educativo...',
            success: ({ data: { message, data, error } }) => {
                if (error) return message
                setStoredEducationalPrograms({
                    selectedEducationalProgram: null,
                    educationalPrograms: [...educationalPrograms, data]
                })
                onOpenChange()
                return message
            },
            error: 'Error al realizar esta acción, intente de nuevo'
        })
    }
    const handleSubmit = () => {
        console.log('submit', selectedEducationalProgram)
        if (selectedEducationalProgram?.id) {
            handleUpdate(selectedEducationalProgram.id, selectedEducationalProgram)
        } else {
            handleCreate(selectedEducationalProgram)
        }
    }
    return (
        <Modal backdrop="blur" isOpen={isOpen} placement="center" isDismissable onOpenChange={onOpenChange}>
            <ModalContent>
                {
                    (onClose) => (
                        <>
                            <ModalHeader>
                                {
                                    selectedEducationalProgram?.id ? 'Editar programa educativo' : 'Nuevo programa educativo'
                                }
                            </ModalHeader>
                            <ModalBody>
                                <Select
                                    onChange={handleChange}
                                    label='Área'
                                    name="areaId"
                                    defaultSelectedKeys={[selectedEducationalProgram?.areaId]}
                                    items={areas}
                                >
                                    {
                                        (area) =>
                                            <SelectItem key={area.id} value={area.id}>{area.name}</SelectItem>
                                    }
                                </Select>
                                <Input
                                    onChange={handleChange}
                                    name="abbreviation"
                                    label='Abreviatura del programa educativo'
                                    defaultValue={selectedEducationalProgram?.abbreviation}
                                ></Input>
                                <Input
                                    onChange={handleChange}
                                    name="description"
                                    label='Descripción del programa educativo'
                                    defaultValue={selectedEducationalProgram?.description}
                                ></Input>
                            </ModalBody>
                            <ModalFooter>
                                <Button variant="light" color="danger" onPress={handleClose}>Cancelar</Button>
                                <Button color="success" onPress={handleSubmit}>Guardar</Button>
                            </ModalFooter>
                        </>
                    )
                }
            </ModalContent>
        </Modal>
    )
}

export const EducationalProgramDeleteModal = ({ isOpen, onOpen, onOpenChange }) => {
    const { educationalState: { selectedEducationalProgram, educationalPrograms }, setStoredEducationalPrograms } = UseSecretary()
    const handleDelete = async () => {
        toast.promise(deleteEducationalProgram(selectedEducationalProgram.id), {
            loading: 'Eliminando programa educativo...',
            success: ({ data: { message, error } }) => {
                if (error) return message
                setStoredEducationalPrograms({
                    selectedEducationalProgram: null,
                    educationalPrograms: educationalPrograms.filter(educationalProgram => educationalProgram.id !== id)
                })
                onOpenChange()
                return message
            },
            error: 'Error al realizar esta acción, intente de nuevo'
        })
    }
    const handleClose = () => {
        setStoredEducationalPrograms({ selectedEducationalProgram: null })
        onOpenChange()
    }
    return (
        <Modal backdrop="blur" isOpen={isOpen} placement="center" isDismissable onOpenChange={onOpenChange}>
            <ModalContent>
                {
                    (onClose) => (
                        <>
                            <ModalHeader>¿Estás seguro de eliminar el programa educativo?</ModalHeader>
                            <ModalBody>
                                Programa seleccionado
                                <p>{selectedEducationalProgram.description}</p>
                            </ModalBody>
                            <ModalFooter>
                                <Button onPress={handleDelete}>Eliminar</Button>
                                <Button color="danger" onPress={handleClose}>Cancelar</Button>
                            </ModalFooter>
                        </>
                    )
                }
            </ModalContent>
        </Modal>
    )
}