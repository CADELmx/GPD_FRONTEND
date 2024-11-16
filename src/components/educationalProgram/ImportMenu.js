import { Button, Chip, Select, SelectItem, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@nextui-org/react"
import { UploadIcon } from "../Icons"
import { useState } from "react";
import axios from "axios";
import { UseSecretary } from "@/context";
import { createManyEducationalPrograms } from "@/models/transactions";
import toast from "react-hot-toast";
import { tableClassNames } from "./EducationalProgramCard";
import { getFirstSetValue } from "@/utils";

export const ExportEducationalProgramsMenu = () => {
    const { areaState: { areas } } = UseSecretary()
    const [file, setFile] = useState();
    const [educationalPrograms, setEducationalPrograms] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedEductationalPrograms, setSelectedEducationalPrograms] = useState(new Set([]));
    const [selectedArea, setSelectedArea] = useState(new Set([]));
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
                    .sort((a, b) => a.abbreviation.localeCompare(b.abbreviation))
                    .map((e, i) => ({
                        ...e,
                        index: i
                    }))
                setEducationalPrograms(newEducationalPrograms)
                setFile(null)
            }
            setLoading(false)
        }
    }
    const handleSubmit = async () => {
        if (selectedEductationalPrograms.size > 0) {
            setLoading(true)
            const newEducationalPrograms = Array.from(selectedEductationalPrograms).map((index) => {
                const { abbreviation, description } = educationalPrograms[index]
                return ({
                    abbreviation,
                    description
                })
            })
            toast.promise(createManyEducationalPrograms(Number(getFirstSetValue(selectedArea)), newEducationalPrograms), {
                loading: 'Registrando programas educativos...',
                success: ({ data: { data, error, message } }) => {
                    console.log(data)
                    setLoading(false)
                    if (error) return message
                    setEducationalPrograms(educationalPrograms.filter(e => {
                        return !selectedEductationalPrograms.has(`${e.index}`)
                    }))
                    setSelectedEducationalPrograms(new Set([]))
                    setSelectedArea(new Set([]))
                    return message
                },
                error: () => {
                    setLoading(false)
                    return 'Error al registrar los programas educativos'
                }
            })
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
                        <Chip isDisabled={!file} variant="bordered">
                            {file ? file?.name : 'Nada seleccionado'}
                        </Chip>
                        {
                            file &&
                            <Chip
                                isDisabled={file?.type !== 'application/json'}
                                variant="solid"
                                color={file?.type === 'application/json' ? 'success' : 'danger'}
                            >
                                {file?.type || 'formato desconocido'}
                            </Chip>
                        }
                    </div>
                </div>
                <input
                    id="dropzone-file"
                    type="file"
                    accept=".json,application/json"
                    onChange={handleFileChange}
                    className="hidden"
                />
            </label>
            <Button
                color="primary"
                fullWidth
                onPress={handleExport}
                isLoading={loading && file}
            >
                Importar programas educativos
            </Button>
            <Select
                isDisabled={educationalPrograms.length === 0}
                items={areas}
                label='Areas'
                placeholder="Selecciona un area"
                onSelectionChange={(e) => {
                    if (e === 'all') return setSelectedArea(new Set(areas.map((area) => area.id)))
                    setSelectedArea(e)
                }}
                selectedKeys={selectedArea}
                disallowEmptySelection
            >
                {
                    (area) => (
                        <SelectItem key={area.id} value={area.id}>
                            {area.name}
                        </SelectItem>
                    )
                }
            </Select>
            <Button
                fullWidth
                className="bg-utim"
                isDisabled={
                    selectedEductationalPrograms.size === 0 || educationalPrograms.length === 0 || selectedArea.size === 0
                }
                onPress={handleSubmit}
                isLoading={loading && !file}
            >
                Registrar en el área seleccionada
            </Button>
            <Table
                selectedKeys={selectedEductationalPrograms}
                onSelectionChange={setSelectedEducationalPrograms}
                isCompact
                selectionMode="multiple"
                classNames={tableClassNames}
                key={'table'}
                aria-label="tabla de importaciones"
            >
                <TableHeader>
                    <TableColumn>
                        Programa educativo
                    </TableColumn>
                    <TableColumn>
                        Abreviación
                    </TableColumn>
                </TableHeader>
                <TableBody
                    key={'ld'}
                    items={educationalPrograms}
                    emptyContent={'Nada exportado aún'}
                >
                    {
                        (educationalProgram) => (
                            <TableRow key={educationalProgram.index}>
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