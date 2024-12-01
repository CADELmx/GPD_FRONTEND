import { Button, Chip, Selection, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@nextui-org/react"
import { UploadIcon } from "../Icons"
import { ChangeEvent, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { UseSecretary } from "@/context";
import { getFirstSetValue, InitSelectedKeys } from "@/utils";
import { playNotifySound } from "@/toast";
import { ParseErrorLink } from "../ParseError";
import { createManyAreas } from "@/models/transactions/area";
import { CreateArea } from "@/models/types/area";
import { tableClassNames } from "../educationalProgram/EducationalProgramCard";

export interface parseResult<T = any> {
    status: 'success' | 'error';
    message: string;
    data: T[]
}


const ParseNewEducationalPrograms = (data: string): parseResult<CreateArea> => {
    try {
        const keys = Object.keys(JSON.parse(data)[0]);
        if (keys.some(key => !['name'].includes(key))) {
            return {
                status: 'error',
                message: 'Formato incorrecto',
                data: []
            };
        }
        const newAreas: CreateArea[] = JSON
            .parse(data)
            .sort((a: CreateArea, b: CreateArea) => a.name.localeCompare(b.name))
            .map((e: CreateArea, _: number) => ({
                ...e,
            }));
        return {
            status: 'success',
            message: 'Areas listas para ser registrados',
            data: newAreas
        };
    } catch (error) {
        return {
            status: 'error',
            message: 'Error al importar, json inválido',
            data: []
        }
    }
}

export const ImportEducationalProgramsMenu = () => {
    const { areaState: { areas } } = UseSecretary()
    const [file, setFile] = useState<File>(new File([], ''));
    const [areasToImport, setAreasToImport] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedAreas, setSelectedAreas] = useState(InitSelectedKeys);
    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFile(e.target.files[0])
        }
    }
    const handleAreaSelection = (e: Selection) => {
        if (e === 'all') return setSelectedAreas(new Set(areasToImport.map((e) => `${e.index}`)))
        setSelectedAreas(e)
    }
    const handleExport = async () => {
        if (file.name !== '') {
            setLoading(true)
            const formData = new FormData();
            formData.append('file', file);
            toast.promise(axios.post('/api/import/upload', formData), {
                loading: 'Subiendo archivo...',
                success: ({ status }) => {
                    if (status === 200) {
                        toast.promise(axios.get(`/api/import/${file.name}`), {
                            loading: 'Cargando areas...',
                            success: ({ status, data }) => {
                                if (status === 200) {
                                    const { data: newAreas, message, status } = ParseNewEducationalPrograms(data);
                                    setLoading(false);
                                    if (status === 'success') {
                                        setAreasToImport(newAreas);
                                        return message
                                    }
                                    return (
                                        <ParseErrorLink
                                            passHref
                                            legacyBehavior
                                            href={'/about'}
                                        >
                                            {message}
                                        </ParseErrorLink>
                                    )
                                }
                                setLoading(false)
                                return 'Error al subir el archivo';
                            },
                            error: () => {
                                setLoading(false)
                                return 'Error al importar los areas, intenta de nuevo'
                            }
                        }, {
                            id: 'import-educational-programs'
                        })
                        return 'Archivo subido con éxito'
                    }
                    return 'Error al subir el archivo'
                },
                error: () => {
                    setLoading(false)
                    return 'Error al subir el archivo, intenta de nuevo'
                }
            }, {
                id: 'import-educational-programs'
            })

        }
    }
    const handleSubmit = async () => {
        if (selectedAreas.size > 0) {
            try {
                setLoading(true)
                const newAreas: CreateArea[] = Array.from(selectedAreas).map((index) => {
                    const { name }: {
                        name: string
                    } = areasToImport[Number(index)]
                    return ({
                        name
                    })
                })
                toast.promise(createManyAreas({
                    data: newAreas
                }), {
                    loading: 'Registrando areas...',
                    success: ({ data: { data, error, message } }) => {
                        setLoading(false)
                        if (error) return message
                        playNotifySound()
                        setAreasToImport(areasToImport.filter(e => {
                            return !selectedAreas.has(`${e.index}`)
                        }))
                        setSelectedAreas(new Set([]))
                        playNotifySound()
                        return `${data.count} areas registrados`
                    },
                    error: () => {
                        setLoading(false)
                        return 'Error al registrar las areas'
                    }
                })
            } catch (error: any) {
                setLoading(false)
                toast.error('Error al registrar las areas')
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
                        <Chip isDisabled={!file?.name} variant="bordered">
                            {file?.name || 'Nada seleccionado'}
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
                Importar áreas
            </Button>
            <Button
                fullWidth
                className="bg-utim"
                isDisabled={
                    selectedAreas.size === 0 || areasToImport.length === 0
                }
                onPress={handleSubmit}
                isLoading={loading && !file}
            >
                Registrar áreas
            </Button>
            <Table
                selectedKeys={selectedAreas as Selection}
                onSelectionChange={handleAreaSelection}
                isCompact
                isHeaderSticky
                selectionMode="multiple"
                classNames={{
                    ...tableClassNames,
                    base: 'max-h-[34rem] overflow-auto'
                }}
                key={'table'}
                aria-label="tabla de importaciones"
            >
                <TableHeader>
                    <TableColumn>
                        Nombre
                    </TableColumn>
                </TableHeader>
                <TableBody
                    key={'educational-table-body'}
                    items={areasToImport}
                    emptyContent={'Nada exportado aún'}
                >
                    {
                        (educationalProgram) => (
                            <TableRow key={educationalProgram.index}>
                                <TableCell>
                                    {educationalProgram.name}
                                </TableCell>
                            </TableRow>
                        )
                    }
                </TableBody>
            </Table>
        </div>
    )
}