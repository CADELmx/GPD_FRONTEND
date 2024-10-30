import { getAreas } from "@/models/transactions"
import { Button, Card, CardBody, CardHeader, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from "@nextui-org/react"
import { useState } from "react"

export const getServerSideProps = async () => {
    const { data: { data, error } } = await getAreas()
    console.log(data)
    return {
        props: {
            areas: data,
            error
        }
    }
}

export const AreaCard = ({ area }) => {
    return (
        <Card>
            <CardHeader>
                <h2>{area.name}</h2>
            </CardHeader>
            <CardBody>
                <p>{area.description}</p>
            </CardBody>
        </Card>
    )
}

export const AreaCards = ({ areas }) => {
    if (areas.length === 0) return (
        <div>
            <h1>No hay áreas registradas</h1>
        </div>
    )
    return (
        <div>
            {areas.map((area) => (
                <AreaCard area={area} key={area.id} />
            ))}
        </div>
    )
}

export const AreaModal = ({ setState, isOpen, onOpen, onOpenChange }) => {
    const handleChange = (e) => {
        setState((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value
        }))
    }
    return (
        <>
            <Modal backdrop="blur" isOpen={isOpen} placement="center" isDismissable onOpenChange={onOpenChange}>
                <ModalContent>
                    {
                        (onClose) => (
                            <>
                                <ModalHeader></ModalHeader>
                                <ModalBody>
                                    <Input onChange={handleChange} label='Nombre del área'></Input>
                                </ModalBody>
                                <ModalFooter>
                                    <Button color="danger">Cancelar</Button>
                                    <Button color="success">Guardar</Button>
                                </ModalFooter>
                            </>
                        )
                    }
                </ModalContent>
            </Modal>
        </>
    )
}

export default function Areas({ areas: ssrAreas, error }) {
    const { isOpen, onOpen, onOpenChange } = useDisclosure()
    const [areas, setAreas] = useState(ssrAreas)
    const [selectedArea, setSelectedArea] = useState(null)
    return (
        <div className="flex flex-col gap-2 items-center justify-center">
            <h1 className="font-bold text-utim">Áreas</h1>
            <Button onPress={onOpen}>Nueva área</Button>
            <AreaCards areas={areas} />
            <AreaModal
                isOpen={isOpen}
                onOpen={onOpen}
                onOpenChange={onOpenChange}
                area={selectedArea}
                setState={setSelectedArea}
            />
        </div>
    )
}