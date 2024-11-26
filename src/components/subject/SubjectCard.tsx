import { UseSecretary } from "@/context"
import { CreateSubject, Subject } from "@/models/types/subject"
import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Selection, Switch, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, useDisclosure } from "@nextui-org/react"
import { ArrowsRightLeftIcon, PencilIcon, TrashIcon, VericalDotsIcon } from "../Icons"
import { tableClassNames } from "../educationalProgram/EducationalProgramCard"
import { useState } from "react"
import { InitiSelectedKeys } from "../../utils"
import { SwitchMode } from "../SwitchMode"

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
    const onSubjectSelectionChange = (e: Selection) => {
        if (e === "all") return setSelectedSubjects(subjects)
        setSelectedSubjects(subjects.filter(subject => e.has(subject.id)))
    }
    const onChangeEditMode = (e: boolean) => {
        if (e) setSelectedSubjects([])
        setEditMode(e)
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
    const checkSamePeriod = (subjects: Subject[]) => {
        const period = subjects[0].monthPeriod
        return subjects.every(subject => subject.monthPeriod === period)
    }
    const checkSameEducationalProgram = (subjects: Subject[]) => {
        const program = subjects[0].educationalProgramId
        return subjects.every(subject => subject.educationalProgramId === program)
    }
    const disabledChangePeriod = selectedSubjects.length === 0 || !checkSamePeriod(selectedSubjects)
    const disabledChangeProgram = selectedSubjects.length === 0 || !checkSameEducationalProgram(selectedSubjects)
    return (
        <div className="flex flex-col gap-2">
            <div className="flex-col md:flex gap-2 items-center">
                <SwitchMode
                    isSelected={editMode}
                    isDisabled={subjects.length === 0}
                    onValueChange={onChangeEditMode}
                >
                    Selección múltiple
                </SwitchMode>
                {
                    editMode && (
                        <div className="flex flex-col sm:flex-row items-center pt-2 md:pt-0 gap-2">
                            <Button
                                fullWidth
                                aria-label="Cambiar de programa educativo"
                                isDisabled={disabledChangeProgram}
                                startContent={ArrowsRightLeftIcon}
                                color="primary"
                                onPress={handleChangeEducationalProgram}
                            >
                                Cambiar de programa educativo
                            </Button>
                            <div className="flex gap-2 w-full">
                                <Button
                                    fullWidth
                                    aria-label="Cambiar de cuatrimestre"
                                    isDisabled={disabledChangePeriod}
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
                                >
                                    Eliminar
                                </Button>
                            </div>
                        </div>
                    )
                }
            </div>
            <Table
                classNames={tableClassNames}
                aria-label="Tabla de materias"
                selectionMode={editMode ? 'multiple' : 'none'}
                onSelectionChange={onSubjectSelectionChange}
                selectedKeys={selectedSubjects.map(subject => subject.id)}
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
                        {
                            editMode || 'Acciones'
                        }
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
                                    {
                                        editMode || (
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
                                        )
                                    }
                                </TableCell>
                            </TableRow>
                        )
                    }
                </TableBody>
            </Table>
        </div>
    )
}

