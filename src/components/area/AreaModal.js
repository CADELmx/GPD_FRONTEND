import { UseAreas } from "@/context"
import { createArea, deleteArea, updateArea } from "@/models/transactions"
import { Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@nextui-org/react"

export const AreaModal = ({ isOpen, onOpen, onOpenChange }) => {
    const { areaState: { selectedArea }, setStoredAreas } = UseAreas()
    const handleChange = (e) => {
        setStoredAreas({
            selectedArea: {
                ...selectedArea,
                name: e.target.value
            }
        })
    }
    const handleClose = () => {
        setStoredAreas({ selectedArea: null })
        onOpenChange()
    }
    const handleUpdate = async (id, newArea) => {
        const { data } = await updateArea(id, newArea)
        console.log(data)
    }
    const handleCreate = async (area) => {
        const { data } = await createArea(area)
        console.log(data)
    }
    const handleSubmit = () => {
        console.log('submit', selectedArea)
        if (selectedArea?.id) {
            handleUpdate(selectedArea)
        } else {
            handleCreate(selectedArea)
        }
    }
    return (
        <Modal backdrop="blur" isOpen={isOpen} placement="center" isDismissable onOpenChange={onOpenChange}>
            <ModalContent>
                {
                    (onClose) => (
                        <>
                            <ModalHeader></ModalHeader>
                            <ModalBody>
                                <Input
                                    onChange={handleChange}
                                    label='Nombre del área'
                                    defaultValue={selectedArea?.name}
                                ></Input>
                            </ModalBody>
                            <ModalFooter>
                                <Button color="danger" onPress={handleClose}>Cancelar</Button>
                                <Button color="success" onPress={handleSubmit}>Guardar</Button>
                            </ModalFooter>
                        </>
                    )
                }
            </ModalContent>
        </Modal>
    )
}

export const DeleteAreaModal = ({ isOpen, onOpen, onOpenChange }) => {
    const { areaState: { selectedArea }, setStoredAreas } = UseAreas()
    const handleDelete = () => {
        onOpenChange()
        deleteArea(selectedArea.id)
    }
    const handleClose = () => {

        onOpenChange()
    }
    return (
        <Modal backdrop="blur" isOpen={isOpen} placement="center" isDismissable onOpenChange={onOpenChange}>
            <ModalContent>
                {
                    (onClose) => (
                        <>
                            <ModalHeader></ModalHeader>
                            <ModalBody>
                                ¿Estás seguro de eliminar el área?
                            </ModalBody>
                            <ModalFooter>
                                <Button color="danger" onPress={handleClose}>Cancelar</Button>
                                <Button color="success" onPress={handleDelete}>Eliminar</Button>
                            </ModalFooter>
                        </>
                    )
                }
            </ModalContent>
        </Modal>
    )
}