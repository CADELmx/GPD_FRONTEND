
import { statusTypes } from "@/components/ChangeStatus";
import { PlusIcon } from "@/components/Icons";
import { ModalError } from "@/components/ModalError";
import { YearSelectorAlter } from "@/components/Selector";
import { UseSecretary } from "@/context";
import { getAreas } from "@/models/transactions/area";
import { getUserData } from "@/models/transactions/auth";
import { getInsesnsitivePersonalData } from "@/models/transactions/personal-data";
import { insertTemplate } from "@/models/transactions/templates";
import { Area } from "@/models/types/area";
import { PersonalData } from "@/models/types/personal-data";
import { CreateTemplate, Template } from "@/models/types/template";
import { getFirstSetValue } from "@/utils";
import { Button, Chip, Select, Selection, SelectItem } from "@nextui-org/react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";


export const getServerSideProps = async () => {
    const { data: { data: areas, error } } = await getAreas()
    return {
        props: {
            error,
            areas
        }
    }
}

export default function DirectorIndex({ areas: ssrAreas, template: ssrTemplate, error }: { areas: Area[], template: Template, error: string | null }) {
    const { areaState: { areas }, setStoredAreas } = UseSecretary()
    const [template, setTemplate] = useState<CreateTemplate>({
        areaId: undefined,
        period: new Date().getFullYear().toString(),
        state: 'Pendiente',
        responsibleId: undefined,
        revisedById: undefined,
    })
    const [responsibleName, setResponsibleName] = useState('');
    const [revisedOptions, setRevisedOptions] = useState<PersonalData[]>([]);
    const [selectedKeys, setSelectedKeys] = useState(new Set<any>([]));
    const [selectedAreaKeys, setSelectedAreaKeys] = useState(new Set<any>([]));
    const handleSelectRevisedBy = (e: Selection) => {
        if (e === "all") return
        setTemplate({ ...template, revisedById: Number(getFirstSetValue(e)) })
        setSelectedKeys(e)
        console.log(template)
    }
    const handleSelectArea = (e: Selection) => {
        if (e === "all") return
        setTemplate({ ...template, areaId: Number(getFirstSetValue(e)) })
        setSelectedAreaKeys(e)
        console.log(template)
    }
    const handleSubmit = () => {
        toast.promise(insertTemplate({ data: template }), {
            loading: 'Registrando plantilla',
            success: ({ data: { data, error, message } }) => {
                if (error) return message
                return message
            },
            error: 'Error al crear la plantilla'
        })
    }
    const [templateStatus, setTemplateStatus] = useState(statusTypes.find(s => s.name === template?.state) || statusTypes[0])
    const disabledSubmit = template.areaId === undefined || template.responsibleId === undefined || template.revisedById === undefined
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
        if (areas.length === 0) {
            setStoredAreas({ areas: ssrAreas })
        }
        if (ssrTemplate?.id) {
            setTemplate(ssrTemplate)
            setTemplateStatus(statusTypes.find(s => s.name === ssrTemplate.state) || statusTypes[0])
        }
    }, [])
    return (
        <>
            <h1 className="text-1xl font-bold text-center text-utim tracking-widest capitalize p-2 m-2">Crear nueva plantilla</h1>
            <YearSelectorAlter />
            <ModalError error={error} />
            <Select
                isRequired
                items={areas}
                title="Area"
                placeholder="Area a la que pertenece la plantilla"
                label='Area'
                disallowEmptySelection
                selectedKeys={selectedAreaKeys}
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
                selectedKeys={selectedKeys}
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

export const PeriodSelector = () => {
    return(
        <></>
    )
}