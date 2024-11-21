
import { tableClassNames } from "@/components/educationalProgram/EducationalProgramCard"
import { ModalError } from "@/components/ModalError"
import { getAreasJoinEducationalPrograms } from "@/models/transactions/area"
import { AreaJoinEducationalPrograms } from "@/models/types/area"
import { Accordion, AccordionItem, Chip, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@nextui-org/react"
import { getCookies, hasCookie } from "cookies-next"

export const getStaticProps = async () => {
    const cookies = getCookies()
    const hc = hasCookie('token')
    console.log(cookies, hc)
    const { data } = await getAreasJoinEducationalPrograms()
    const sortedEducaitonalPrograms = data.data.sort((area, nextArea) => {
        return nextArea.educationalPrograms.length - area.educationalPrograms.length
    })
    return {
        revalidate: 3,
        props: {
            data: sortedEducaitonalPrograms,
            error: data.error || null
        }
    }
}

export default function AreaIndex({ error, data: areas }: { error: string | null, data: AreaJoinEducationalPrograms[] }) {
    return (
        <>
            <Chip variant="solid" className="fixed right-8 bottom-10 bg-utim z-20">
                {areas.reduce((p, n) => p + n.educationalPrograms.length, 0)} Programas educativos
            </Chip>
            <Chip variant="solid" className="fixed right-8 bottom-20 bg-utim z-20">
                {areas.length} Áreas
            </Chip>
            <h1 className="text-1xl font-bold text-center text-utim tracking-widest capitalize p-2 m-2">Areas</h1>
            <ModalError error={error} />
            <section>
                <Accordion variant="splitted" title="Acordeones de areas" itemClasses={{
                    base: 'p-2 py-0',
                    title: 'text-sm p-2 py-0',
                }}>
                    {
                        areas.map((area) => (
                            <AccordionItem title={area.name} key={area.name}>
                                <Table classNames={tableClassNames}>
                                    <TableHeader>
                                        <TableColumn>
                                            Abreviatura
                                        </TableColumn>
                                        <TableColumn>
                                            Descripción
                                        </TableColumn>
                                    </TableHeader>
                                    <TableBody items={area.educationalPrograms} emptyContent='Sin programas educativos'>
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
                        ))
                    }
                </Accordion>
            </section>
        </>
    )
}