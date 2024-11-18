
import { Button, Chip, Select, SelectItem } from "@nextui-org/react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { getAreas } from "../../models/transactions/area";
import { insertTemplate } from "../../models/transactions/templates";
import { Template } from "../../models/types/template";
import { statusTypes } from "../../components/ChangeStatus";
import { YearSelectorAlter } from "../../components/Selector";
import { ModalError } from "../../components/ModalError";
import { Area } from "../../models/types/area";
import { PlusIcon } from "../../components/Icons";

export const getServerSideProps = async () => {
    const { data: { data: areas, error } } = await getAreas()
    return {
        props: {
            error,
            areas
        }
    }
}

export default function DirectorIndex({ areas, template: ssrTemplate, error }: { areas: Area[], template: Template, error: string | null }) {
    const [template, setTemplate] = useState<Template>({
        areaId: null,
        period: new Date().getFullYear().toString(),
        state: 'Pendiente',
        responsibleId: null,
        revisedById: null,
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
                onSelectionChange={(area: any) => {
                    setTemplate({ ...template, areaId: Number(area.anchorKey) })
                    console.log(template)
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
                startContent={PlusIcon}
                isDisabled={template.areaId === undefined}
                className="bg-utim"
                onPress={handleSubmit}
            >
                Crear plantilla
            </Button>
        </>
    )
}