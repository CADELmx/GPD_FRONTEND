import { Button, Chip, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Textarea, useDisclosure } from '@nextui-org/react'
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { MessageIcon } from './Icons';
import { UseTemplates } from '../context';
import { updatePartialTemplate } from '../models/transactions/partial-template';
import { insertComment } from '../models/transactions/comment';
import { PartialTemplate } from '../models/types/partial-template';

export interface StatusType {
    name: 'pendiente' | 'aprobado' | 'corrección';
    color: 'warning' | 'success' | 'danger';
}

export const statusTypes: StatusType[] = [
    { name: 'pendiente', color: 'warning' },
    { name: 'aprobado', color: 'success' },
    { name: 'corrección', color: 'danger' }
];

export const ChangeStatus = ({ status, templateid }: {
    status: string,
    templateid: number
}) => {
    const { memory: { socket } } = UseTemplates()
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [comment, setComment] = useState('')
    const error = comment.length < 2
    const [taskStatus, setTaskStatus] = useState(statusTypes.find(s => s.name === status) || statusTypes[0])

    const handleUpdateStatus = (newStatus: StatusType) => {
        toast.promise(updatePartialTemplate({
            id: templateid, data: {
                status: newStatus.name
            }
        }), {
            loading: 'Cambiando estado...',
            success: ({ data: { data, error, message } }) => {
                if (error) return message
                setTaskStatus(newStatus)
                socket.emit('partialTemplateStatus', data)
                return `Estado cambiado a ${newStatus.name}`
            },
            error: 'Error al cambiar'
        })
    }
    const handleSubmit = (newStatus: StatusType) => {
        if (newStatus.name === 'corrección') {
            onOpen()
        } else {
            handleUpdateStatus(newStatus)
        }
    }
    const handleInsertComment = () => {
        toast.promise(insertComment({
            partialTemplateId: templateid, comment: {
                comment
            }
        }), {
            loading: 'Enviando comentario...',
            success: ({ data: { data, error, message } }) => {
                if (error) return message
                socket.emit('createdComment', data)
                return 'Comentario enviado'
            },
            error: 'Error al enviar comentario'
        })
    }
    const handleSetStatus = () => {
        toast.promise(updatePartialTemplate({
            id: templateid, data: {
                status: 'Corrección'
            }
        }), {
            loading: 'Cambiando estado...',
            success: ({ data: { data, error, message } }) => {
                if (error) return message
                socket.emit('correctionPartialTemplate', data)
                return 'Enviado a corrección'
            },
            error: 'Error al cambiar'
        })
    }

    const handleCorrection = () => {
        handleSetStatus()
        handleInsertComment()
        onClose()
    }
    useEffect(() => {
        const onUpdateStatus = (data: PartialTemplate) => {
            if (data.id === templateid) {
                setTaskStatus(statusTypes.find(s => s.name === data.status) || statusTypes[0])
                //cambiar sonido de notificacion
                toast('Estado cambiado', {
                    id: 'status-change'
                })
            }
        }
        socket.on('partialTemplateStatus', onUpdateStatus)
        return () => {
            socket.off('partialTemplateStatus')
        };
    }, []);
    return (
        <>
            <Modal
                isOpen={isOpen}
                placement='center'
                onClose={onClose}
                backdrop='blur'
            >
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader>
                                ¿Desea enviar a corrección?
                            </ModalHeader>
                            <ModalBody>
                                <Textarea
                                    minRows={1}
                                    autoFocus
                                    value={comment}
                                    onValueChange={setComment}
                                    isRequired
                                    errorMessage={error ? 'Escribe el motivo de la corrección' : false}
                                    description='Escribe el motivo de la corrección'
                                    label="Comentario"
                                    endContent={MessageIcon}
                                />
                            </ModalBody>
                            <ModalFooter>
                                <Button variant='light' onPress={onClose} color='danger'>Cancelar</Button>
                                <Button isDisabled={error} onPress={handleCorrection} className='bg-utim'>Aceptar</Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
            <Dropdown className="grid min-w-[10]">
                <DropdownTrigger>
                    <Chip
                        color={taskStatus.color}
                        className='min-w-full hover:cursor-pointer'
                        variant="dot"
                    >
                        {taskStatus.name}
                    </Chip>
                </DropdownTrigger>
                <DropdownMenu
                    aria-label={'dropdown menu for status'}
                    variant="solid"
                    className="p-0 m-0 w-full"
                    classNames={{ base: 'p-0 m-0 w-full', list: 'p-0 m-0 w-full' }}
                >
                    {
                        statusTypes.map((statusElement, i) => {
                            return (
                                <DropdownItem
                                    aria-label={`${statusElement.name} dropdown item`}
                                    key={i}
                                    textValue={statusElement.name}
                                    className="p-0 m-0"
                                >
                                    <Chip
                                        onClick={() => handleSubmit(statusElement)}
                                        color={statusElement.color}
                                        className="min-w-full"
                                        variant="dot"
                                    >{statusElement.name}</Chip>
                                </DropdownItem>
                            )
                        })
                    }
                </DropdownMenu>
            </Dropdown>
        </>
    )
}
