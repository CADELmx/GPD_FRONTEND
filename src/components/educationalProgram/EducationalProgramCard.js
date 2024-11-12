import { UseSecretary } from "@/context"
import { Button, Card, CardBody, CardHeader } from "@nextui-org/react"

const EducationalProgramCard = ({ educationalProgram, onOpenModal, onOpenDeleteModal }) => {
    const { setStoredEducationalPrograms } = UseSecretary()
    const handlePress = () => {
        setStoredEducationalPrograms({ selectedEducationalProgram: educationalProgram })
        onOpenModal()
    }
    const handleDeleteModal = () => {
        setStoredEducationalPrograms({ selectedEducationalProgram: educationalProgram })
        onOpenDeleteModal()
    }
    return (
        <Card>
            <CardHeader>
                <h2>{educationalProgram.abbreviation}</h2>
            </CardHeader>
            <CardBody>
                <h2>{educationalProgram.description}</h2>
                <Button onPress={handlePress} isIconOnly variant="light">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
                    </svg>
                </Button>
                <Button onPress={handleDeleteModal} isIconOnly variant="light">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                    </svg>
                </Button>
            </CardBody>
        </Card>
    )
}

export const EducationalProgramCards = ({ educationalPrograms, onOpenModal, onOpenDeleteModal }) => {
    if (educationalPrograms.length === 0) return (
        <h1>No hay programas educativos registrados</h1>
    )
    return (
        <div className="flex flex-col gap-2">
            {educationalPrograms.map((educationalProgram) => (
                <EducationalProgramCard
                    onOpenModal={onOpenModal}
                    onOpenDeleteModal={onOpenDeleteModal}
                    educationalProgram={educationalProgram}
                    key={educationalProgram.id}
                />
            ))}
        </div>
    )
}