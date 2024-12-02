import { Button, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@nextui-org/react"
import { ModalError } from "../../../components/ModalError"
import { getEducationalPrograms } from "../../../models/transactions/educational-program"
import { EducationalProgram } from "../../../models/types/educational-program"
import { UseSecretary } from "../../../context"
import { useEffect } from "react"
import Link from "next/link"
import { tableClassNames } from "../../../components/educationalProgram/EducationalProgramCard"

export const getStaticProps = async () => {
    const { data: { data, error } } = await getEducationalPrograms()
    if (error) return {
        props: {
            error: 'Error al obtener los programas educativos, recarga la página',
            educationalPrograms: []
        }
    }
    return {
        props: {
            educationalPrograms: data,
            error: null
        }
    }
}

export default function SecretaryAllSubjects({ educationalPrograms: ssrEducationalPrograms, error }: {
    educationalPrograms: EducationalProgram[], error: string | null
}) {
    const { educationalState: { educationalPrograms }, setStoredEducationalPrograms } = UseSecretary()
    useEffect(() => {
        setStoredEducationalPrograms({
            educationalPrograms: ssrEducationalPrograms
        })
    }, [])

    return (
        <>
            <ModalError error={error} />
            <h1 className="text-1xl font-bold text-center text-utim tracking-widest capitalize p-2 m-2">Materias</h1>
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
        </>
    )
}