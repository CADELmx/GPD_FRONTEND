
import { statusTypes } from "@/components/ChangeStatus";
import { PlusIcon } from "@/components/Icons";
import { ModalError } from "@/components/ModalError";
import { YearSelectorAlter } from "@/components/Selector";
import { UseSecretary } from "@/context";
import { getAreas } from "@/models/transactions/area";
import { insertTemplate } from "@/models/transactions/templates";
import { Area } from "@/models/types/area";
import { CreateTemplate, Template } from "@/models/types/template";
import { Button, Chip, Select, SelectItem, SharedSelection } from "@nextui-org/react";
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
    useEffect(() => {
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
                onSelectionChange={(area: SharedSelection) => {
                    setTemplate({ ...template, areaId: Number(area.anchorKey) })
                }}
            >
                {
                    (area) => (
                        <SelectItem key={area.id} variant="flat">{area.name}</SelectItem>
                    )
                }
            </Select>
            {
                template.id ?? (
                    <div className="flex gap-2 text-utim">
                        Estado :
                        <Chip
                            isDisabled={template.id !== undefined}
                            color={templateStatus.color}
                        >
                            {templateStatus.name}
                        </Chip>
                    </div>
                )
            }
            <Button
                startContent={
                    PlusIcon
                }
                isDisabled={template.areaId === undefined}
                className="bg-utim"
                onPress={handleSubmit}
            >
                Crear plantilla
            </Button>
        </>
    )
}