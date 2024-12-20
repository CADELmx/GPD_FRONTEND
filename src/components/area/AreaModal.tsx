import { Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@nextui-org/react"
import toast from "react-hot-toast"
import { UseSecretary } from "../../context"
import { createArea, deleteArea, updateArea } from "../../models/transactions/area"
import { CreateArea } from "@/models/types/area"
import { ChangeEvent } from "react"

export const AreaModal = ({ isOpen, onOpen, onOpenChange }: {
    isOpen: boolean,
    onOpen: () => void,
    onOpenChange: () => void
}) => {
    const { areaState: { selectedArea, areas }, setStoredAreas } = UseSecretary()
    const handleChange = (e: ChangeEvent<HTMLSelectElement> | ChangeEvent<HTMLInputElement>) => {
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
    const handleUpdate = async (id: number, newArea: CreateArea) => {
        toast.promise(updateArea({ id, data: newArea }), {
            loading: 'Actualizando área...',
            success: ({ data: { message, data, error } }) => {
                if (error) return message
                setStoredAreas({
                    selectedArea: null,
                    areas: areas.map(area => area.id === data.id ? data : area)
                })
                onOpenChange()
                return message
            },
            error: 'Error al realizar esta acción, intente de nuevo'
        })
    }
    const handleCreate = async (area: CreateArea) => {
        toast.promise(createArea({ data: area }), {
            loading: 'Creando área...',
            success: ({ data: { message, data, error } }) => {
                if (error) return message
                setStoredAreas({
                    selectedArea: null,
                    areas: [...areas, data]
                })
                onOpenChange()
                return message
            },
            error: 'Error al realizar esta acción, intente de nuevo'
        })
    }
    const handleSubmit = () => {
        if (selectedArea?.id) {
            handleUpdate(selectedArea.id, selectedArea)
        } else {
            handleCreate(selectedArea)
        }
    }
    return (
        <Modal
            backdrop="blur"
            isOpen={isOpen}
            placement="center"
            isDismissable
            onOpenChange={onOpenChange}
        >
            <ModalContent>
                {
                    (onClose) => (
                        <>
                            <ModalHeader>
                                {selectedArea?.id ? 'Editar área' : 'Nueva área'}
                            </ModalHeader>
                            <ModalBody>
                                <Input
                                    onChange={handleChange}
                                    label='Nombre del área'
                                    defaultValue={selectedArea?.name}
                                ></Input>
                            </ModalBody>
                            <ModalFooter>
                                <Button
                                    variant="light"
                                    color="danger"
                                    onPress={handleClose}
                                >
                                    Cancelar
                                </Button>
                                <Button
                                    className="bg-utim"
                                    onPress={handleSubmit}
                                >
                                    Guardar
                                </Button>
                            </ModalFooter>
                        </>
                    )
                }
            </ModalContent>
        </Modal>
    )
}

export const DeleteAreaModal = ({ isOpen, onOpen, onOpenChange }: {
    isOpen: boolean,
    onOpen: () => void,
    onOpenChange: () => void
}) => {
    const { areaState: { selectedArea, areas }, setStoredAreas } = UseSecretary()
    const handleDelete = () => {
        if (!selectedArea.id) return
        toast.promise(deleteArea({ id: selectedArea.id }), {
            loading: 'Eliminando área...',
            success: ({ data: { message, error } }) => {
                if (error) return message
                setStoredAreas({
                    selectedArea: null,
                    areas: areas.filter(area => area.id !== selectedArea.id)
                })
                onOpenChange()
                return message
            },
            error: 'Error al realizar esta acción, intente de nuevo'
        })
        setStoredAreas({ selectedArea: null })
        onOpenChange()
    }
    const handleClose = () => {
        setStoredAreas({ selectedArea: null })
        onOpenChange()
    }
    return (
        <Modal backdrop="blur" isOpen={isOpen} placement="center" isDismissable onOpenChange={onOpenChange}>
            <ModalContent>
                {
                    (onClose) => (
                        <>
                            <ModalHeader>
                                ¿Estás seguro de eliminar este área?
                            </ModalHeader>
                            <ModalBody className="text-utim">
                                {selectedArea?.name}
                            </ModalBody>
                            <ModalFooter>
                                <Button variant="light" color="danger" onPress={handleClose}>Cancelar</Button>
                                <Button color="danger" onPress={handleDelete}>Eliminar</Button>
                            </ModalFooter>
                        </>
                    )
                }
            </ModalContent>
        </Modal>
    )
}