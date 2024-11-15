import { Button, Chip, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@nextui-org/react"
import { UploadIcon } from "../Icons"
import { useState } from "react";
import axios from "axios";

export const ExportEducationalProgramsMenu = () => {
    const [file, setFile] = useState();
    const [educationalPrograms, setEducationalPrograms] = useState([]);
    const [loading, setLoading] = useState(false);
    const handleFileChange = (e) => {
        if (e.target.files) {
            setFile(e.target.files[0])
        }
    }
    const handleExport = async () => {
        if (file) {
            setLoading(true)
            const formData = new FormData();
            formData.append('file', file);
            const { status } = await axios.post('/api/import/educationalprogram', formData)
            if (status === 200) {
                const { data } = await axios.get(`/api/import/${file.name}`)
                const newEducationalPrograms = JSON.parse(data)
                setEducationalPrograms(newEducationalPrograms.sort((a, b) => a.abbreviation.localeCompare(b.abbreviation)))
                console.log(educationalPrograms)
            }
            setLoading(false)
        }
    }
    return (
        <div className="flex flex-col items-center justify-center w-full gap-2">
            <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full text-foreground border-2 border-none outline-2 rounded-lg cursor-pointer bg-content1 shadow-medium box-border">
                <div className="flex flex-col items-center justify-center pt-5 pb-6 gap-4">
                    {UploadIcon}
                    <p className="text-sm">
                        <span className="font-semibold">
                            Presiona para subir
                        </span> o arrastra y suelta el archivo
                    </p>
                    <div className="flex items-center justify-center gap-3">
                        <p className="text-xs text-utim">Archivos en formato JSON</p>
                    </div>
                    <div className="flex items-center justify-center gap-2">
                        <Chip isDisabled={!file} variant="bordered">{file ? file?.name : 'Nada seleccionado'}</Chip>
                        {
                            file &&
                            <Chip isDisabled={file?.type !== 'application/json'} variant="solid" color={file?.type === 'application/json' ? 'success' : 'danger'}>{file?.type || 'formato desconocido'}</Chip>
                        }
                    </div>
                </div>
                <input id="dropzone-file" type="file" accept=".json,application/json" onChange={handleFileChange} className="hidden" />
            </label>
            <Button className="bg-utim" fullWidth onPress={handleExport} isLoading={loading}>
                Importar programas educativos
            </Button>
            <Table key={'table'} aria-label="tabla de importaciones">
                <TableHeader>
                    <TableColumn>
                        Programa educativo
                    </TableColumn>
                    <TableColumn>
                        Abreviación
                    </TableColumn>
                </TableHeader>
                <TableBody key={'ld'} items={educationalPrograms} emptyContent={'Nada exportado aún'}>
                    {
                        (educationalProgram) => (
                            <TableRow key={educationalProgram.abbreviation}>
                                <TableCell>
                                    {educationalProgram.description}
                                </TableCell>
                                <TableCell>
                                    {educationalProgram.abbreviation}
                                </TableCell>
                            </TableRow>
                        )
                    }
                </TableBody>
            </Table>
        </div>
    )
}