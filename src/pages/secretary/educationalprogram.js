import { EducationalProgramCards } from "@/components/educationalProgram/EducationalProgramCard"
import { EducationalProgramModal } from "@/components/educationalProgram/EducationalProgramModal"
import { ModalError } from "@/components/ModalError"
import { UseSecretary } from "@/context"
import { getAreas, getEducationalPrograms } from "@/models/transactions"
import { Button, useDisclosure } from "@nextui-org/react"
import { useEffect } from "react"

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
    const { educationalState: { educationalPrograms }, setStoredEducationalPrograms } = UseSecretary()
    const DeleteModal = useDisclosure()
    const EducativeProgramModal = useDisclosure()
    const handleOpen = () => {
        EducativeProgramModal.onOpen()
    }
    useEffect(() => {
        setStoredEducationalPrograms({ educationalPrograms: ssrEducationalPrograms })
    }, [])
    return (
        <div className="flex flex-col items-center justify-center">
            <h1 className="text-1xl font-bold text-center text-utim tracking-widest capitalize p-2 m-2">Programas educativos</h1>
            <div className="flex flex-col gap-1 w-5/6 sm:w-2/3">
                <Button className="bg-utim" onPress={EducativeProgramModal.onOpen}>Nuevo programa educativo</Button>
                <ModalError error={error} />
                <EducationalProgramCards
                    educationalPrograms={educationalPrograms}
                    onOpenModal={handleOpen}
                    onOpenDeleteModal={DeleteModal.onOpen}
                />
                <EducationalProgramModal
                    areas={areas}
                    isOpen={EducativeProgramModal.isOpen}
                    onOpen={EducativeProgramModal.onOpen}
                    onOpenChange={EducativeProgramModal.onOpenChange}
                />
            </div>
        </div>
    )
}