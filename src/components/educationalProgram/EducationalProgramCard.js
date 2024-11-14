import { UseSecretary } from "@/context"
import { Button, Card, CardBody, CardHeader, Divider } from "@nextui-org/react"
import { PencilIcon, TrashIcon } from "../Icons"

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
            <CardBody className="flex flex-row items-center gap-1">
                <p className="text-utim w-1/4 flex items center text-center justify-center">{educationalProgram.abbreviation}</p>
                <p className="w-full">{educationalProgram.description}</p>
                <Button onPress={handlePress} isIconOnly variant="light">
                    {PencilIcon}
                </Button>
                <Button onPress={handleDeleteModal} isIconOnly color="danger" variant="light">
                    {TrashIcon}
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