
import { Chip, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@nextui-org/react"
import { useEffect, useState } from "react"
import { UseTemplates } from "../../../context"
import { getPartialTemplatesJoinComments } from "../../../models/transactions/partial-template"
import { PartialTemplate } from "../../../models/types/partial-template"
import { ModalError } from "../../../components/ModalError"
import { tableClassNames } from "../../../components/educationalProgram/EducationalProgramCard"

const colors = {
    'Aprobado': 'success',
    'Corrección': 'danger',
    'Pendiente': 'warning'
}

export default function TemplatesStatus({ templates: ssrTemplates, error }: {
    templates: PartialTemplate[],
    error: string | null
}) {
    const { memory: { socket } } = UseTemplates()
    const [templates, setTemplates] = useState<PartialTemplate[]>()
    useEffect(() => {
        setTemplates(ssrTemplates)
        const onUpdateStatus = (newTemplate: PartialTemplate) => {
            setTemplates((templates) => templates.map((template) => {
                if (template.id === newTemplate.id) {
                    return {
                        ...template,
                        status: newTemplate.status
                    }
                }
                return template
            }))
        }
        socket.on('updateStatus', onUpdateStatus)
        return () => {
            socket.off('updateStatus')
        }
    }, [])

    return (
        <>
            <ModalError error={error} />
            <p className="tracking-widest p-2 m-2">Formatos enviados</p>
            <Table
                classNames={tableClassNames}
                aria-label="tabla de plantillas"
            >
                <TableHeader aria-label="cabecera de la tabla">
                    <TableColumn aria-label="columna nombre">Nombre</TableColumn>
                    <TableColumn aria-label="columna horas">Horas</TableColumn>
                    <TableColumn aria-label="columna estado">Estado</TableColumn>
                    <TableColumn aria-label="columna comentarios">Comentarios</TableColumn>
                </TableHeader>
                <TableBody
                    items={templates}
                    emptyContent='Sin plantillas parciales aún'
                >
                    {(template) => (
                        <TableRow key={template.id}>
                            <TableCell aria-label="nombre">{template.name}</TableCell>
                            <TableCell aria-label="horas">{template.total}</TableCell>
                            <TableCell aria-label="estado">
                                <Chip variant="dot" color={colors[template.status]}>{template.status}</Chip>
                            </TableCell>
                            <TableCell aria-label="comentarios">{template.comments.length === 0 ? 'Sin comentarios' : `${template.comments.length} comentarios`}
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </>
    )
}

export const getStaticProps = async () => {
    const { data: { data, error } } = await getPartialTemplatesJoinComments()
    return {
        revalidate: 3,
        props: {
            templates: data,
            error: error ? 'Error al obtener las plantillas, recarga la página' : null
        }
    }
}