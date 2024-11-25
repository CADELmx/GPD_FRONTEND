import { ModalError } from "@/components/ModalError"
import { ImportSubjectsMenu } from "@/components/subject/ImportSubjectMenu"
import { SubjectTable } from "@/components/subject/SubjectCard"
import { SubjectModal } from "@/components/subject/SubjectModal"
import { UseSecretary } from "@/context"
import { getAreasJoinEducationalPrograms } from "@/models/transactions/area"
import { getSubjects } from "@/models/transactions/subject"
import { Area } from "@/models/types/area"
import { Subject } from "@/models/types/subject"
import { Accordion, AccordionItem, Button, useDisclosure } from "@nextui-org/react"
import { useEffect, useState } from "react"

export const getStaticProps = async () => {
    const { data: {
        data: subjects,
        error: subjectsError
    } } = await getSubjects()
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
    const DeleteSubjectModal = useDisclosure()
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
                            onOpenDeleteModal={DeleteSubjectModal.onOpen}
                        />
                    </>
                )
            }
            <SubjectModal
                isOpen={EditSubjectModal.isOpen}
                onOpen={EditSubjectModal.onOpen}
                onOpenChange={EditSubjectModal.onOpenChange}
            />
        </>
    )
}