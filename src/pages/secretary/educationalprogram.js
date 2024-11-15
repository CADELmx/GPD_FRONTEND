import { EducationalProgramCards } from "@/components/educationalProgram/EducationalProgramCard"
import { EducationalProgramDeleteModal, EducationalProgramModal } from "@/components/educationalProgram/EducationalProgramModal"
import { ExportEducationalProgramsMenu } from "@/components/educationalProgram/ImportMenu"
import { TrashIcon, UploadIcon } from "@/components/Icons"
import { ModalError } from "@/components/ModalError"
import { UseSecretary } from "@/context"
import { getAreas, getEducationalPrograms } from "@/models/transactions"
import { Accordion, AccordionItem, Button, useDisclosure } from "@nextui-org/react"
import { useEffect, useState } from "react"

export const getServerSideProps = async () => {
    const { data: {
        data: areas,
        error: areasError
    } } = await getAreas()
    const { data: {
        data: EducationalPrograms,
        error: EducationalProgramError
    } } = await getEducationalPrograms()
    const error = areasError || EducationalProgramError
    return {
        props: {
            areas,
            ssrEducationalPrograms: EducationalPrograms,
            error: error ? 'Algo salió mal al obtener las áreas, recarga la página' : null
        }
    }
}

export default function EducativeProgram({ areas, ssrEducationalPrograms, error }) {
    const { educationalState: { educationalPrograms }, setStoredEducationalPrograms, setStoredAreas } = UseSecretary()
    const [selectedKeys, setSelectedKeys] = useState(new Set([]));
    const EducativeProgramModal = useDisclosure()
    const DeleteModal = useDisclosure()
    const handleOpen = () => {
        EducativeProgramModal.onOpen()
    }
    useEffect(() => {
        setStoredEducationalPrograms({ educationalPrograms: ssrEducationalPrograms })
        setStoredAreas({ areas })
    }, [])
    return (
        <div className="flex flex-col items-center justify-center">
            <h1 className="text-1xl font-bold text-center text-utim tracking-widest capitalize p-2 m-2">Programas educativos</h1>
            <div className="flex flex-col gap-2 object-fill w-5/6 sm:w-2/3">
                <ModalError error={error} />
                <Accordion
                    showDivider={false}
                    isCompact
                    selectedKeys={selectedKeys}
                    onSelectionChange={setSelectedKeys}
                >
                    <AccordionItem
                        key='1'
                        title="Exportar programas educativos"
                        startContent={UploadIcon}
                    >
                        <ExportEducationalProgramsMenu />
                    </AccordionItem>
                </Accordion>
                {
                    selectedKeys.size === 1 || (
                        <>
                            <Button className="bg-utim" onPress={EducativeProgramModal.onOpen}>Nuevo programa educativo</Button>
                            <EducationalProgramCards
                                educationalPrograms={educationalPrograms}
                                onOpenModal={handleOpen}
                                onOpenDeleteModal={DeleteModal.onOpen}
                            />
                        </>
                    )
                }
                <EducationalProgramModal
                    isOpen={EducativeProgramModal.isOpen}
                    onOpen={EducativeProgramModal.onOpen}
                    onOpenChange={EducativeProgramModal.onOpenChange}
                />
                <EducationalProgramDeleteModal
                    isOpen={DeleteModal.isOpen}
                    onOpen={DeleteModal.onOpen}
                    onOpenChange={DeleteModal.onOpenChange}
                />
            </div>
        </div>
    )
}