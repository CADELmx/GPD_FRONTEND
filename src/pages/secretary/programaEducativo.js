import { ModalError } from "@/components/ModalError"
import { getAreas } from "@/models/transactions"
import { Button, Input, Select, SelectItem } from "@nextui-org/react"
import { useState } from "react"

export const getServerSideProps = async () => {
    const { data: { data, error } } = await getAreas()
    return {
        props: {
            areas: data,
            error: error ? 'Algo salió mal al obtener las áreas, recarga la página' : null
        }
    }
}

export const CreateEducationalProgram = ({ areas }) => {
    const [educationalProgram, setEducationalProgram] = useState({
        name: '',
        areaId: ''
    })
    const handleChange = (e) => {
        setEducationalProgram({
            ...educationalProgram,
            [e.target.name]: e.target.value
        })
        console.log(educationalProgram)
    }
    return (
        <>
            <Select onChange={handleChange} label='Área' name="areaId" selectedKeys={
                educationalProgram.areaId === '' ?
                    [] : [educationalProgram.areaId]
            } items={areas}>
                {
                    (area) =>
                        <SelectItem key={area.id} value={area.id}>{area.name}</SelectItem>
                }
            </Select>
            <Input onChange={handleChange} label='Nombre' name='name' />
            <Button>Registrar</Button>
        </>
    )
}

export default function EducativeProgram({ areas, error }) {
    return (
        <div className="flex flex-col items-center justify-center">
            <h1 className="text-1xl font-bold text-center text-utim tracking-widest capitalize p-2 m-2">Registrar programa educativo</h1>
            <div className="flex flex-col gap-1 w-5/6 sm:w-2/3">
                <ModalError error={error} />
                <CreateEducationalProgram areas={areas} />
            </div>
        </div>
    )
}