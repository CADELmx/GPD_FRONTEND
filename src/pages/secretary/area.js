import { AreaCards } from "@/components/area/AreaCard"
import { AreaModal, DeleteAreaModal } from "@/components/area/AreaModal"
import { ModalError } from "@/components/ModalError"
import { UseSecretary } from "@/context"
import { getAreas } from "@/models/transactions"
import { Button, useDisclosure } from "@nextui-org/react"
import { useEffect } from "react"

export const getServerSideProps = async () => {
    const { data: { data, error } } = await getAreas()
    return {
        props: {
            areas: data,
            error
        }
    }
}

export default function Areas({ areas: ssrAreas, error }) {
    const { isOpen, onOpen, onOpenChange } = useDisclosure()
    const DeleteModal = useDisclosure()
    const { areaState: { areas }, setStoredAreas } = UseSecretary()
    const handlePress = () => {
        setStoredAreas({ selectedArea: null })
        onOpen()
    }
    useEffect(() => {
        setStoredAreas({ areas: ssrAreas })
    }, [])
    return (
        <div className="flex flex-col items-center justify-center">
            <h1 className="text-1xl font-bold text-center text-utim tracking-widest capitalize p-2 m-2">Áreas</h1>
            <div className="flex flex-col gap-2 object-fill w-5/6 sm:w-2/3">
                <Button className="bg-utim" onPress={handlePress}>Nueva área</Button>
                <ModalError error={error} />
                <AreaCards
                    areas={areas}
                    onOpenModal={onOpen}
                    onOpenDeleteModal={DeleteModal.onOpen}
                />
                <AreaModal
                    isOpen={isOpen}
                    onOpen={onOpen}
                    onOpenChange={onOpenChange}
                />
                <DeleteAreaModal isOpen={DeleteModal.isOpen} onOpen={DeleteModal.onOpen} onOpenChange={DeleteModal.onOpenChange} />
            </div>
        </div>
    )
}