
import { AreaModal, DeleteAreaModal } from "@/components/area/AreaModal"
import { AreasTable } from "@/components/area/AreaTable"
import { ModalError } from "@/components/ModalError"
import { UseSecretary } from "@/context"
import { getAreas } from "@/models/transactions/area"
import { Area } from "@/models/types/area"
import { Button, useDisclosure } from "@nextui-org/react"
import { useEffect } from "react"

export const getStaticProps = async () => {
    const { data: { data, error } } = await getAreas()
    return {
        revalidate: 3,
        props: {
            areas: data,
            error,
        }
    }
}

export default function AreasIndex({ areas: ssrAreas, error }: { areas: Area[], error: string | null }) {
    const EditModal = useDisclosure()
    const DeleteModal = useDisclosure()
    const { setStoredAreas } = UseSecretary()
    const handlePress = () => {
        setStoredAreas({ selectedArea: null })
        EditModal.onOpen()
    }
    useEffect(() => {
        setStoredAreas({ areas: ssrAreas })
    }, [])
    return (
        <>
            <h1 className="text-1xl font-bold text-center text-utim tracking-widest capitalize p-2 m-2">Áreas</h1>
            <Button className="bg-utim" onPress={handlePress}>Nueva área</Button>
            <ModalError error={error} />
            <AreasTable
                onOpenModal={EditModal.onOpen}
                onOpenDeleteModal={DeleteModal.onOpen}
            />
            <AreaModal
                isOpen={EditModal.isOpen}
                onOpen={EditModal.onOpen}
                onOpenChange={EditModal.onOpenChange}
            />
            <DeleteAreaModal isOpen={DeleteModal.isOpen} onOpen={DeleteModal.onOpen} onOpenChange={DeleteModal.onOpenChange} />
        </>
    )
}