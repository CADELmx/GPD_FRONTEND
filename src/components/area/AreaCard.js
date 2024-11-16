import { UseSecretary } from "@/context"
import { Button, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@nextui-org/react"
import { PencilIcon, TrashIcon } from "../Icons"
import { tableClassNames } from "../educationalProgram/EducationalProgramCard"

export const AreaCards = ({ onOpenModal, onOpenDeleteModal }) => {

    const { setStoredAreas, areaState: { areas } } = UseSecretary()
    const handlePress = () => {
        setStoredAreas({ selectedArea: area })
        onOpenModal()
    }
    const handleDeleteModal = () => {
        setStoredAreas({ selectedArea: area })
        onOpenDeleteModal()
    }
    return (
        <div className="flex flex-col gap-2">
            <Table classNames={tableClassNames}>
                <TableHeader>
                    <TableColumn>
                        Nombre
                    </TableColumn>
                    <TableColumn>
                        Acciones
                    </TableColumn>
                </TableHeader>
                <TableBody items={areas}>
                    {
                        (area) => (
                            <TableRow key={area.id}>
                                <TableCell>{area.name}</TableCell>
                                <TableCell>
                                    <div className="w-full relative flex items-center gap-2">
                                        <Button onPress={() => handlePress(area)} isIconOnly variant="light">
                                            {PencilIcon}
                                        </Button>
                                        <Button onPress={() => handleDeleteModal(area)} isIconOnly variant="light" color="danger">
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