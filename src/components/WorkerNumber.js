import { UseTemplates } from "@/context"
import { getPersonalData } from "@/models/transactions"
import { Chip, Input, Select, SelectItem, SelectSection, Switch } from "@nextui-org/react"
import { useState } from "react"
import toast from "react-hot-toast"
import { BarsArrowDown, LockIcon, PencilIcon, UnlockIcon } from "./Icons"

export const NtInput = ({ academicWorkers }) => {
    const { memory: { partialTemplate }, setStored } = UseTemplates()
    const [idError, setIdError] = useState(false)
    const [locked, setLocked] = useState(false)
    const [selectorActive, setSelectorActive] = useState(false)
    const handleChangeFromBackend = async (newValue) => {
        if (newValue === '' || !newValue) return
        const personaDataPromise = getPersonalData(newValue)
        toast.promise(personaDataPromise, {
            loading: 'Buscando número de trabajador',
            success: ({ data, request, error }) => {
                console.log(data, request)
                if (error) {
                    return 'Error al buscar el número de trabajador'
                }
                if (data.length > 0) {
                    setIdError(false)
                    setStored({ partialTemplate: { ...partialTemplate, nt: data[0].ide, puesto: data[0].puesto, nombre: data[0].nombre } })
                    setLocked(true)
                    return 'Número de trabajador encontrado'
                } else {
                    setIdError(true)
                    return 'No se encontró el número de trabajador'
                }
            },
            error: 'Error, intente de nuevo más tarde'
        }, {
            id: 'ide-error'
        })
    }
    return (
        <div className="grid gap-2">
            <Switch
                color="success"
                isSelected={selectorActive}
                onValueChange={setSelectorActive}
                endContent={PencilIcon}
                startContent={BarsArrowDown}
            >
                Tipo de selección - <Chip variant="faded" size="sm" color="success">{selectorActive ? 'Selector' : 'Buscador'}</Chip>
            </Switch>
            <div className="flex gap-2">
                {
                    selectorActive && (
                        <Select
                            isDisabled={locked}
                            name="worker"
                            label='Escoger trabajador'
                            onChange={(e) => handleChangeFromBackend(e.target.value)}
                        >
                            <SelectSection
                                items={academicWorkers.filter(w => w.area === 'P.E. de Tecnologías de la Información')}
                                title="Tecnologías de la Información"
                            >
                                {
                                    w => (
                                        <SelectItem key={w.ide} variant="flat" endContent={<p className="text-utim">{w.ide}</p>}>{w.nombre}</SelectItem>
                                    )
                                }
                            </SelectSection>
                            <SelectSection
                                items={academicWorkers.filter(w => w.area === 'P.E. de Lengua Inglesa')}
                                title="Lengua Inglesa"
                            >
                                {
                                    w => (
                                        <SelectItem key={w.ide} variant="flat" endContent={<p className="text-utim">{w.ide}</p>}>{w.nombre}</SelectItem>
                                    )
                                }
                            </SelectSection>
                        </Select>
                    ) || (
                        <Input
                            label="N.T."
                            type="number"
                            min={1}
                            name="nt"
                            onValueChange={handleChangeFromBackend}
                            color={idError ? "warning" : "default"}
                            isDisabled={locked} />
                    )
                }
                <Switch
                    isSelected={locked}
                    onValueChange={setLocked}
                    thumbIcon={
                        locked ? LockIcon : UnlockIcon
                    }
                ></Switch>
            </div>
        </div>
    )
}