import { Button, Chip, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@nextui-org/react"
import { PencilIcon, TrashIcon } from "../Icons"
import { tableClassNames } from "../educationalProgram/EducationalProgramCard"
import { UseSecretary } from "../../context"
import { AreaEducationalProgramCount, CreateArea } from "@/models/types/area"

export const AreasTable = ({ onOpenModal, onOpenDeleteModal }: {
    onOpenModal: () => void,
    onOpenDeleteModal: () => void
}) => {

    const { setStoredAreas, areaState: { areas } } = UseSecretary()
    const handlePress = (area: CreateArea) => {
        setStoredAreas({ selectedArea: area })
        onOpenModal()
    }
    const handleDeleteModal = (area: CreateArea) => {
        setStoredAreas({ selectedArea: area })
        onOpenDeleteModal()
    }
    return (
        <div className="flex flex-col gap-2">
            <Table
                classNames={{
                    ...tableClassNames,
                    base: 'max-h-[34rem] overflow-auto'
                }}
                isCompact
                aria-label="Tabla de áreas"
            >
                <TableHeader>
                    <TableColumn>
                        Nombre
                    </TableColumn>
                    <TableColumn>
                        Número de P.E
                    </TableColumn>
                    <TableColumn>
                        Acciones
                    </TableColumn>
                </TableHeader>
                <TableBody items={areas as AreaEducationalProgramCount[]}>
                    {
                        (area: AreaEducationalProgramCount) => (
                            <TableRow key={area.id}>
                                <TableCell>{area.name}</TableCell>
                                <TableCell>
                                    <Chip variant="bordered">
                                        {area?._count.educationalPrograms || 0}
                                    </Chip>
                                </TableCell>
                                <TableCell>
                                    <div className="w-full relative flex items-center gap-2">
                                        <Button
                                            onPress={() => handlePress(area)}
                                            size="sm"
                                            isIconOnly
                                            variant="light"
                                        >
                                            {PencilIcon}
                                        </Button>
                                        <Button
                                            onPress={() => handleDeleteModal(area)}
                                            size="sm"
                                            isIconOnly
                                            variant="light"
                                            color="danger"
                                        >
                                            {TrashIcon}
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        )
                    }
                </TableBody>
            </Table>
        </div>
    )
}