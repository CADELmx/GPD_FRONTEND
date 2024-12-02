import { UploadIcon } from "@/components/Icons"
import { ModalError } from "@/components/ModalError"
import { ImportSubjectsMenu } from "@/components/subject/ImportSubjectMenu"
import { SubjectTable } from "@/components/subject/SubjectCard"
import { DeleteSubjectModal, SubjectModal } from "@/components/subject/SubjectModal"
import { UseSecretary } from "@/context"
import { getAreasJoinEducationalPrograms } from "@/models/transactions/area"
import { getSubjectsByEducationalProgram } from "@/models/transactions/subject"
import { Area } from "@/models/types/area"
import { Subject } from "@/models/types/subject"
import { Accordion, AccordionItem, Button, useDisclosure } from "@nextui-org/react"
import { useEffect, useState } from "react"
import { getEducationalPrograms } from "../../../models/transactions/educational-program"
import { generatePaths } from "../../../utils/routes"

export const getStaticPaths = async () => {
    const { data: { data, error } } = await getEducationalPrograms()
    const { fallback, paths } = generatePaths({ data, error })
    return {
        fallback,
        paths
    }
}

export const getStaticProps = async ({ params: { id } }: {
    params: {
        id: string
    }
}) => {
    const { data: {
        data: subjects,
        error: subjectsError
    } } = await getSubjectsByEducationalProgram({ id: Number(id) })
    const { data: {
        data: areas,
        error: areasError
    } } = await getAreasJoinEducationalPrograms()
    const error = (areasError || subjectsError) ? 'Error al obtener areas y/o materias, recargue la página' : null
    return {
        props: {
            subjects,
            areas: areas.filter((area) => area.educationalPrograms.length !== 0).map((area) => ({ ...area, educationalPrograms: [] })),
            error
        }
    }
}

export default function SubjectSecretary({ subjects: ssrSubjects, areas: ssrAreas, error }: {
    subjects: Subject[],
    areas: Area[],
    error: string | null
}) {
    const { setStoredSubjects, setStoredAreas } = UseSecretary()
    const EditSubjectModal = useDisclosure()
    const DeleteModal = useDisclosure()
    const [selectedKeys, setSelectedKeys] = useState<any>(new Set<any>([]))
    useEffect(() => {
        setStoredAreas({ areas: ssrAreas })
        setStoredSubjects({ subjects: ssrSubjects })
    }, []);
    return (
        <>
            <ModalError error={error} />
            <h1 className="text-1xl font-bold text-center text-utim tracking-widest capitalize p-2 m-2">Materias</h1>
            <Accordion
                showDivider={false}
                isCompact
                selectedKeys={selectedKeys}
                onSelectionChange={setSelectedKeys}
            >
                <AccordionItem
                    key='1'
                    title='Importar materias'
                    startContent={UploadIcon}
                >
                    <ImportSubjectsMenu />
                </AccordionItem>
            </Accordion>
            {
                selectedKeys.size === 1 || (
                    <>
                        <Button
                            className="bg-utim"
                            onPress={EditSubjectModal.onOpen}
                        >
                            Nueva materia
                        </Button>
                        <SubjectTable
                            onOpenModal={EditSubjectModal.onOpen}
                            onOpenDeleteModal={DeleteModal.onOpen}
                        />
                    </>
                )
            }
            <SubjectModal
                isOpen={EditSubjectModal.isOpen}
                onOpen={EditSubjectModal.onOpen}
                onOpenChange={EditSubjectModal.onOpenChange}
            />
            <DeleteSubjectModal
                isOpen={DeleteModal.isOpen}
                onOpen={DeleteModal.onOpen}
                onOpenChange={DeleteModal.onOpenChange}
            />
        </>
    )
}