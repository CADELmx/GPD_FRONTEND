import { Avatar, Button, Card, CardBody, CardHeader, Divider, Input } from "@nextui-org/react";
import { FormEvent, useState } from "react";
import toast from "react-hot-toast";
import { UseTemplates } from "../../context";
import Link from "next/link";

export default function Login() {
    const { signIn, signOut, memory: { user }
    } = UseTemplates()
    const [loading, setLoading] = useState(false);
    const [userInfo, setUserInfo] = useState({
        email: '',
        password: ''
    });
    const handleChange = (e: FormEvent<HTMLFormElement>) => {
        const { name, value } = e.target as HTMLInputElement;
        setUserInfo({ ...userInfo, [name]: value });
    }
    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setLoading(true)
        toast.promise(signIn(userInfo.email, userInfo.password), {
            loading: 'Iniciando sesión...',
            success: ({ error }) => {
                setLoading(false)
                return error ? 'Error al autenticar' : 'Usuario autenticado'
            },
            error: () => {
                setLoading(false)
                return 'Error intentando iniciar sesión'
            },
        }, {
            id: 'login'
        })
    }
    return (
        user ? (
            <Card
                className="flex self-center flex-col gap-2 items-center justify-center"
                classNames={{
                    base:'p-2'
                }}
            >
                <CardHeader className="flex gap-3 items-center justify-center">
                    <Avatar
                        isBordered
                        color="primary"
                        classNames={{
                            icon: 'bg-utim',
                        }} />
                    <div className="flex flex-col">
                        Sesión iniciada cómo
                        <span className="font-bold"> {user}</span>
                    </div>
                </CardHeader>
                <CardBody className="flex justify-center items-center content-center gap-3">
                    <Button
                        onPress={signOut}
                        color="danger"
                    >
                        Cerrar sesión
                    </Button>
                </CardBody>
            </Card >
        ) : (
            <form
                className="flex flex-col gap-2"
                onChange={handleChange}
                onSubmit={handleSubmit}
            >
                <Input
                    label="Correo"
                    name="email"
                    type="email"
                    autoComplete="email"
                    isRequired
                    isDisabled={loading}
                />
                <Input
                    label="Contraseña"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    isRequired
                    isDisabled={loading}
                />
                <Button
                    isDisabled={userInfo.email === '' || userInfo.password === ''}
                    isLoading={loading}
                    type="submit"
                    className="bg-utim"
                >
                    Iniciar sesión
                </Button>
                <div className="flex items-center justify-center gap-2">
                    <Divider className="w-2/5" />
                    o
                    <Divider className="w-2/5" />
                </div>
                <Link href="/user/register" passHref legacyBehavior>
                    <Button color="primary">
                        Registrarse
                    </Button>
                </Link>
            </form >
        )
    )
}
