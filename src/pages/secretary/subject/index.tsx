import { Accordion, AccordionItem, Button, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@nextui-org/react"
import { ModalError } from "../../../components/ModalError"
import { getEducationalPrograms } from "../../../models/transactions/educational-program"
import { EducationalProgram } from "../../../models/types/educational-program"
import { UseSecretary } from "../../../context"
import { useEffect, useState } from "react"
import Link from "next/link"
import { tableClassNames } from "../../../components/educationalProgram/EducationalProgramCard"
import { ImportSubjectsMenu } from "@/components/subject/ImportSubjectMenu"
import { UploadIcon } from "@/components/Icons"
import { Area } from "../../../models/types/area"
import { getAreasJoinEducationalPrograms } from "../../../models/transactions/area"

export const getStaticProps = async () => {
    const { data: { data, error } } = await getEducationalPrograms()
    const { data: {
        data: areas,
        error: areasError
    } } = await getAreasJoinEducationalPrograms()
    if (error || areasError) return {
        props: {
            error: 'Error al obtener los programas educativos, recarga la página',
            educationalPrograms: [],
            areas: []
        }
    }
    return {
        props: {
            areas,
            educationalPrograms: data,
            error: null
        }
    }
}

export default function SecretaryAllSubjects({ educationalPrograms: ssrEducationalPrograms, areas: ssrAreas, error }: {
    educationalPrograms: EducationalProgram[],
    areas: Area[],
    error: string | null
}) {
    const { educationalState: { educationalPrograms }, setStoredEducationalPrograms, setStoredAreas } = UseSecretary()
    const [selectedKeys, setSelectedKeys] = useState<any>(new Set<any>([]))
    useEffect(() => {
        setStoredEducationalPrograms({
            educationalPrograms: ssrEducationalPrograms
        })
        setStoredAreas({ areas: ssrAreas })
    }, [])

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

                    <Table
                        isCompact
                        isHeaderSticky
                        classNames={{
                            ...tableClassNames,
                            base: `max-h-[34rem] overflow-auto`,
                        }}
                    >
                        <TableHeader>
                            <TableColumn>
                                Programa educativo
                            </TableColumn>
                            <TableColumn>
                                Acciones
                            </TableColumn>
                        </TableHeader>
                        <TableBody items={educationalPrograms}>
                            {(educationalProgram) => (
                                <TableRow>
                                    <TableCell>
                                        {
                                            educationalProgram.description
                                        }
                                    </TableCell>
                                    <TableCell>
                                        {
                                            <Link passHref legacyBehavior href={`/secretary/subject/${educationalProgram.id}`}>
                                                <Button
                                                    size="sm"
                                                    variant="solid"
                                                    color="primary"
                                                >
                                                    Ver materias
                                                </Button>
                                            </Link>
                                        }
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                )
            }
        </>
    )
}