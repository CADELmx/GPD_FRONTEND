import { StoredContext, UseTemplates } from "@/context"
import { Button, Chip, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Navbar, NavbarBrand, NavbarContent, NavbarItem, NavbarMenu, NavbarMenuToggle } from "@nextui-org/react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/router"
import logo from "/public/utim.png"
import { useEffect, useState } from "react"
import toast from "react-hot-toast"
import { LoginButton } from "./LoginButton"

export const Layout = ({ children }) => {
    const navBarMenuItems = [
        { name: "Inicio", href: "/" },
        { name: "Secretaría", href: "/secretary" },
        { name: "Estado de plantillas", href: "/templatestatus" },
    ]
    const secretaryItems = [
        {
            name: "Plantillas", href: "/secretary", icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 13.5h3.86a2.25 2.25 0 0 1 2.012 1.244l.256.512a2.25 2.25 0 0 0 2.013 1.244h3.218a2.25 2.25 0 0 0 2.013-1.244l.256-.512a2.25 2.25 0 0 1 2.013-1.244h3.859m-19.5.338V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18v-4.162c0-.224-.034-.447-.1-.661L19.24 5.338a2.25 2.25 0 0 0-2.15-1.588H6.911a2.25 2.25 0 0 0-2.15 1.588L2.35 13.177a2.25 2.25 0 0 0-.1.661Z" />
            </svg>
        },
        {
            name: "Areas", href: "/secretary/area", icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5" />
            </svg>
        },
        {
            name: "Programas educativos", href: "/secretary/educationalprogram", icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5" />
            </svg>

        },
    ]
    const programDirectorItems = [
        {
            name: "Ver estado de plantillas parciales", href: "/director/partialtemplate", icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
            </svg>
        },
        {
            name: 'Ver estado de plantillas', href: '/director/template', icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
            </svg>
        },
        {
            name: 'Crear nueva plantilla', href: '/director', icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          
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
        function onTemplateError(data) {
            if (router.pathname === "/") {
                toast.error(data, {
                    id: "template-error",
                    duration: 5000,
                })
            }
        }
        function onCreatedTemplate(data) {
            if (router.pathname === "/secretary") {
                toast.success('Plantilla docente recibida', {
                    id: "template-created",
                    duration: 5000,
                })
            }
        }
        function onStatusUpdate(data) {
            if (router.pathname === "/") {
                toast.success(`Estado de la plantilla ${data.id} cambiado a ${data.status}`, {
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
                            <Chip variant="dot" className="hidden sm:flex" color={isConnected ? "success" : "error"}>{isConnected ? "Conectado" : "Desconectado"}</Chip>
                            <Chip variant="dot" radius="full" className="flex sm:hidden" color={isConnected ? "success" : "danger"}>.</Chip>
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
            {children}
        </>
    )
}