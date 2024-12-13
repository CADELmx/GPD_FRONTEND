import { Button, Chip, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Navbar, NavbarBrand, NavbarContent, NavbarItem, NavbarMenu, NavbarMenuToggle } from "@nextui-org/react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/router"
import logo from "/public/utim.png"
import { useEffect, useState } from "react"
import toast from "react-hot-toast"
import { LoginButton } from "./LoginButton"
import { AcademicHatIcon, CheckIcon, EyeIcon, InboxIcon, PlusIcon } from "./Icons"
import { UseTemplates } from "../context"
import { Template } from "@/models/types/template"

export const Layout = ({ children }: {
    children: React.ReactNode
}) => {
    const secretaryItems = [
        {
            name: "Plantillas docentes - vista general", href: "/secretary/template", icon: InboxIcon
        },
        {
            name: 'Plantillas docentes - vista detallada', href: '/secretary/partialtemplate', icon: InboxIcon
        },
        {
            name: "Áreas", href: "/secretary/area", icon: AcademicHatIcon
        },
        {
            name: "Programas educativos", href: "/secretary/educationalprogram", icon: AcademicHatIcon
        },
        {
            name: "Materias", href: "/secretary/subject", icon: AcademicHatIcon
        }
    ]
    const programDirectorItems = [

        {
            name: "Ver estado de plantillas parciales", href: "/director/partialtemplate", icon: EyeIcon
        },
        {
            name: 'Ver estado de plantillas', href: '/', icon: EyeIcon
        },
        {
            name: 'Crear nueva plantilla', href: '/director/template', icon: PlusIcon
        },
        {
            name: 'Ver áreas y programas educativos', href: '/director/area', icon: AcademicHatIcon
        }
    ]
    const { memory: { socket } } = UseTemplates()
    const [isConnected, setIsConnected] = useState(false);
    const [transport, setTransport] = useState("N/A");
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const router = useRouter()
    useEffect(() => {
        function onConnect() {
            setIsConnected(true)
            setTransport(socket.io.engine.transport.name)
            socket.io.engine.on("upgrade", (transport) => {
                setTransport(transport.name)
            })
            socket.emit("connection")
        }
        function onDisconnect() {
            setIsConnected(false)
            setTransport("N/A")
        }
        function onCreatedTemplate(data: Template) {
            if (router.pathname === "/secretary") {
                toast.success('Plantilla docente recibida', {
                    id: "template-created",
                    duration: 5000,
                })
            }
        }
        function onStatusUpdate(data: Template) {
            if (router.pathname === "/") {
                toast.success(`Estado de la plantilla ${data.id} cambiado a ${data.state}`, {
                    id: "status",
                    duration: 5000,
                })
            }
        }
        if (socket.connected) {
            onConnect()
        }
        socket.on("connect", onConnect)
        socket.on("disconnect", onDisconnect)
        socket.on("createdTemplate", onCreatedTemplate)
        socket.on("updateStatus", onStatusUpdate)
        return () => {
            socket.off("connect", onConnect)
            socket.off("disconnect", onDisconnect)
        }
    }, [])
    return (
        <>
            <Navbar onMenuOpenChange={setIsMenuOpen}>
                <NavbarContent>
                    <NavbarMenuToggle
                        aria-label={isMenuOpen ? "Cerrar menú" : "Abrir menú"}
                        className="sm:hidden"
                    />
                    <NavbarBrand>
                        <Image src={logo} alt="UTIM" className="sm:w-32 sm:flex" width={80} height={33} priority />
                    </NavbarBrand>
                </NavbarContent>
                <NavbarContent className="hidden sm:flex" justify="center">

                    <Dropdown>
                        <NavbarItem>
                            <DropdownTrigger>
                                <Button variant="light">Dirección de carrera</Button>
                            </DropdownTrigger>
                        </NavbarItem>
                        <DropdownMenu
                            variant="solid"
                            color="default"
                            aria-label="academic items"
                            items={programDirectorItems}
                            classNames={{
                                base: 'p-0 m-0',
                            }}
                            selectionMode="single"
                            selectedKeys={[router.pathname]}
                        >
                            {
                                (directorItem) => (
                                    <DropdownItem
                                        href={directorItem.href}
                                        as={Link}
                                        className="data-[selected=true]:bg-default"
                                        startContent={directorItem.icon}
                                        textValue={directorItem.name}
                                        key={directorItem.href}
                                    >
                                        {directorItem.name}
                                    </DropdownItem>
                                )
                            }
                        </DropdownMenu>
                    </Dropdown>
                    <Dropdown>
                        <NavbarItem>
                            <DropdownTrigger>
                                <Button variant="light">Secretaría</Button>
                            </DropdownTrigger>
                        </NavbarItem>
                        <DropdownMenu
                            variant="solid"
                            color="default"
                            aria-label="secretary items"
                            items={secretaryItems}
                            classNames={{
                                base: 'p-0 m-0',
                            }}
                            selectionMode="single"
                            selectedKeys={[router.pathname]}
                        >
                            {
                                (secretaryItem) => (
                                    <DropdownItem
                                        as={Link}
                                        href={secretaryItem.href}
                                        startContent={secretaryItem.icon
                                        }
                                        className="data-[selected=true]:bg-default"
                                        textValue={secretaryItem.name}
                                        key={secretaryItem.href}
                                    >
                                        {secretaryItem.name}
                                    </DropdownItem>
                                )
                            }
                        </DropdownMenu>
                    </Dropdown>
                </NavbarContent>
                {
                    !isMenuOpen && (
                        <NavbarContent justify="end">
                            <LoginButton />
                            <Chip
                                variant="dot"
                                className="hidden sm:flex"
                                color={isConnected ? "success" : "danger"}
                            >{isConnected ? "Conectado" : "Desconectado"}
                            </Chip>
                            <Chip
                                variant="dot"
                                radius="full"
                                className="flex sm:hidden pr-0"
                                classNames={{
                                    content: "pr-0",
                                    dot: "pr-0",
                                    base: "pr-0",
                                }}
                                color={isConnected ? "success" : "danger"}
                            />
                        </NavbarContent>
                    )
                }
                <NavbarMenu>
                    <Dropdown>
                        <NavbarItem>
                            <DropdownTrigger>
                                <Button variant="light" size="lg">Dirección de carrera</Button>
                            </DropdownTrigger>
                        </NavbarItem>
                        <DropdownMenu
                            variant="solid"
                            color="primary"
                            aria-label="academic items"
                            items={programDirectorItems}
                            selectedKeys={[router.pathname]}
                            selectionMode="single"
                            classNames={{
                                base: 'p-0 m-0',
                            }}
                        >
                            {
                                (directorItem) => (
                                    <DropdownItem
                                        startContent={directorItem.icon
                                        }
                                        className="data-[selected=true]:bg-primary"
                                        textValue={directorItem.name}
                                        key={directorItem.href}
                                    >
                                        {directorItem.name}
                                    </DropdownItem>
                                )
                            }
                        </DropdownMenu>
                    </Dropdown>
                    <Dropdown>
                        <NavbarItem>
                            <DropdownTrigger>
                                <Button variant="light" size="lg">Secretaría</Button>
                            </DropdownTrigger>
                        </NavbarItem>
                        <DropdownMenu
                            variant="solid"
                            color="default"
                            aria-label="secretary items"
                            items={secretaryItems}
                            selectedKeys={[router.pathname]}
                            classNames={{
                                base: 'p-0 m-0',
                            }}
                            selectionMode="single"
                        >
                            {
                                (secretaryItem) => (
                                    <DropdownItem
                                        href={secretaryItem.href}
                                        startContent={secretaryItem.icon
                                        }
                                        textValue={secretaryItem.name}
                                        key={secretaryItem.href}
                                    >
                                        {secretaryItem.name}
                                    </DropdownItem>
                                )
                            }
                        </DropdownMenu>
                    </Dropdown>
                    <LoginButton />
                    <Chip variant="dot" color={isConnected ? "success" : "danger"}>
                        {isConnected ? "Conectado" : "Desconectado"}
                    </Chip>
                </NavbarMenu>
            </Navbar>
            <div className="flex flex-col items-center justify-center">
                <div className="flex flex-col gap-2 object-fill w-5/6 sm:w-2/3">
                    {children}
                </div>
            </div>
        </>
    )
}