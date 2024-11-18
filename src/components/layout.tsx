import { Button, Chip, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Navbar, NavbarBrand, NavbarContent, NavbarItem, NavbarMenu, NavbarMenuToggle } from "@nextui-org/react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/router"
import logo from "/public/utim.png"
import { useEffect, useState } from "react"
import toast from "react-hot-toast"
import { LoginButton } from "./LoginButton"
import { AcademicHatIcon, EyeIcon, InboxIcon, PlusIcon } from "./Icons"
import { UseTemplates } from "../context"
import { Template } from "@/models/types/template"

export const Layout = ({ children }: {
    children: React.ReactNode
}) => {
    const navBarMenuItems = [
        { name: "Inicio", href: "/" },
        { name: "Secretaría", href: "/secretary" },
        { name: "Estado de plantillas", href: "/templatestatus" },
    ]
    const secretaryItems = [
        {
            name: "Plantillas", href: "/secretary", icon: InboxIcon
        },
        {
            name: "Areas", href: "/secretary/area", icon: AcademicHatIcon
        },
        {
            name: "Programas educativos", href: "/secretary/educationalprogram", icon: AcademicHatIcon
        },
    ]
    const programDirectorItems = [
        {
            name: "Ver estado de plantillas parciales", href: "/director/partialtemplate", icon: EyeIcon
        },
        {
            name: 'Ver estado de plantillas', href: '/director/template', icon: EyeIcon
        },
        {
            name: 'Crear nueva plantilla', href: '/director', icon: PlusIcon

        }
    ]
    const { memory: { socket, user } } = UseTemplates()
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
                console.log(transport.name)
            })
            socket.emit("connection")
        }
        function onDisconnect() {
            setIsConnected(false)
            setTransport("N/A")
        }
        function onTemplateError(data: Template) {
            if (router.pathname === "/") {
                toast.error('Error al crear un plantilla', {
                    id: "template-error",
                    duration: 5000,
                })
            }
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
        socket.on("templateError", onTemplateError)
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
                        <Image src={logo} alt="UTIM" className="sm:w-32 sm:flex" width={80} height={80} />
                    </NavbarBrand>
                </NavbarContent>
                <NavbarContent className="hidden sm:flex" justify="center">

                    <Dropdown>
                        <NavbarItem>
                            <DropdownTrigger>
                                <Button variant="light">Dirección de carrera</Button>
                            </DropdownTrigger>
                        </NavbarItem>
                        <DropdownMenu variant="solid" color="primary" aria-label="academic items" items={programDirectorItems}>
                            {
                                (directorItem) => (
                                    <DropdownItem
                                        startContent={directorItem.icon
                                        }
                                        textValue={directorItem.name}
                                        key={directorItem.name}
                                    >
                                        <Link passHref href={directorItem.href}>
                                            {directorItem.name}
                                        </Link>
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
                        <DropdownMenu variant="solid" color="primary" aria-label="secretary items" items={secretaryItems}>
                            {
                                (secretaryItem) => (
                                    <DropdownItem
                                        startContent={secretaryItem.icon
                                        }
                                        textValue={secretaryItem.name}
                                        key={secretaryItem.name}
                                    >
                                        <Link passHref href={secretaryItem.href}>
                                            {secretaryItem.name}
                                        </Link>
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
                                className="flex sm:hidden"
                                color={isConnected ? "success" : "danger"}
                            >.
                            </Chip>
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
                        <DropdownMenu variant="solid" color="primary" aria-label="academic items" items={programDirectorItems}>
                            {
                                (directorItem) => (
                                    <DropdownItem
                                        startContent={directorItem.icon
                                        }
                                        textValue={directorItem.name}
                                        key={directorItem.name}
                                    >
                                        <Link passHref href={directorItem.href}>
                                            {directorItem.name}
                                        </Link>
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
                        <DropdownMenu variant="solid" color="primary" aria-label="secretary items" items={secretaryItems}>
                            {
                                (secretaryItem) => (
                                    <DropdownItem
                                        startContent={secretaryItem.icon
                                        }
                                        textValue={secretaryItem.name}
                                        key={secretaryItem.name}
                                    >
                                        <Link passHref href={secretaryItem.href}>
                                            {secretaryItem.name}
                                        </Link>
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