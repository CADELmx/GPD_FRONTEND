import { Chip, Input, Select, SelectItem, SelectSection, Switch } from "@nextui-org/react"
import { useState } from "react"
import toast from "react-hot-toast"
import { BarsArrowDown, LockIcon, PencilIcon, UnlockIcon } from "./Icons"
import { UseTemplates } from "../context"
import { getPersonalData } from "../models/transactions/personal-data"
import { playLevelUpSound } from "../toast"
import { PersonalData } from "../models/types/personal-data"


export const NtInput = ({ academicWorkers }: { academicWorkers: PersonalData[] }) => {
    const { memory: { partialTemplate }, setStored } = UseTemplates()
    const [idError, setIdError] = useState(false)
    const [locked, setLocked] = useState(false)
    const [selectorActive, setSelectorActive] = useState(false)
    const handleChangeFromBackend = async (newValue: string) => {
        if (newValue === '' || !newValue) return
        toast.promise(getPersonalData({ id: Number(newValue) }), {
            loading: 'Buscando número de trabajador',
            success: ({ data: { data, error, message } }) => {
                if (error) return message
                if (data) {
                    playLevelUpSound()
                    setIdError(false)
                    setStored({ partialTemplate: { ...partialTemplate, nt: data.ide, position: data.position, name: data.name } })
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
                                title="Tecnologías de la Información"
                            >
                                {
                                    academicWorkers.filter(w => w.area === 'P.E. de Tecnologías de la Información').map((personalData): JSX.Element => {
                                        return (
                                            <SelectItem
                                                key={personalData.ide}
                                                variant="flat"
                                                endContent={<p className="text-utim">{personalData.ide}</p>}
                                            >
                                                {personalData.name}
                                            </SelectItem>
                                        )
                                    })
                                }
                            </SelectSection>
                            <SelectSection
                                title="Lengua Inglesa"
                            >
                                {
                                    academicWorkers.filter(w => w.area === 'P.E. de Lengua Inglesa').map((personalData) => (
                                        <SelectItem
                                            key={personalData.ide}
                                            variant="flat"
                                            endContent={<p className="text-utim">{personalData.ide}</p>}
                                        >
                                            {personalData.name}
                                        </SelectItem>
                                    ))
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