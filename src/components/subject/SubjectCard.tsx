import { UseSecretary } from "@/context"
import { Subject } from "@/models/types/subject"
import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@nextui-org/react"
import { PencilIcon, TrashIcon, VericalDotsIcon } from "../Icons"
import { tableClassNames } from "../educationalProgram/EducationalProgramCard"

export const SubjectTable = ({ onOpenModal, onOpenDeleteModal }: {
    onOpenModal: () => void,
    onOpenDeleteModal: () => void
}) => {
    const { setStoredSubjects, subjectState: { subjects } } = UseSecretary()
    const handlePress = (subject: Subject) => {
        setStoredSubjects({ selectedSubject: subject })
        onOpenModal()
    }
    const handleDelete = (subject: Subject) => {
        setStoredSubjects({ selectedSubject: subject })
        onOpenDeleteModal()
    }
    return (
        <Table classNames={tableClassNames}>
            <TableHeader>
                <TableColumn>
                    Nombre
                </TableColumn>
                <TableColumn>
                    Horas semanales
                </TableColumn>
                <TableColumn>
                    Horas totales
                </TableColumn>
                <TableColumn>
                    Periodo
                </TableColumn>
                <TableColumn>
                    Acciones
                </TableColumn>
            </TableHeader>
            <TableBody items={subjects} emptyContent='Sin materias'>
                {
                    (subject) => (
                        <TableRow>
                            <TableCell>
                                {subject.subjectName}
                            </TableCell>
                            <TableCell>
                                {subject.weeklyHours}
                            </TableCell>
                            <TableCell>
                                {subject.totalHours}
                            </TableCell>
                            <TableCell>
                                {subject.monthPeriod}
                            </TableCell>
                            <TableCell>
                                <Dropdown>
                                    <DropdownTrigger>
                                        <Button
                                            isIconOnly
                                            variant="light"
                                        >
                                            {VericalDotsIcon}
                                        </Button>
                                    </DropdownTrigger>
                                    <DropdownMenu>
                                        <DropdownItem
                                            startContent={PencilIcon}
                                            onPress={() => handlePress(subject)}
                                        >
                                            Editar
                                        </DropdownItem>
                                        <DropdownItem
                                            startContent={TrashIcon}
                                            onPress={() => handleDelete(subject)}
                                            color="danger"
                                        >
                                            Elminar
                                        </DropdownItem>
                                    </DropdownMenu>
                                </Dropdown>
                            </TableCell>
                        </TableRow>
                    )
                }
            </TableBody>
        </Table>
    )
}

