import { UseSecretary } from "@/context"
import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Switch, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, useDisclosure } from "@nextui-org/react"
import { ArrowsRightLeftIcon, PencilIcon, TrashIcon, VericalDotsIcon } from "../Icons"
import { ChangeAreaModal, DeleteManyModal } from "./EducationalProgramModal"
import { useState } from "react"

export const tableClassNames = {
    wrapper: 'm-0 p-1',
    td: 'text-xs p-2',
    th: 'text-xs p-2',
}

export const EducationalProgramsTable = ({ educationalPrograms, onOpenModal, onOpenDeleteModal }) => {
    const { setStoredEducationalPrograms, areaState: { areas } } = UseSecretary()
    const [editmode, setEditmode] = useState(false);
    const [selectedEductationalPrograms, setSelectedEductationalPrograms] = useState(new Set([]));
    const ChangeFromAreaModal = useDisclosure()
    const DeleteEducativeProgramsModal = useDisclosure()
    const handlePress = (educationalProgram) => {
        setStoredEducationalPrograms({ selectedEducationalProgram: educationalProgram })
        onOpenModal()
    }
    const handleDeleteModal = (educationalProgram) => {
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
                    selectedEducationalPrograms={selectedEductationalPrograms}
                    isOpen={ChangeFromAreaModal.isOpen}
                    onOpen={ChangeFromAreaModal.onOpen}
                    onOpenChange={ChangeFromAreaModal.onOpenChange}
                />
                <DeleteManyModal
                    selectedEducationalPrograms={selectedEductationalPrograms}
                    isOpen={DeleteEducativeProgramsModal.isOpen}
                    onOpen={DeleteEducativeProgramsModal.onOpen}
                    onOpenChange={DeleteEducativeProgramsModal.onOpenChange}
                />
                <Switch
                    isDisabled={educationalPrograms.length === 0}
                    aria-label="Switch selection mode"
                    className="flex max-w-full w-full"
                    classNames={{
                        base: 'flex gap-2 p-1.5 bg-content2 rounded-lg border-2 border-transparent data-[selected=true]:border-default data-[disabled=true]:cursor-default data-[disabled=true]:opacity-50',
                    }}
                    thumbIcon={PencilIcon}
                    isSelected={editmode}
                    onValueChange={(e) => {
                        if (e) setSelectedEductationalPrograms(new Set([]))
                        setEditmode(e)
                    }}
                >
                    Selección multiple
                </Switch>
                {
                    editmode && (
                        <div className="flex items-center pt-2 md:pt-0 gap-2">
                            <Button
                                aria-label="Cambiar de área"
                                isDisabled={selectedEductationalPrograms.size === 0}
                                startContent={ArrowsRightLeftIcon}
                                color="primary"
                                onPress={handleChangeArea}
                            >Cambiar de area</Button>
                            <Button
                                aria-label="Eliminar varios"
                                isDisabled={selectedEductationalPrograms.size === 0}
                                startContent={TrashIcon}
                                color="danger"
                                onPress={handleDeleteMany}
                            >Eliminar</Button>
                        </div>
                    )
                }
            </div>
            <Table
                aria-label="Tabla de programas educativos"
                selectionMode={editmode ? "multiple" : 'none'}
                onSelectionChange={(e) => {
                    if (e === 'all') return setSelectedEductationalPrograms(new Set(educationalPrograms.map((edu) => edu.id)))
                    setSelectedEductationalPrograms(e)
                    console.log(selectedEductationalPrograms)
                }}
                selectedKeys={selectedEductationalPrograms}
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
                            editmode || 'Acciones'
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
                                {areas.find(area => area.id === educationalProgram.areaId).name}
                            </TableCell>
                            <TableCell>
                                {
                                    editmode || (
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