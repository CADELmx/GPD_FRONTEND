import { AreasProvider, UseAreas } from "@/context"
import { getAreas } from "@/models/transactions"
import { Button, Card, CardHeader, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Navbar, NavbarContent, NavbarItem, useDisclosure } from "@nextui-org/react"
import { useEffect, useState } from "react"

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

export const AreaCard = ({ area, onOpenModal }) => {
    const { areaState: { selectedArea }, setStoredAreas } = UseAreas()
    const handlePress = () => {
        setStoredAreas({ selectedArea: area })
        onOpenModal()
    }
    return (
        <Card>
            <CardHeader className="flex gap-1">
                <h2 className="w-full">{area.name}</h2>
                <Button onPress={handlePress} isIconOnly variant="light">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
                    </svg>
                </Button>
                <Button isIconOnly variant="light" color="danger">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                    </svg>
                </Button>
            </CardHeader>
        </Card>
    )
}

export const AreaCards = ({ areas, onOpenModal }) => {
    if (areas.length === 0) return (
        <h1>No hay áreas registradas</h1>
    )
    return (
        <div className="flex flex-col gap-2">
            {areas.map((area) => (
                <AreaCard onOpenModal={onOpenModal} area={area} key={area.id} />
            ))}
        </div>
    )
}

export const AreaModal = ({ isOpen, onOpen, onOpenChange }) => {
    const { areaState: { selectedArea }, setStoredAreas } = UseAreas()
    const handleChange = (e) => {
        setStoredAreas({ selectedArea: { name: e.target.value } })
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
                                    <Input
                                        onChange={handleChange}
                                        label='Nombre del área'
                                        defaultValue={selectedArea?.name}
                                    ></Input>
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
    const { areaState: { areas }, setStoredAreas } = UseAreas()
    const handlePress = () => {
        setStoredAreas({ selectedArea: null })
        onOpen()
    }
    useEffect(() => {
        setStoredAreas({ areas: ssrAreas })
    }, [])
    return (
        <div className="flex flex-col items-center justify-center">
            <h1 className="font-bold text-utim">Áreas</h1>
            <div className="flex flex-col gap-2 object-fill w-5/6 sm:w-2/3 pt-5 mt-5">
                <Button className="bg-utim" onPress={handlePress}>Nueva área</Button>
                <AreaCards areas={areas} onOpenModal={onOpen} />
                <AreaModal
                    isOpen={isOpen}
                    onOpen={onOpen}
                    onOpenChange={onOpenChange}
                />
            </div>
        </div>
    )
}