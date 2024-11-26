import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Selection, Switch, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, useDisclosure } from "@nextui-org/react"
import { ArrowsRightLeftIcon, PencilIcon, TrashIcon, VericalDotsIcon } from "../Icons"
import { ChangeAreaModal, DeleteManyModal } from "./EducationalProgramModal"
import { useState } from "react"
import { UseSecretary } from "../../context"
import { CreateEducationalProgram, EducationalProgram } from "@/models/types/educational-program"
import { SwitchMode } from "../SwitchMode"

export const tableClassNames = {
    wrapper: 'm-0 p-1',
    td: 'text-xs p-2',
    th: 'text-xs p-2',
}

export const EducationalProgramsTable = ({ onOpenModal, onOpenDeleteModal }: {
    onOpenModal: () => void,
    onOpenDeleteModal: () => void
}) => {
    const { setStoredEducationalPrograms, areaState: { areas }, educationalState: { educationalPrograms } } = UseSecretary()
    const [editMode, setEditMode] = useState(false);
    const [selectedEducationalPrograms, setSelectedEducationalPrograms] = useState<EducationalProgram[]>([]);
    const ChangeFromAreaModal = useDisclosure()
    const DeleteEducativeProgramsModal = useDisclosure()
    const handlePress = (educationalProgram: CreateEducationalProgram) => {
        setStoredEducationalPrograms({ selectedEducationalProgram: educationalProgram })
        onOpenModal()
    }
    const onSelectionChange = (e: Selection) => {
        if (e === 'all') return setSelectedEducationalPrograms(educationalPrograms)
        setSelectedEducationalPrograms(educationalPrograms.filter(ep => e.has(ep.id)))
    }
    const handleDeleteModal = (educationalProgram: CreateEducationalProgram) => {
        setStoredEducationalPrograms({ selectedEducationalProgram: educationalProgram })
        onOpenDeleteModal()
    }
    const handleChangeArea = () => {
        ChangeFromAreaModal.onOpenChange()
    }
    const handleDeleteMany = () => {
        DeleteEducativeProgramsModal.onOpenChange()
    }
    return (
        <div className="flex flex-col gap-2">
            <div className="md:flex gap-2 items-center">
                <ChangeAreaModal
                    selectedEducationalPrograms={selectedEducationalPrograms}
                    isOpen={ChangeFromAreaModal.isOpen}
                    onOpen={ChangeFromAreaModal.onOpen}
                    onOpenChange={ChangeFromAreaModal.onOpenChange}
                />
                <DeleteManyModal
                    selectedEducationalPrograms={selectedEducationalPrograms}
                    isOpen={DeleteEducativeProgramsModal.isOpen}
                    onOpen={DeleteEducativeProgramsModal.onOpen}
                    onOpenChange={DeleteEducativeProgramsModal.onOpenChange}
                />
                <SwitchMode
                    isDisabled={educationalPrograms.length === 0}
                    isSelected={editMode}
                    onValueChange={(e) => {
                        if (e) setSelectedEducationalPrograms([])
                        setEditMode(e)
                    }}
                >
                    Selección múltiple
                </SwitchMode>
                {
                    editMode && (
                        <div className="flex items-center pt-2 md:pt-0 gap-2">
                            <Button
                                aria-label="Cambiar de área"
                                isDisabled={selectedEducationalPrograms.length === 0}
                                startContent={ArrowsRightLeftIcon}
                                color="primary"
                                onPress={handleChangeArea}
                            >
                                Cambiar de area
                            </Button>
                            <Button
                                aria-label="Eliminar varios"
                                isDisabled={selectedEducationalPrograms.length === 0}
                                startContent={TrashIcon}
                                color="danger"
                                onPress={handleDeleteMany}
                            >
                                Eliminar
                            </Button>
                        </div>
                    )
                }
            </div>
            <Table
                aria-label="Tabla de programas educativos"
                selectionMode={editMode ? "multiple" : 'none'}
                onSelectionChange={onSelectionChange}
                selectedKeys={selectedEducationalPrograms.map(e => e.id)}
                isCompact
                classNames={tableClassNames}>
                <TableHeader>
                    <TableColumn>
                        Abreviatura
                    </TableColumn>
                    <TableColumn>
                        Descripción
                    </TableColumn>
                    <TableColumn>
                        Area
                    </TableColumn>
                    <TableColumn>
                        {
                            editMode || 'Acciones'
                        }
                    </TableColumn>
                </TableHeader>
                <TableBody emptyContent={'Sin programas educativos'} items={educationalPrograms}>
                    {(educationalProgram) => (
                        <TableRow key={educationalProgram.id}>
                            <TableCell className="text-utim">
                                {educationalProgram.abbreviation}
                            </TableCell>
                            <TableCell>
                                {educationalProgram.description}
                            </TableCell>
                            <TableCell>
                                {areas.find(area => area.id === educationalProgram.areaId)?.name}
                            </TableCell>
                            <TableCell>
                                {
                                    editMode || (
                                        <Dropdown>
                                            <DropdownTrigger>
                                                <Button isIconOnly variant="light">
                                                    {VericalDotsIcon}
                                                </Button>
                                            </DropdownTrigger>
                                            <DropdownMenu aria-label="Menú de opciones">
                                                <DropdownItem
                                                    startContent={PencilIcon}
                                                    onPress={() => handlePress(educationalProgram)}
                                                >
                                                    Editar
                                                </DropdownItem>
                                                <DropdownItem
                                                    startContent={TrashIcon}
                                                    onPress={() => handleDeleteModal(educationalProgram)} color="danger"
                                                >
                                                    Eliminar
                                                </DropdownItem>
                                            </DropdownMenu>
                                        </Dropdown>
                                    )
                                }
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    )
}