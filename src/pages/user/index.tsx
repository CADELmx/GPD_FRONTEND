import { Avatar, Button, Input } from "@nextui-org/react";
import { FormEvent, useState } from "react";
import toast from "react-hot-toast";
import { UseTemplates } from "../../context";

export default function Login() {
    const { login, logout, memory: { user }
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
        toast.promise(login(userInfo.email, userInfo.password), {
            loading: 'Iniciando sesión...',
            success: ({ error }) => {
                setLoading(false)
                return error ? 'Error al autenticar' : 'Usuario autenticado'
            },
            error: () => {
                setLoading(false)
                return 'Error intentando iniciar sesión'
            },
        })
    }
    return (
        <div className="flex flex-col items-center justify-center">
            <div className="flex-col object-fill w-5/6 sm:w-2/3 pt-5 mt-5">
                {user ? (
                    <form className="flex flex-col gap-2" onSubmit={logout}>
                        <div className="flex justify-center items-center content-center gap-2">
                            <Avatar color="primary"></Avatar>
                            <p className="">
                                Sesión iniciada cómo {user}
                            </p>
                        </div>
                        <Button className="self-center" type="submit" color="danger" variant="light">Cerrar sesión</Button>
                    </form >
                ) : (
                    <form
                        className="flex flex-col gap-2"
                        onChange={handleChange}
                        onSubmit={handleSubmit}>
                        <Input label="Correo" name="email" type="email" isRequired />
                        <Input label="Contraseña" name="password" type="password" isRequired />
                        <Button isLoading={loading} type="submit">Iniciar sesión</Button>
                    </form >
                )}
            </div >
        </div >
    )
}
