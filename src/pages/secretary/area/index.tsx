
import { AreaModal, DeleteAreaModal } from "@/components/area/AreaModal"
import { AreasTable } from "@/components/area/AreaTable"
import { ImportAreasMenu } from "@/components/area/ImportAreaMenu"
import { UploadIcon } from "@/components/Icons"
import { ModalError } from "@/components/ModalError"
import { UseSecretary } from "@/context"
import { getAreasEducationalProgramsCount } from "@/models/transactions/area"
import { Area } from "@/models/types/area"
import { InitSelectedKeys } from "@/utils"
import { Accordion, AccordionItem, Button, Selection, useDisclosure } from "@nextui-org/react"
import { useEffect, useState } from "react"

export const getStaticProps = async () => {
    const { data: { data, error } } = await getAreasEducationalProgramsCount()
    return {
        revalidate: 1,
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
    const [selectedKeys, setSelectedKeys] = useState(InitSelectedKeys);
    const handleSelectionChange = (e: Selection) => {
        if (e === "all") return
        setSelectedKeys(e)
    }
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
            <ModalError error={error} />
            <Accordion
                showDivider={false}
                isCompact
                selectedKeys={selectedKeys as Selection}
                onSelectionChange={handleSelectionChange}
            >
                <AccordionItem
                    key='1'
                    title="Importar áreas"
                    startContent={UploadIcon}
                >
                    <ImportAreasMenu />
                </AccordionItem>
            </Accordion>
            {
                selectedKeys.size === 1 || (
                    <>
                        <Button
                            className="bg-utim"
                            onPress={handlePress}
                        >
                            Nueva área
                        </Button>
                        <AreasTable
                            onOpenModal={EditModal.onOpen}
                            onOpenDeleteModal={DeleteModal.onOpen}
                        />
                    </>
                )
            }

            <AreaModal
                isOpen={EditModal.isOpen}
                onOpen={EditModal.onOpen}
                onOpenChange={EditModal.onOpenChange}
            />
            <DeleteAreaModal isOpen={DeleteModal.isOpen} onOpen={DeleteModal.onOpen} onOpenChange={DeleteModal.onOpenChange} />
        </>
    )
}