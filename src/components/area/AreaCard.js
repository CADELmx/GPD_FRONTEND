import { UseSecretary } from "@/context"
import { Button, Card, CardHeader } from "@nextui-org/react"
import { PencilIcon, TrashIcon } from "../Icons"

const AreaCard = ({ area, onOpenModal, onOpenDeleteModal }) => {
    const { setStoredAreas } = UseSecretary()
    const handlePress = () => {
        setStoredAreas({ selectedArea: area })
        onOpenModal()
    }
    const handleDeleteModal = () => {
        setStoredAreas({ selectedArea: area })
        onOpenDeleteModal()
    }
    return (
        <Card>
            <CardHeader className="flex gap-1">
                <h2 className="w-full">{area.name}</h2>
                <Button onPress={handlePress} isIconOnly variant="light">
                    {PencilIcon}
                </Button>
                <Button onPress={handleDeleteModal} isIconOnly variant="light" color="danger">
                    {TrashIcon}
                </Button>
            </CardHeader>
        </Card>
    )
}



export const AreaCards = ({ areas, onOpenModal, onOpenDeleteModal }) => {
    if (areas.length === 0) return (
        <h1>No hay áreas registradas</h1>
    )
    return (
        <div className="flex flex-col gap-2">
            {areas.map((area) => (
                <AreaCard
                    onOpenModal={onOpenModal}
                    onOpenDeleteModal={onOpenDeleteModal}
                    area={area}
                    key={area.id}
                />
            ))}
        </div>
    )
}