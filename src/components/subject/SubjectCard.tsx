import { UseSecretary } from "@/context"
import { CreateSubject, Subject } from "@/models/types/subject"
import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Switch, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, useDisclosure } from "@nextui-org/react"
import { ArrowsRightLeftIcon, PencilIcon, TrashIcon, VericalDotsIcon } from "../Icons"
import { tableClassNames } from "../educationalProgram/EducationalProgramCard"
import { useState } from "react"

export const SubjectTable = ({ onOpenModal, onOpenDeleteModal }: {
    onOpenModal: () => void,
    onOpenDeleteModal: () => void
}) => {
    const [editMode, setEditMode] = useState(false);
    const [selectedSubjects, setSelectedSubjects] = useState<Subject[]>([]);
    const { setStoredSubjects, subjectState: { subjects } } = UseSecretary()
    const ChangeFromProgramModal = useDisclosure()
    const ChangePeriodModal = useDisclosure()
    const DeleteSubjectsModal = useDisclosure()
    const handlePress = (subject: CreateSubject) => {
        setStoredSubjects({ selectedSubject: subject })
        onOpenModal()
    }
    const handleDelete = (subject: CreateSubject) => {
        setStoredSubjects({ selectedSubject: subject })
        onOpenDeleteModal()
    }
    const handleChangeEducationalProgram = () => {
        ChangeFromProgramModal.onOpen()
    }
    const handleChangePeriod = () => {
        ChangePeriodModal.onOpen()
    }
    const handleDeleteMany = () => {
        DeleteSubjectsModal.onOpen()
    }
    return (
        <div className="flex flex-col gap-2">
            <Switch isDisabled={subjects.length === 0}>
                Selección múltiple
            </Switch>
            {
                editMode && (
                    <div className="flex items-center pt-2 md:pt-0 gap-2">
                        <Button
                            aria-label="Cambiar de programa educativo"
                            isDisabled={selectedSubjects.length === 0}
                            startContent={ArrowsRightLeftIcon}
                            color="primary"
                            onPress={handleChangeEducationalProgram}
                        >
                            Cambiar de programa educativo
                        </Button>
                        <Button
                            aria-label="Cambiar de cuatrimestre"
                            isDisabled={selectedSubjects.length === 0}
                            startContent={ArrowsRightLeftIcon}
                            color="primary"
                            onPress={handleChangePeriod}
                        >
                            Cambiar de cuatrimestre
                        </Button>
                        <Button
                            aria-label="Eliminar varios"
                            isDisabled={selectedSubjects.length === 0}
                            startContent={TrashIcon}
                            color="danger"
                            onPress={handleDeleteMany}
                        >Eliminar</Button>
                    </div>
                )
            }
            <Table
                classNames={tableClassNames}
                aria-label="Tabla de materias"
                selectionMode={editMode ? 'multiple' : 'none'}
            >
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
                            <TableRow key={subject.id}>
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
        </div>
    )
}

