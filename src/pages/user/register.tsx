import { UseTemplates } from "@/context"
import { getPersonalData } from "@/models/transactions/personal-data"
import { Button, Input } from "@nextui-org/react"
import Router from "next/router"
import { ChangeEvent, useState } from "react"
import toast from "react-hot-toast"

export default function Register() {
    const { signUp } = UseTemplates()
    const [loading, setLoading] = useState(false);
    const [userInfo, setUserInfo] = useState({
        email: '',
        password: '',
        nt: '',
        name: ''
    });
    const handleSubmit = async () => {
        setLoading(true)
        toast.promise(signUp(userInfo.email, userInfo.password, Number(userInfo.nt)), {
            loading: 'Iniciando sesión...',
            success: ({ error, user }) => {
                setLoading(false)
                if (!error) {
                    Router.push('/user')
                }
                return error ? 'Error al autenticar' : `Sesion iniciada como ${user}`
            },
            error: () => {
                setLoading(false)
                return 'Error intentando iniciar sesión'
            },
        }, {
            id: 'login'
        })
    }
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target as HTMLInputElement;
        setUserInfo({ ...userInfo, [name]: value });
    }
    const handleGetPersonalData = (e: ChangeEvent<HTMLInputElement>) => {
        setUserInfo({ ...userInfo, nt: e.target.value })
        if (!userInfo.nt) return
        toast.promise(getPersonalData({ id: Number(userInfo.nt) }), {
            loading: 'Buscando trabajador',
            success: ({ data: { data, error, message } }) => {
                if (error) return message
                if (data) {
                    setUserInfo(userInfo => ({ ...userInfo, name: data.name }))
                }
                return message
            },
            error: 'Error al buscar trabajador'
        }, {
            id: 'get-personal-data'
        })

    }
    return (
        <>
            <h1 className="text-1xl font-bold text-center text-utim tracking-widest capitalize p-2 m-2">Crear nueva cuenta</h1>
            <div
                className="flex flex-col gap-2"
            >
                <Input
                    onChange={handleChange}
                    label="Correo"
                    value={userInfo.email}
                    name="email"
                    type="email"
                    isRequired
                />
                <Input
                    onChange={handleChange}
                    label="Contraseña"
                    value={userInfo.password}
                    name="password"
                    type="password"
                    isRequired
                />
                <Input
                    label="Número de trabajador"
                    onChange={handleGetPersonalData}
                    name="nt"
                    value={userInfo.nt}
                    type="number"
                    isRequired
                />
                <Input
                    label="Nombre"
                    name="name"
                    value={userInfo.name}
                    placeholder="Nombre del trabajador"
                    type="text"
                    isReadOnly
                />
                <Button
                    onPress={handleSubmit}
                    isDisabled={userInfo.email === '' || userInfo.password === ''}
                    isLoading={loading}
                    type="submit"
                    className="bg-utim"
                >
                    Crear la cuenta
                </Button>
            </div >
        </>
    )
}