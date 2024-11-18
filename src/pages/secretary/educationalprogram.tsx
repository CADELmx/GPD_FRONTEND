
import { Accordion, AccordionItem, Button, useDisclosure } from "@nextui-org/react"
import { useEffect, useState } from "react"
import { getAreas } from "../../models/transactions/area"
import { getEducationalPrograms } from "../../models/transactions/educational-program"
import { UseSecretary } from "../../context"
import { ModalError } from "../../components/ModalError"
import { UploadIcon } from "../../components/Icons"
import { ExportEducationalProgramsMenu } from "../../components/educationalProgram/ImportMenu"
import { EducationalProgramsTable } from "../../components/educationalProgram/EducationalProgramCard"
import { EducationalProgramDeleteModal, EducationalProgramModal } from "../../components/educationalProgram/EducationalProgramModal"

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
    const [selectedKeys, setSelectedKeys] = useState<any>(new Set([]));
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
        <>
            <h1 className="text-1xl font-bold text-center text-utim tracking-widest capitalize p-2 m-2">Programas educativos</h1>
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
                        <Button
                            className="bg-utim"
                            onPress={EducativeProgramModal.onOpen}
                        >
                            Nuevo programa educativo
                        </Button>
                        <EducationalProgramsTable
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
        </>
    )
}