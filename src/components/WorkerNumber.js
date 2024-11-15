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
        const personaDataPromise = getPersonalData(Number(newValue))
        const data = await getPersonalData(Number(newValue))
        console.log(data)
        toast.promise(personaDataPromise, {
            loading: 'Buscando número de trabajador',
            success: ({ data: { data, error, message } }) => {
                console.log(data, request)
                if (error) {
                    return message
                }
                if (data) {
                    setIdError(false)
                    setStored({ partialTemplate: { ...partialTemplate, nt: data.ide, puesto: data.puesto, nombre: data.nombre } })
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
                                        <SelectItem key={w.ide} variant="flat" endContent={<p className="text-utim">{w.ide}</p>}>{w.name}</SelectItem>
                                    )
                                }
                            </SelectSection>
                            <SelectSection
                                items={academicWorkers.filter(w => w.area === 'P.E. de Lengua Inglesa')}
                                title="Lengua Inglesa"
                            >
                                {
                                    w => (
                                        <SelectItem key={w.ide} variant="flat" endContent={<p className="text-utim">{w.ide}</p>}>{w.name}</SelectItem>
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