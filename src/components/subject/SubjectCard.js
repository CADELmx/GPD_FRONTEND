import { UseSecretary } from "@/context"
import { Button, Card, CardBody, CardFooter, CardHeader } from "@nextui-org/react"

export const SubjectCard = ({ subject, onOpenModal, onOpenDeleteModal }) => {
    const { setStoredSubjects } = UseSecretary()
    const handlePress = () => {
        setStoredSubjects({ selectedSubject: subject })
        onOpenModal()
    }
    const handleDelete = () => {
        setStoredSubjects({ selectedSubject: subject })
        onOpenDeleteModal()
    }
    return (
        <Card>
            <CardHeader>{subject.name}</CardHeader>
            <CardBody className="flex">
                <p className="text-1xl text-utim">
                    Cuatrimestre: {subject.monthPeriod}
                </p>
                <p>
                    Horas semanales: {subject.weeklyHours}
                </p>
                <p>
                    Horas totales: {subject.totalHours}
                </p>
            </CardBody>
            <CardFooter>
                <Button onPress={handlePress} isIconOnly variant="light">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
                    </svg>
                </Button>
                <Button onPress={handleDelete} isIconOnly color="danger" variant="light">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                    </svg>
                </Button>
            </CardFooter>
        </Card>
    )
}

export const SubjectCards = ({ subjects, onOpenModal, onOpenDeleteModal }) => {
    if (subjects.length === 0) return (
        <p>No hay materias registradas</p>
    )
    return (
        <div className="flex flex-col gap-2">
            {
                subjects.map(subject => (
                    <SubjectCard
                        onOpenModal={onOpenModal}
                        onOpenDeleteModal={onOpenDeleteModal}
                        card={subject}
                        key={subject.id}
                    />
                ))
            }
        </div>
    )
}

export const CardRepeater = ({ array, onOpenModal, onOpenDeleteModal, EmptyComponent }) => {
    if (array.length === 0) return (
        <EmptyComponent />
    )
    return (
        array.map((element) => (
            <CardComponent {...element} key={element.id} onOpenModal={onOpenModal} onOpenDeleteModal={onOpenDeleteModal}></CardComponent>
        ))
    )
}