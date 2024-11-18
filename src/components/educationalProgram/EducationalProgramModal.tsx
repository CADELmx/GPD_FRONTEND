import { Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Select, SelectItem, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@nextui-org/react"
import { ChangeEvent, useState } from "react"
import toast from "react-hot-toast"
import { tableClassNames } from "./EducationalProgramCard"
import { ArrowRight } from "../Icons"
import { createEducationalProgram, deleteEducationalProgram, updateEducationalProgram } from "../../models/transactions/educational-program"
import { UseSecretary } from "../../context"
import { getFirstSetValue } from "../../utils"
import { playNotifySound } from "../../toast"
import { CreateEducationalProgram } from "@/models/types/educational-program"

interface ModalProps {
    isOpen: boolean,
    onOpen: () => void,
    onOpenChange: () => void
}

export const EducationalProgramModal = ({ isOpen, onOpen, onOpenChange }: ModalProps) => {
    const { educationalState: { selectedEducationalProgram, educationalPrograms }, areaState: { areas }, setStoredEducationalPrograms } = UseSecretary()
    const handleChange = (e: ChangeEvent<HTMLSelectElement> | ChangeEvent<HTMLInputElement>) => {
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
    const handleUpdate = async (id: number, newEducationalProgram: CreateEducationalProgram) => {
        toast.promise(updateEducationalProgram({ id, data: newEducationalProgram }), {
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
    const handleCreate = async (educationalProgram: CreateEducationalProgram) => {
        toast.promise(createEducationalProgram({ data: educationalProgram }), {
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
        const newEducationalProgram = {
            ...selectedEducationalProgram,
            areaId: Number(selectedEducationalProgram.areaId)
        }
        if (selectedEducationalProgram?.id) {
            handleUpdate(selectedEducationalProgram.id, newEducationalProgram)
        } else {
            handleCreate(newEducationalProgram)
        }
    }
    return (
        <Modal backdrop="blur" isOpen={isOpen} placement="center" isDismissable onClose={handleClose} onOpenChange={onOpenChange}>
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
                                    required
                                    defaultSelectedKeys={selectedEducationalProgram?.areaId ? [selectedEducationalProgram.areaId] : []}
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
                                <Button className="bg-utim" onPress={handleSubmit}>Guardar</Button>
                            </ModalFooter>
                        </>
                    )
                }
            </ModalContent>
        </Modal>
    )
}

export const EducationalProgramDeleteModal = ({ isOpen, onOpen, onOpenChange }: ModalProps) => {
    const { educationalState: { selectedEducationalProgram, educationalPrograms }, setStoredEducationalPrograms } = UseSecretary()
    const handleDelete = async () => {
        toast.promise(deleteEducationalProgram({ id: selectedEducationalProgram.id }), {
            loading: 'Eliminando programa educativo...',
            success: ({ data: { message, error } }) => {
                if (error) return message
                setStoredEducationalPrograms({
                    selectedEducationalProgram: null,
                    educationalPrograms: educationalPrograms.filter(educationalProgram => educationalProgram.id !== selectedEducationalProgram.id)
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
                            <ModalBody className="text-utim">
                                {selectedEducationalProgram.description}
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

export const ChangeAreaModal = ({ isOpen, onOpen, onOpenChange, selectedEducationalPrograms }: ModalProps & { selectedEducationalPrograms: Set<any> }) => {
    const { areaState: { areas }, educationalState: { educationalPrograms }, setStoredEducationalPrograms } = UseSecretary()
    const [selectedAreas, setSelectedAreas] = useState<any>(new Set([]));
    const handleUpdateMany = () => {
        const programsToUpdate = educationalPrograms.filter((program) => selectedEducationalPrograms.has(program.id))
        const newAreaId = Number(getFirstSetValue(selectedAreas))
        const programPromises = programsToUpdate.map((program) => {
            return updateEducationalProgram({ id: program.id, data: { ...program, areaId: newAreaId } })
        })
        toast.promise(Promise.all(programPromises), {
            loading: 'Actualizando programas educativos...',
            success: (results) => {
                onOpenChange()
                const promisesData = results.map(({ data }) => (data))
                if (promisesData.some(({ error }) => error)) {
                    return 'Error al actualizar programas educativos'
                }
                playNotifySound()
                console.log(educationalPrograms.map((program) => {
                    const updatedProgram = promisesData.find(({ data }) => data.id === program.id)
                    return updatedProgram ? updatedProgram.data : program
                }))
                setStoredEducationalPrograms({
                    educationalPrograms: educationalPrograms.map((program) => {
                        const updatedProgram = promisesData.find(({ data }) => data.id === program.id)
                        return updatedProgram ? updatedProgram.data : program
                    })
                })
                const success = promisesData.filter(({ error }) => !error)
                const successLen = success.length
                return `${successLen} programas educativos actualizados`
            },
            error: 'Error al actualizar programas educativos'
        })

    }
    return (
        <Modal backdrop="blur" isOpen={isOpen} placement="center" isDismissable onOpenChange={onOpenChange}>
            <ModalContent>
                {
                    (onClose) => (
                        <>
                            <ModalHeader>Cambiar programas educativos de área</ModalHeader>
                            <ModalBody>
                                <Select
                                    startContent={ArrowRight}
                                    label='Área destino'
                                    isRequired
                                    items={areas}
                                    selectedKeys={selectedAreas}
                                    defaultSelectedKeys={selectedAreas}
                                    onSelectionChange={setSelectedAreas}
                                    disallowEmptySelection
                                >
                                    {
                                        (area) =>
                                            <SelectItem key={area.id} value={area.id}>{area.name}</SelectItem>
                                    }
                                </Select>
                                <Table isHeaderSticky classNames={{
                                    ...tableClassNames,
                                    th: 'text-center text-1xl',
                                    base: 'max-h-60 overflow-y-auto'
                                }}>
                                    <TableHeader>
                                        <TableColumn>
                                            Programas educativos seleccionados
                                        </TableColumn>
                                    </TableHeader>
                                    <TableBody items={Array.from(selectedEducationalPrograms, (v: string, i: number) => ({
                                        index: i,
                                        value: v
                                    }))}>
                                        {
                                            (educationalProgram) => {
                                                return (
                                                    <TableRow key={educationalProgram.index}>
                                                        <TableCell>{educationalPrograms.find(p => p.id === Number(educationalProgram.value))?.description}</TableCell>
                                                    </TableRow>
                                                )
                                            }
                                        }
                                    </TableBody>
                                </Table>
                            </ModalBody>
                            <ModalFooter className="flex flex-col">
                                <div className="flex flex-row justify-end">
                                    <Button
                                        variant="light"
                                        color="danger"
                                        onPress={onClose}
                                    >Cancelar
                                    </Button>
                                    <Button
                                        isDisabled={selectedAreas.size === 0}
                                        className="bg-utim"
                                        onPress={handleUpdateMany}
                                    >Guardar
                                    </Button>
                                </div>
                            </ModalFooter>
                        </>
                    )
                }
            </ModalContent>
        </Modal>
    )
}

export const DeleteManyModal = ({ isOpen, onOpen, onOpenChange, selectedEducationalPrograms }: ModalProps & {
    selectedEducationalPrograms: Set<any>
}) => {
    const { educationalState: { educationalPrograms }, setStoredEducationalPrograms } = UseSecretary()
    const handleDeleteMany = () => {
        const programsToDelete = educationalPrograms.filter((program) => selectedEducationalPrograms.has(program.id))
        const programPromises = programsToDelete.map((program) => {
            return deleteEducationalProgram({ id: program.id })
        })
        toast.promise(Promise.all(programPromises), {
            loading: 'Eliminando programas educativos...',
            success: (results) => {
                onOpenChange()
                const promisesData = results.map(({ data }) => (data))
                if (promisesData.some(({ error }) => error)) {
                    return 'Error al eliminar programas educativos'
                }
                playNotifySound()
                setStoredEducationalPrograms({
                    educationalPrograms: educationalPrograms.filter((program) => !selectedEducationalPrograms.has(program.id))
                })
                const success = promisesData.filter(({ error }) => !error)
                const successLen = success.length
                return `${successLen} programas educativos eliminados`
            },
            error: 'Error al eliminar programas educativos'
        })
    }
    return (
        <Modal backdrop="blur" isOpen={isOpen} placement="center" isDismissable onOpenChange={onOpenChange}>
            <ModalContent>
                {
                    (onClose) => (
                        <>
                            <ModalHeader>Eliminar programas educativos</ModalHeader>
                            <ModalBody>
                                <Table isHeaderSticky classNames={{
                                    ...tableClassNames,
                                    th: 'text-center text-1xl',
                                    base: 'max-h-60 overflow-y-auto'
                                }}>
                                    <TableHeader>
                                        <TableColumn>
                                            Programas educativos seleccionados
                                        </TableColumn>
                                    </TableHeader>
                                    <TableBody items={Array.from(selectedEducationalPrograms, (v, i) => ({
                                        index: i,
                                        value: v
                                    }))}>
                                        {
                                            (educationalProgram) => {
                                                return (
                                                    <TableRow key={educationalProgram.index}>
                                                        <TableCell>{educationalPrograms.find(p => p.id === educationalProgram.value)?.description}</TableCell>
                                                    </TableRow>
                                                )
                                            }
                                        }
                                    </TableBody>
                                </Table>
                            </ModalBody>
                            <ModalFooter className="flex flex-col">
                                <div className="flex flex-row justify-end">
                                    <Button
                                        variant="light"
                                        color="danger"
                                        onPress={onClose}
                                    >
                                        Cancelar
                                    </Button>
                                    <Button
                                        color="danger"
                                        onPress={handleDeleteMany}
                                    >Eliminar
                                    </Button>
                                </div>
                            </ModalFooter>
                        </>
                    )
                }
            </ModalContent>
        </Modal>
    )
}