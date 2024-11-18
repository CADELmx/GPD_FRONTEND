
import { Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@nextui-org/react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { UseTemplates } from "../../context";
import { ModalError } from "../../components/ModalError";
import { generateRecords } from "../../models/apiClient";
import { PartialTemplate } from "../../models/types/partial-template";
import { ChangeStatus } from "../../components/ChangeStatus";
import { MoreOptions } from "../../components/DownloadButton";

export default function Secretary({ partialTemplates, error }: { partialTemplates: PartialTemplate[], error: string }) {
  console.log(partialTemplates)
  const { memory: { socket } } = UseTemplates()
  const [templates, setTemplates] = useState<PartialTemplate[]>(partialTemplates);
  useEffect(() => {
    const onCreatedTemplate = (tamplate: PartialTemplate) => {
      setTemplates((templates) => ([...templates, tamplate]))
    }
    const onCreateComment = (comment) => {
      toast('Comentario enviado', {
        id: 'comment-insert'
      })
    }
    const onExistentComment = (comment) => {
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
  const columns = ['Nombre', 'Actividades', 'Horas', 'Estado', 'Más'].map((c, i) => ({
    key: i,
    title: c
  }))
  return (
    <>
      <ModalError error={error} />
      <h1 className="text-2xl font-bold text-center text-utim tracking-widest capitalize p-2 m-2">Secretaría académica</h1>
      <p className="tracking-widest p-2 m-2">Formatos recibidos</p>
      <section className="flex-col">
        <Table itemScope aria-label="tabla de plantillas">
          <TableHeader aria-label="cabecera de la tabla" columns={columns}>
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
              (template) => (
                <TableRow key={template.id}>
                  <TableCell aria-label="nombre">{template.name}</TableCell>
                  <TableCell aria-label="numero de actividades">{template.activities.length}</TableCell>
                  <TableCell aria-label="total horas">{template.total}</TableCell>
                  <TableCell className="p-0 m-0" aria-label="estado">
                    <ChangeStatus status={template.status} templateid={template.id} />
                  </TableCell>
                  <TableCell aria-label="descargar">
                    <MoreOptions templateid={template.id} templatename={template.name} />
                  </TableCell>
                </TableRow>
              )
            }
          </TableBody>
        </Table>
      </section>
    </>
  )
}

export const getStaticProps = async () => {
  const { props } = await generateRecords()
  return {
    revalidate: 3,
    props
  }
}
