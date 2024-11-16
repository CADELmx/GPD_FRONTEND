import { statusTypes } from "@/components/ChangeStatus";
import { ModalError } from "@/components/ModalError";
import { YearSelectorAlter } from "@/components/Selector";
import { getAreas, insertTemplate } from "@/models/transactions";
import { Button, Chip, Select, SelectItem } from "@nextui-org/react";
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

export default function DirectorIndex({ areas, template: ssrTemplate, error }) {
    const [template, setTemplate] = useState({
        areaId: '',
        year: new Date().getFullYear(),
        period: '',
        status: 'pendiente',
        reponsibleId: '',
        revisedById: ''
    })
    const handleSubmit = () => {
        toast.promise(insertTemplate(template), {
            loading: 'Registrando plantilla',
            success: ({ data: { data, error, message } }) => {
                if (error) return message
                return message
            },
            error: 'Error al crear la plantilla'
        })
    }
    const [templateStatus, setTemplateStatus] = useState(statusTypes.find(s => s.name === template?.status) || statusTypes[0])
    useEffect(() => {
        if (ssrTemplate?.id) {
            setTemplate(ssrTemplate)
            setTemplateStatus(statusTypes.find(s => s.name === ssrTemplate.status) || statusTypes[0])
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
                onSelectionChange={(area) => {
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
                        <Chip isDisabled={!(template.id) ?? true} color={templateStatus.color}>
                            {templateStatus.name}
                        </Chip>
                    </div>
                )
            }
            <Button
                startContent={
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                }
                isDisabled={template.areaId === ''}
                className="bg-utim"
                onPress={handleSubmit}
            >
                Crear plantilla
            </Button>
        </>
    )
}