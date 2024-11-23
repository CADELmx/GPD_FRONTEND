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
import { getFirstSetValue } from "@/utils";
import { getEducationalProgramsByArea } from "@/models/transactions/educational-program";
import { EducationalProgram } from "@/models/types/educational-program";

export const ImportSubjectsMenu = () => {
    const { areaState: { areas } } = UseSecretary()
    const [file, setFile] = useState<File>(new File([], ''));
    const [educationalPrograms, setEducationalPrograms] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [subjects, setSubjects] = useState<any[]>([]);
    const [selectedAreaKeys, setSelectedAreaKeys] = useState(new Set<any>([]));
    const [selectedEducationalKeys, setSelectedEducationalKeys] = useState(new Set<any>([]));
    const [selectedSubjectKeys, setSelectedSubjectKeys] = useState(new Set<any>([]));
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
        }))
        )
        setSelectedSubjectKeys(e)
        console.log(selectedSubjectKeys)
    }
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
                loading: 'Importando materias...',
                success: ({ status }) => {
                    if (status === 200) {
                        return 'Procesando programas educativos...'
                    }
                    return 'Error al procesar las materias'
                },
                error: () => {
                    setLoading(false)
                    return 'Error al procesar las materias, intenta de nuevo'
                }
            }, {
                id: 'import-subjects'
            })
            toast.promise(axios.get(`/api/import/${file.name}`), {
                loading: 'Cargando materias...',
                success: ({ data, status }) => {
                    if (status === 200) {
                        console.log(JSON.parse(data))
                        const newSubjects = JSON.parse(data).map((subject: CreateSubject, index: number) => {
                            return {
                                ...subject,
                                index
                            }
                        })
                        setSubjects(newSubjects)
                        setLoading(false)
                        return 'Materias listas para registrar'
                    } else {
                        setLoading(false)
                        return 'Error al importar los programas educativos'
                    }
                },
                error: () => {
                    setLoading(false)
                    return 'Error al importar las materias, intenta de nuevo'
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
                    educationalProgramId: getFirstSetValue(selectedEducationalKeys),
                    data: newSubjects
                }), {
                    loading: 'Registrando programas educativos...',
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
    useEffect(() => {
        if (selectedAreaKeys.size > 0) {
            toast.promise(getEducationalProgramsByArea({
                id: Number(getFirstSetValue(selectedAreaKeys))
            }), {
                loading: 'Cargando programas educativos',
                success: ({ data: { data, error, message } }) => {
                    if (error) return message
                    setSelectedEducationalKeys(new Set([]))
                    setEducationalPrograms(data)
                    return message
                },
                error: 'Error al cargar programas educativos, intenta de nuevo'
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
                isDisabled={subjects.length === 0}
                items={areas}
                label='Areas'
                placeholder="Selecciona un area"
                onSelectionChange={onSelectedAreaChange}
                selectedKeys={selectedAreaKeys}
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
                selectedKeys={selectedEducationalKeys}
                onSelectionChange={onSelectionEducationProgramChange}
                key={'table'}
                label="Programas educativos"
                placeholder="Selecciona un programa educativo"
                aria-label="Selector de programas educativos"
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
                selectedKeys={selectedSubjectKeys}
                onSelectionChange={onSelectionSubjectChange}
                isCompact
                selectionMode="multiple"
                classNames={tableClassNames}
                key={'table'}
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