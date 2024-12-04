
import { statusTypes } from "@/components/ChangeStatus";
import { PlusIcon } from "@/components/Icons";
import { ModalError } from "@/components/ModalError";
import { YearSelectorAlter } from "@/components/Selector";
import { UseSecretary } from "@/context";
import { getAreas, getAreasByWorkers } from "@/models/transactions/area";
import { getUserData } from "@/models/transactions/auth";
import { getInsesnsitivePersonalData } from "@/models/transactions/personal-data";
import { insertTemplate } from "@/models/transactions/templates";
import { Area } from "@/models/types/area";
import { PersonalData } from "@/models/types/personal-data";
import { CreateTemplate, Template } from "@/models/types/template";
import { playNotifySound } from "@/toast";
import { getFirstSetValue, InitSelectedKeys, periods } from "@/utils";
import { Button, Chip, Select, Selection, SelectItem } from "@nextui-org/react";
import Router from "next/router";
import { Key, useEffect, useState } from "react";
import toast from "react-hot-toast";


export const getStaticProps = async () => {
    const { data: { data: areas, error } } = await getAreasByWorkers({ director: false })
    return {
        props: {
            error,
            areas
        }
    }
}

export default function DirectorIndex({ areas: ssrAreas, template: ssrTemplate, error }: { areas: Area[], template: Template, error: string | null }) {
    const { areaState: { areas }, setStoredAreas } = UseSecretary()
    const currentYear = String(new Date().getFullYear())
    const currentMonth = new Date().toLocaleString('es-MX', { month: 'long' })
    const currentPeriod = periods.find(p => p.months.includes(currentMonth))
    const defaultPeriodKey = `${currentPeriod?.period} ${currentYear}: Ordinario`
    const [template, setTemplate] = useState<CreateTemplate>({
        areaId: undefined,
        period: defaultPeriodKey,
        state: 'pendiente',
        responsibleId: undefined,
        revisedById: undefined,
    })
    const [responsibleName, setResponsibleName] = useState('');
    const [revisedOptions, setRevisedOptions] = useState<PersonalData[]>([]);
    const [selectedKeys, setSelectedKeys] = useState(InitSelectedKeys);
    const [selectedAreaKeys, setSelectedAreaKeys] = useState(InitSelectedKeys);
    const handleSelectRevisedBy = (e: Selection) => {
        if (e === "all") return
        setTemplate({ ...template, revisedById: Number(getFirstSetValue(e)) })
        setSelectedKeys(e)
    }
    const handleSelectArea = (e: Selection) => {
        if (e === "all") return
        setTemplate({ ...template, areaId: Number(getFirstSetValue(e)) })
        setSelectedAreaKeys(e)
    }
    const handleSelectPeriod = (e: Set<Key>) => {
        setTemplate({
            ...template,
            period: String(getFirstSetValue(e))
        })
    }
    const handleSelectYear = (e: Set<Key>) => {
        setTemplate({
            ...template,
            period: ''
        })
    }
    const handleSubmit = () => {
        toast.promise(insertTemplate({ data: template }), {
            loading: 'Registrando plantilla',
            success: ({ data: { data, error, message } }) => {
                if (error) return message
                playNotifySound()
                Router.push(`/director/partialtemplate/create/${data.id}`)
                return message + ' Redirigiendo...'
            },
            error: 'Error al crear la plantilla'
        })
    }
    const [templateStatus, setTemplateStatus] = useState(statusTypes.find(s => s.name === template?.state) || statusTypes[0])
    const disabledSubmit = template.areaId === undefined || template.responsibleId === undefined || template.revisedById === undefined || template.period === ""
    useEffect(() => {
        const getUser = () => {
            toast.promise(getUserData(), {
                loading: 'Cargando datos del usuario',
                success: ({ data: { data, error, message } }) => {
                    if (error) return message
                    setTemplate({ ...template, responsibleId: data.nt })
                    setResponsibleName(data.personalData.name)
                    return 'Datos de usuario cargados'
                },
                error: 'Error al cargar los datos del usuario'
            }, {
                id: 'search-user'
            })
            toast.promise(getInsesnsitivePersonalData({ area: 'Secretaría académica', position: 'Secretaria' }), {
                loading: 'Cargando datos de secretaría académica',
                success: ({ data: { data, error, message } }) => {
                    if (error) return message
                    setRevisedOptions(data)
                    return 'Datos de secretaría académica cargados'
                },
                error: 'Error al cargar los datos de secretaría académica'
            }, {
                id: 'search-secretary'
            })
        }
        getUser()
        setStoredAreas({ areas: ssrAreas })
        if (ssrTemplate?.id) {
            setTemplate(ssrTemplate)
            setTemplateStatus(statusTypes.find(s => s.name === ssrTemplate.state) || statusTypes[0])
        }
    }, [])
    return (
        <>
            <h1 className="text-1xl font-bold text-center text-utim tracking-widest capitalize p-2 m-2">Crear nueva plantilla</h1>
            <YearSelectorAlter
                defaultYear={currentYear}
                defaultPeriod={defaultPeriodKey}
                onSelectPeriod={handleSelectPeriod}
                onSelectYear={handleSelectYear}
            />
            <ModalError error={error} />
            <Select
                isRequired
                items={areas}
                title="Area"
                placeholder="Area a la que pertenece la plantilla"
                label='Area'
                disallowEmptySelection
                selectedKeys={selectedAreaKeys as Selection}
                onSelectionChange={handleSelectArea}
            >
                {
                    (area) => (
                        <SelectItem key={area.id} variant="flat">{area.name}</SelectItem>
                    )
                }
            </Select>
            <div className="flex gap-2 text-utim text-sm items-center font-bold">
                Estado :
                <Chip
                    variant="faded"
                    isDisabled={template.id !== undefined}
                    color={templateStatus.color}
                >
                    {templateStatus.name}
                </Chip>
            </div>
            <div className="flex gap-2 text-utim text-sm items-center font-bold">
                Responsable :
                <Chip variant="faded">
                    {
                        responsibleName
                    }
                </Chip>
            </div>
            <Select
                selectedKeys={selectedKeys as Selection}
                onSelectionChange={handleSelectRevisedBy}
                items={revisedOptions}
                title="Revisado por"
                label="Revisión por"
                placeholder="¿Quien es la persona que revisa la plantilla?"
                disallowEmptySelection
            >
                {
                    (person: PersonalData) => (
                        <SelectItem key={person.ide} variant="flat">{person.name}</SelectItem>
                    )
                }
            </Select>
            <Button
                startContent={
                    PlusIcon
                }
                isDisabled={disabledSubmit}
                className="bg-utim"
                onPress={handleSubmit}
            >
                Crear plantilla
            </Button>
        </>
    )
}
