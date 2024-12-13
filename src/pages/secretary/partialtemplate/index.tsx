
import { Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@nextui-org/react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { UseTemplates } from "@/context";
import { PartialTemplateJoinActivity } from "@/models/types/partial-template";
import { ModalError } from "@/components/ModalError";
import { tableClassNames } from "@/components/educationalProgram/EducationalProgramCard";
import { ChangeStatus } from "@/components/ChangeStatus";
import { MoreOptions } from "@/components/DownloadButton";
import { generateRecords } from "@/models/apiClient";
import { Comment } from "@/models/types/comment";

export default function SecretaryPartialTemplates({ partialTemplates, error }: { partialTemplates: PartialTemplateJoinActivity[], error: string }) {
    const { memory: { socket } } = UseTemplates()
    const [templates, setTemplates] = useState<PartialTemplateJoinActivity[]>(partialTemplates);
    useEffect(() => {
        const onCreatedTemplate = (tamplate: PartialTemplateJoinActivity) => {
            setTemplates((templates) => ([...templates, tamplate]))
        }
        const onCreateComment = (comment: Comment) => {
            toast('Comentario enviado', {
                id: 'comment-insert'
            })
        }
        const onExistentComment = (comment: Comment) => {
            toast('Comentario editado', {
                id: 'comment-update'
            })
        }
        socket.on('createdTemplate', onCreatedTemplate)
        socket.on('createComment', onCreateComment)
        socket.on('existentComment', onExistentComment)
        return () => {
            socket.off('createdTemplate')
            socket.off('createComment')
            socket.off('existentComment')
        };
    }, []);
    return (
        <>
            <ModalError error={error} />
            <h1 className="text-2xl font-bold text-center text-utim tracking-widest capitalize p-2 m-2">Secretaría académica</h1>
            <p className="tracking-widest p-2 m-2">Formatos recibidos</p>
            <Table classNames={tableClassNames} aria-label="tabla de plantillas">
                <TableHeader aria-label="cabecera de la tabla">
                    <TableColumn>
                        Nombre
                    </TableColumn>
                    <TableColumn>
                        Actividades
                    </TableColumn>
                    <TableColumn>
                        Horas
                    </TableColumn>
                    <TableColumn>
                        Estado
                    </TableColumn>
                    <TableColumn>
                        Más
                    </TableColumn>
                </TableHeader>
                <TableBody aria-label="cuerpo de la tabla" items={templates} emptyContent='Sin plantillas aún'>
                    {
                        (partialTemplate) => (
                            <TableRow key={partialTemplate.id}>
                                <TableCell aria-label="nombre">{partialTemplate.name}</TableCell>
                                <TableCell aria-label="numero de actividades">{partialTemplate.activities.length}</TableCell>
                                <TableCell aria-label="total horas">{partialTemplate.total}</TableCell>
                                <TableCell className="p-0 m-0" aria-label="estado">
                                    <ChangeStatus status={partialTemplate.status} templateid={partialTemplate.id} />
                                </TableCell>
                                <TableCell aria-label="descargar">
                                    <MoreOptions templateid={partialTemplate.id} templatename={partialTemplate.name} />
                                </TableCell>
                            </TableRow>
                        )
                    }
                </TableBody>
            </Table>
        </>
    )
}

export const getStaticProps = async () => {
    const { props } = await generateRecords()
    return {
        revalidate: 1,
        props
    }
}
