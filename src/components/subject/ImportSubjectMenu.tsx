import { UseSecretary } from "@/context";
import { UploadIcon } from "../Icons"
import { ChangeEvent, useEffect, useState } from "react";
import { Button, Chip, Select, Selection, SelectItem, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@nextui-org/react";
import { tableClassNames } from "../educationalProgram/EducationalProgramCard";
import { playNotifySound } from "@/toast";
import toast from "react-hot-toast";
import axios from "axios";
import { CreateSubject } from "@/models/types/subject";
import { createManySubjects } from "@/models/transactions/subject";
import { getFirstSetValue, InitSelectedKeys } from "@/utils";
import { getEducationalProgramsByArea } from "@/models/transactions/educational-program";
import { EducationalProgram } from "@/models/types/educational-program";
import { parseResult } from "../educationalProgram/ImportMenu";
import { ParseErrorLink } from "../ParseError";

const ParseNewSubjects = (data: string): parseResult<CreateSubject> => {
    try {
        const keys = Object.keys(JSON.parse(data)[0]).map(e => e.toLowerCase())
        if (!keys.some(e => e === 'subjectname' && 'totalhours' && 'weeklyhours' && 'monthperiod')) {
            return {
                status: 'error',
                data: [],
                message: 'Formato incorrecto'
            }
        }
        const newSubjects: CreateSubject[] = JSON
            .parse(data)
            .map((subject: CreateSubject, index: number) => {
                return {
                    ...subject,
                    index
                }
            })
        return {
            status: 'success',
            data: newSubjects,
            message: 'Materias listas para registrar'
        }
    } catch (error) {
        return {
            status: 'error',
            data: [],
            message: 'Error al parsear los datos'
        }
    }
}

export const ImportSubjectsMenu = () => {
    const { areaState: { areas } } = UseSecretary()
    const [file, setFile] = useState<File>(new File([], ''));
    const [educationalPrograms, setEducationalPrograms] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [subjects, setSubjects] = useState<any[]>([]);
    const [selectedAreaKeys, setSelectedAreaKeys] = useState(InitSelectedKeys);
    const [selectedEducationalKeys, setSelectedEducationalKeys] = useState(InitSelectedKeys);
    const [selectedSubjectKeys, setSelectedSubjectKeys] = useState(InitSelectedKeys);
    const onSelectedAreaChange = (e: Selection) => {
        if (e === "all") return
        setSelectedAreaKeys(e)
    }
    const onSelectionEducationProgramChange = (e: Selection) => {
        if (e === "all") return
        setSelectedEducationalKeys(e)
    }
    const onSelectionSubjectChange = (e: Selection) => {
        if (e === "all") return setSelectedSubjectKeys(new Set(subjects.map((e) => {
            return `${e.index}`
        })))
        setSelectedSubjectKeys(e)
    }
    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFile(e.target.files[0])
        }
    }
    const handleExport = async () => {
        if (file.name !== '') {
            setLoading(true)
            const formData = new FormData();
            formData.append('file', file);
            toast.promise(axios.post('/api/import/upload', formData), {
                loading: 'Importando materias...',
                success: ({ status }) => {
                    if (status === 200) {
                        toast.promise(axios.get(`/api/import/${file.name}`), {
                            loading: 'Cargando materias...',
                            success: ({ data, status }) => {
                                if (status === 200) {
                                    const { data: newSubjects, message, status } = ParseNewSubjects(data)
                                    setLoading(false)
                                    if (status === 'error') {
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
                                    setSubjects(newSubjects)
                                    return message
                                } else {
                                    setLoading(false)
                                    return 'Error al importar las materias'
                                }
                            },
                            error: () => {
                                setLoading(false)
                                return 'Error al importar las materias, intenta de nuevo'
                            }
                        }, {
                            id: 'import-subjects'
                        })
                        return 'Archivo subido correctamente'
                    }
                    return 'Error al subir el archivo'
                },
                error: () => {
                    setLoading(false)
                    return 'Error al subir el archivo, intente de nuevo'
                }
            }, {
                id: 'import-subjects'
            })
        }
    }
    const handleSubmit = async () => {
        if (selectedSubjectKeys.size > 0) {
            try {
                setLoading(true)
                const newSubjects: CreateSubject[] = Array.from(selectedSubjectKeys).map((index) => {
                    const { totalHours, weeklyHours, monthPeriod, subjectName }: {
                        totalHours: number,
                        weeklyHours: number,
                        monthPeriod: string,
                        subjectName: string
                    } = subjects[Number(index)]
                    return ({
                        totalHours,
                        weeklyHours,
                        monthPeriod,
                        subjectName
                    })
                })
                toast.promise(createManySubjects({
                    educationalProgramId: Number(getFirstSetValue(selectedEducationalKeys)),
                    data: newSubjects
                }), {
                    loading: 'Registrando materias...',
                    success: ({ data: { data, error, message } }) => {
                        setLoading(false)
                        if (error) return message
                        playNotifySound()
                        setSubjects(subjects.filter(e => {
                            return !selectedSubjectKeys.has(`${e.index}`)
                        }))
                        setSelectedSubjectKeys(new Set([]))
                        setSelectedAreaKeys(new Set([]))
                        playNotifySound()
                        const plural = data.count > 1 ? 's' : ''
                        return `${data.count} materia${plural} registrada${plural}`
                    },
                    error: () => {
                        setLoading(false)
                        return 'Error al registrar los materias'
                    }
                })

            } catch (error: any) {
                setLoading(false)
                toast.error('Error al registrar los materias')
            }
        }
    }
    useEffect(() => {
        if (selectedAreaKeys.size > 0) {
            toast.promise(getEducationalProgramsByArea({
                id: Number(getFirstSetValue(selectedAreaKeys))
            }), {
                loading: 'Cargando materias',
                success: ({ data: { data, error, message } }) => {
                    if (error) return message
                    setSelectedEducationalKeys(new Set([]))
                    setEducationalPrograms(data)
                    return message
                },
                error: 'Error al cargar materias, intenta de nuevo'
            })
        }
        return () => {
            setEducationalPrograms([])
        }
    }, [selectedAreaKeys]);
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
                isLoading={loading && file?.name !== ''}
            >
                Importar materias
            </Button>
            <Select
                isDisabled={subjects.length === 0}
                items={areas}
                label='Areas'
                placeholder="Selecciona un area"
                onSelectionChange={onSelectedAreaChange}
                selectedKeys={selectedAreaKeys as Selection}
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

            <Select
                selectedKeys={selectedEducationalKeys as Selection}
                onSelectionChange={onSelectionEducationProgramChange}
                key={'table'}
                label="materias"
                placeholder="Selecciona un programa educativo"
                aria-label="Selector de materias"
                items={educationalPrograms}
                isDisabled={educationalPrograms.length === 0}
                disallowEmptySelection
            >
                {
                    (educationalProgram: EducationalProgram) => (
                        <SelectItem key={educationalProgram.id}>
                            {educationalProgram.description}
                        </SelectItem>
                    )
                }
            </Select>
            <Button
                fullWidth
                className="bg-utim"
                isDisabled={selectedEducationalKeys.size === 0}
                onPress={handleSubmit}
                isLoading={loading && !file}
            >
                Registrar en el programa educativo seleccionado
            </Button>
            <Table
                selectedKeys={selectedSubjectKeys as Selection}
                onSelectionChange={onSelectionSubjectChange}
                isCompact
                isHeaderSticky
                selectionMode="multiple"
                classNames={{
                    ...tableClassNames,
                    base: 'max-h-[34rem] overflow-auto'
                }}
                aria-label="tabla de importaciones"
            >
                <TableHeader>
                    <TableColumn>
                        Numbre
                    </TableColumn>
                    <TableColumn>
                        Horas semanales
                    </TableColumn>
                    <TableColumn>
                        Horas totales
                    </TableColumn>
                    <TableColumn>
                        Cuatrimestre
                    </TableColumn>
                </TableHeader>
                <TableBody
                    items={subjects}
                    emptyContent={'Sin materia para importar'}
                >
                    {
                        (subject) => (
                            <TableRow key={subject.index}>
                                <TableCell>
                                    {subject.subjectName}
                                </TableCell>
                                <TableCell>
                                    {subject.weeklyHours}
                                </TableCell>
                                <TableCell>
                                    {subject.totalHours}
                                </TableCell>
                                <TableCell>
                                    {subject.monthPeriod}
                                </TableCell>
                            </TableRow>
                        )
                    }
                </TableBody>
            </Table>
        </div>
    )
}