
import { Accordion, AccordionItem, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@nextui-org/react"
import { getAreasJoinEducationalPrograms } from "../../../models/transactions/area"
import { Area } from "../../../models/types/area"
import { tableClassNames } from "../../../components/educationalProgram/EducationalProgramCard"
import { ModalError } from "../../../components/ModalError"



export const getServerSideProps = async () => {
    const { data } = await getAreasJoinEducationalPrograms()
    return {
        props: data
    }
}

export default function AreaIndex({ error, data: areas }: { error: string | null, data: Area[] }) {
    return (
        <>
            <h1 className="text-1xl font-bold text-center text-utim tracking-widest capitalize p-2 m-2">Areas</h1>
            <ModalError error={error} />
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