import { tableClassNames } from "@/components/educationalProgram/EducationalProgramCard"
import { serverClient } from "@/models/transactions"
import { Accordion, AccordionItem, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@nextui-org/react"

type Area = {
    name: string
    educationalPrograms?: {
        id: number
        abbreviation: string
        description: string
    }[]
}

type AreaProps = {
    error: string
    data: Area[]
}

type SSrProps = {
    props: {
        data: Area[]
        error: string
    }
}
export const getAreasJoinEducationalPrograms = () => {
    return serverClient.get('/areas/educational-programs')
}

export const getServerSideProps = async (): SSrProps => {
    const { data: { data: areas, error } }: {
        data: AreaProps
    } = await getAreasJoinEducationalPrograms()
    return {
        props: {
            error: error,
            data: areas
        }
    }
}

export default function Area({ error, data: areas }: AreaProps): JSX.Element {
    return (
        <>
            <Accordion variant="splitted" title="sss">
                {
                    areas.map((area) => {
                        if (area.educationalPrograms.length === 0) return
                        return (
                            <AccordionItem title={area.name} key={area.name}>
                                <Table classNames={tableClassNames} title={`Tabla de ${area.name}`}>
                                    <TableHeader>
                                        <TableColumn>
                                            Abreviatura
                                        </TableColumn>
                                        <TableColumn>
                                            Descripción
                                        </TableColumn>
                                    </TableHeader>
                                    <TableBody items={area.educationalPrograms}>
                                        {
                                            (educationalProgram) => (
                                                <TableRow key={educationalProgram.id}>
                                                    <TableCell>
                                                        {educationalProgram.abbreviation}
                                                    </TableCell>
                                                    <TableCell>
                                                        {educationalProgram.description}
                                                    </TableCell>
                                                </TableRow>
                                            )
                                        }
                                    </TableBody>
                                </Table>
                            </AccordionItem>
                        )
                    })
                }
            </Accordion>
        </>
    )
}