import { AreasTable } from "@/components/area/AreaCard"
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
    const EditModal = useDisclosure()
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
        <>
            <h1 className="text-1xl font-bold text-center text-utim tracking-widest capitalize p-2 m-2">Áreas</h1>
            <Button className="bg-utim" onPress={handlePress}>Nueva área</Button>
            <ModalError error={error} />
            <AreasTable
                areas={areas}
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