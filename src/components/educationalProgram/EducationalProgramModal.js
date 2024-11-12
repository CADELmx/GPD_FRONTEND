import { Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@nextui-org/react"

export const EducationalPorgramModal = ({ isOpen, onOpen, onOpenChange }) => {
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
                                <Button onPress={handleSubmit}>Guardar</Button>
                                <Button color="danger" onPress={handleClose}>Cancelar</Button>
                            </ModalFooter>
                        </>
                    )
                }
            </ModalContent>
        </Modal>
    )
}
