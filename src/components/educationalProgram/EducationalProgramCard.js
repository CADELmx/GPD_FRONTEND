import { UseSecretary } from "@/context"
import { Button, ButtonGroup, Card, CardBody, CardFooter, CardHeader, Divider, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Switch, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@nextui-org/react"
import { ArrowsRightLeftIcon, PencilIcon, TrashIcon, VericalDotsIcon } from "../Icons"
import { useState } from "react"

export const EducationalProgramCards = ({ educationalPrograms, onOpenModal, onOpenDeleteModal }) => {
    const { setStoredEducationalPrograms, areaState: { areas } } = UseSecretary()
    const [editmode, setEditmode] = useState(false);
    const [selectedEductationalPrograms, setSelectedEductationalPrograms] = useState(new Set([]));
    const handlePress = (educationalProgram) => {
        setStoredEducationalPrograms({ selectedEducationalProgram: educationalProgram })
        onOpenModal()
    }
    const handleDeleteModal = (educationalProgram) => {
        setStoredEducationalPrograms({ selectedEducationalProgram: educationalProgram })
        onOpenDeleteModal()
    }
    if (educationalPrograms.length === 0) return (
        <h1>No hay programas educativos registrados</h1>
    )
    return (
        <div className="flex flex-col gap-2">
            <div className="md:flex gap-2 items-center">
                <Switch
                    className="flex max-w-full w-full"
                    classNames={{
                        base: 'flex gap-2 p-1.5 bg-content2 rounded-lg border-2 border-transparent data-[selected=true]:border-default',
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
                            <Button isDisabled={selectedEductationalPrograms.size === 0} startContent={ArrowsRightLeftIcon} color="primary">Cambiar de area</Button>
                            <Button isDisabled={selectedEductationalPrograms.size === 0} startContent={TrashIcon} color="danger">Eliminar</Button>
                        </div>
                    )
                }
            </div>
            <Table
                selectionMode={editmode ? "multiple" : 'none'}
                onSelectionChange={(e) => {
                    setSelectedEductationalPrograms(e)
                    console.log(selectedEductationalPrograms)
                }}
                selectedKeys={selectedEductationalPrograms}
                isCompact
                classNames={{
                    wrapper: 'm-0 p-1',
                    td: 'text-xs p-2',
                    th: 'text-xs p-2',
                }}>
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
                <TableBody items={educationalPrograms}>
                    {(educationalProgram) => (
                        <TableRow key={educationalProgram.id}>
                            <TableCell className="text-utim">
                                {educationalProgram.abbreviation}
                            </TableCell>
                            <TableCell>
                                {educationalProgram.description}
                            </TableCell>
                            <TableCell>
                                {areas[educationalProgram.areaId].name}
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
                                            <DropdownMenu>
                                                <DropdownItem startContent={PencilIcon} onPress={() => handlePress(educationalProgram)}>
                                                    Editar
                                                </DropdownItem>
                                                <DropdownItem startContent={TrashIcon} onPress={() => handleDeleteModal(educationalProgram)} color="danger">Eliminar</DropdownItem>
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