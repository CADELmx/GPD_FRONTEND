import { AreaCards } from "@/components/area/AreaCard"
import { AreaModal, DeleteAreaModal } from "@/components/area/AreaModal"
import { UseAreas } from "@/context"
import { getAreas } from "@/models/transactions"
import { Button, useDisclosure } from "@nextui-org/react"
import { useEffect } from "react"

export const getServerSideProps = async () => {
    const { data: { data, error } } = await getAreas()
    console.log(data)
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
    const { areaState: { areas }, setStoredAreas } = UseAreas()
    const handlePress = () => {
        setStoredAreas({ selectedArea: null })
        onOpen()
    }
    useEffect(() => {
        setStoredAreas({ areas: ssrAreas })
    }, [])
    return (
        <div className="flex flex-col items-center justify-center">
            <h1 className="font-bold text-utim">Áreas</h1>
            <div className="flex flex-col gap-2 object-fill w-5/6 sm:w-2/3 pt-5 mt-5">
                <Button className="bg-utim" onPress={handlePress}>Nueva área</Button>
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