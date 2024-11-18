import { Button, Chip, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Textarea, useDisclosure } from '@nextui-org/react'
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { MessageIcon } from './Icons';
import { UseTemplates } from '../context';
import { checkSocketStatus } from '../utils';

export interface StatusType {
    name: 'Pendiente' | 'Aprobado' | 'Corrección';
    color: 'warning' | 'success' | 'danger';
}

export const statusTypes: StatusType[] = [
    { name: 'Pendiente', color: 'warning' },
    { name: 'Aprobado', color: 'success' },
    { name: 'Corrección', color: 'danger' }
];

export const ChangeStatus = ({ status, templateid }) => {
    const { memory: { socket } } = UseTemplates()
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [comment, setComment] = useState('')
    const error = comment.length < 2
    const [taskStatus, setTaskStatus] = useState(statusTypes.find(s => s.name === status) || statusTypes[0])

    const handleUpdateStatus = (newStatus) => {
        if (checkSocketStatus(socket, toast)) return socket.connect()
        if (newStatus.name === 'Aprobado') socket.emit('deleteComment', { id: templateid })
        socket.emit('updateStatus', { id: templateid, status: newStatus })
        toast('Cambiando estado...', {
            id: 'status-change'
        })
    }
    const handleSubmit = (newStatus) => {
        if (newStatus.name === 'Corrección') {
            onOpen()
        } else {
            handleUpdateStatus(newStatus)
        }
    }
    const handleInsertComment = () => {
        if (checkSocketStatus(socket, toast)) return socket.connect()
        socket.emit('createComment', { id: templateid, comment })
        toast('Enviando comentario...', {
            id: 'comment-insert'
        })
    }
    const handleSetStatus = () => {
        if (checkSocketStatus(socket, toast)) return socket.connect()
        socket.emit('updateStatus', { id: templateid, status: { name: 'Corrección', color: 'danger' } })
        toast('Enviando a corrección...', {
            id: 'status-change'
        })
    }
    const handleClose = () => {
        handleSetStatus()
        handleInsertComment()
        onClose()
    }
    useEffect(() => {
        const onUpdateStatus = (data) => {
            if (data.error) {
                toast.error('Error al cambiar estado', {
                    id: 'status-change'
                })
            }
            if (data.id === templateid) {
                setTaskStatus(data.status)
                toast('Estado cambiado', {
                    id: 'status-change'
                })
            }
        }
        socket.on('updateStatus', onUpdateStatus)
        return () => {
            socket.off('updateStatus')
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
                                <Button isDisabled={error} onPress={handleClose} className='bg-utim'>Aceptar</Button>
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