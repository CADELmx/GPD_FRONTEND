import { Button, Chip, Select, SelectItem, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@nextui-org/react"
import { UploadIcon } from "../Icons"
import { ChangeEvent, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { UseSecretary } from "@/context";
import { CreateEducationalProgram } from "@/models/types/educational-program";
import { createManyEducationalPrograms } from "@/models/transactions/educational-program";
import { getFirstSetValue } from "@/utils";
import { playNotifySound } from "@/toast";
import { tableClassNames } from "./EducationalProgramCard";


export const ImportEducationalProgramsMenu = () => {
    const { areaState: { areas } } = UseSecretary()
    const [file, setFile] = useState<File>(new File([], ''));
    const [educationalPrograms, setEducationalPrograms] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedEductationalPrograms, setSelectedEducationalPrograms] = useState<any>(new Set<any>([]));
    const [selectedArea, setSelectedArea] = useState<any>(new Set<any>([]));
    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFile(e.target.files[0])
        }
    }
    const handleExport = async () => {
        if (file.name) {
            setLoading(true)
            const formData = new FormData();
            formData.append('file', file);
            toast.promise(axios.post('/api/import/educationalprogram', formData), {
                loading: 'Importando programas educativos...',
                success: ({ status }) => {
                    if (status === 200) {
                        return 'Procesando programas educativos...'
                    }
                    return 'Error al procesar los programas educativos'
                },
                error: () => {
                    setLoading(false)
                    return 'Error al importar los programas educativos'
                }
            }, {
                id: 'import-educational-programs'
            })
            toast.promise(axios.get(`/api/import/${file.name}`), {
                loading: 'Cargando programas educativos...',
                success: ({ data, status }) => {
                    if (status === 200) {
                        const newEducationalPrograms = JSON.parse(data)
                            .sort((a: CreateEducationalProgram, b: CreateEducationalProgram) => a.abbreviation.localeCompare(b.abbreviation))
                            .map((e: CreateEducationalProgram, i: number) => ({
                                ...e,
                                index: i
                            }))
                        setEducationalPrograms(newEducationalPrograms)
                        setLoading(false)
                        return 'Programas educativos listos para registrar'
                    } else {
                        setLoading(false)
                        return 'Error al importar los programas educativos'
                    }
                },
                error: () => {
                    setLoading(false)
                    return 'Error al importar los programas educativos, intenta de nuevo'
                }
            }, {
                id: 'import-educational-programs'
            })
        }
    }
    const handleSubmit = async () => {
        if (selectedEductationalPrograms.size > 0) {
            try {
                setLoading(true)
                const newEducationalPrograms: CreateEducationalProgram[] = Array.from(selectedEductationalPrograms).map((index) => {
                    const { abbreviation, description }: {
                        abbreviation: string,
                        description: string
                    } = educationalPrograms[Number(index)]
                    return ({
                        abbreviation,
                        description
                    })
                })
                toast.promise(createManyEducationalPrograms({
                    areaId: getFirstSetValue(selectedArea),
                    data: newEducationalPrograms
                }), {
                    loading: 'Registrando programas educativos...',
                    success: ({ data: { data, error, message } }) => {
                        setLoading(false)
                        if (error) return message
                        setEducationalPrograms(educationalPrograms.filter(e => {
                            return !selectedEductationalPrograms.has(`${e.index}`)
                        }))
                        setSelectedEducationalPrograms(new Set([]))
                        setSelectedArea(new Set([]))
                        playNotifySound()
                        return `${data.count} programas educativos registrados`
                    },
                    error: () => {
                        setLoading(false)
                        return 'Error al registrar los programas educativos'
                    }
                })
            } catch (error: any) {
                setLoading(false)
                toast.error('Error al registrar los programas educativos')
            }
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
                        <Chip isDisabled={!file.name} variant="bordered">
                            {file.name || 'Nada seleccionado'}
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
                isLoading={loading && file.name !== ''}
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