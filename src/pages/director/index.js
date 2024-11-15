import { statusTypes } from "@/components/ChangeStatus";
import { ModalError } from "@/components/ModalError";
import { YearSelectorAlter } from "@/components/Selector";
import { getAreas, insertTemplate } from "@/models/transactions";
import { Button, Chip, Select, SelectItem } from "@nextui-org/react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export const getServerSideProps = async () => {
    const { data: { data: areas, error } } = await getAreas()
    return {
        props: {
            error,
            areas
        }
    }
}

export default function DirectorIndex({ areas, template: ssrTemplate, error }) {
    const [template, setTemplate] = useState({
        areaId: '',
        year: new Date().getFullYear(),
        period: '',
        status: 'pendiente',
        reponsibleId: '',
        revisedById: ''
    })
    const handleSubmit = () => {
        toast.promise(insertTemplate(template), {
            loading: 'Registrando plantilla',
            success: ({ data: { data, error, message } }) => {
                if (error) return message
                return message
            },
            error: 'Error al crear la plantilla'
        })
    }
    const [templateStatus, setTemplateStatus] = useState(statusTypes.find(s => s.name === template?.status) || statusTypes[0])
    useEffect(() => {
        if (ssrTemplate?.id) {
            setTemplate(ssrTemplate)
            setTemplateStatus(statusTypes.find(s => s.name === ssrTemplate.status) || statusTypes[0])
        }
        const datas = [
            {
                "ide": 127,
                "name": "Marina Cruz Cárdenas",
                "position": "Profesora de asignatura \"B\"",
                "department": "P.E. de Lengua Inglesa",
                "active": true
            },
            {
                "ide": 128,
                "name": "Diana Carolina Gutiérrez Figueroa",
                "position": "Profesora de asignatura \"B\"",
                "department": "P.E. de Lengua Inglesa",
                "active": true
            },
            {
                "ide": 134,
                "name": "Patricia Pérez Ballinas",
                "position": "Profesora de asignatura \"B\"",
                "department": "P.E. de Lengua Inglesa",
                "active": true
            },
            {
                "ide": 268,
                "name": "Narciso Castillo Sanguino",
                "position": "Profesor de Tiempo Completo Asociado \"C\"",
                "department": "P.E. de Lengua Inglesa",
                "active": true
            },
            {
                "ide": 308,
                "name": "Elizabeth García Luís",
                "position": "Profesora de asignatura \"B\"",
                "department": "P.E. de Lengua Inglesa",
                "active": true
            },
            {
                "ide": 381,
                "name": "Luis Alberto Riaño Domínguez",
                "position": "Técnico de Apoyo",
                "department": "P.E. de Lengua Inglesa",
                "active": true
            },
            {
                "ide": 527,
                "name": "Fabiola Flores Trejo",
                "position": "Profesora de asignatura \"B\"",
                "department": "P.E. de Lengua Inglesa",
                "active": true
            },
            {
                "ide": 549,
                "name": "Erandi Yutzil Luisillo Torrealba",
                "position": "Profesora de asignatura \"B\"",
                "department": "P.E. de Lengua Inglesa",
                "active": true
            },
            {
                "ide": 563,
                "name": "Miguelina García Herrera",
                "position": "Profesora de asignatura \"B\"",
                "department": "P.E. de Lengua Inglesa",
                "active": true
            },
            {
                "ide": 33,
                "name": "Juana Grisel Casarrubias Hernández",
                "position": "Técnica de Apoyo",
                "department": "P.E. de Lengua Inglesa",
                "active": true
            },
            {
                "ide": 85,
                "name": "María del Socorro Ramírez Ramírez",
                "position": "Profesora de Tiempo Completo Asociado \"C\"",
                "department": "P.E. de Lengua Inglesa",
                "active": true
            },
            {
                "ide": 6,
                "name": "Celina Rincón Muñiz",
                "position": "Directora de Programa Educativo",
                "department": "P.E. De Procesos Alimentarios y paramédico",
                "active": true
            },
            {
                "ide": 9,
                "name": "Silvestre Martínez Reyes",
                "position": "Profesor de Tiempo Completo Asociado \"C\"",
                "department": "P.E. de Contaduría",
                "active": true
            },
            {
                "ide": 12,
                "name": "Laura Adriana Cadena Salgado",
                "position": "Profesora de Tiempo Completo Asociado \"C\"",
                "department": "P.E. de Paramédico",
                "active": true
            },
            {
                "ide": 15,
                "name": "Miguel Fidel Vázquez Solís",
                "position": "Jefe de Departamento",
                "department": "Departamento de Servicios Escolares",
                "active": true
            },
            {
                "ide": 18,
                "name": "Félix Martín Peña Cruz Archundia",
                "position": "Profesor de asignatura \"B\"",
                "department": "P.E. de Tecnologías de la Información",
                "active": true
            },
            {
                "ide": 27,
                "name": "Antonio Soriano Hernández",
                "position": "Técnico de Apoyo",
                "department": "P.E. de Procesos Alimentarios",
                "active": true
            },
            {
                "ide": 28,
                "name": "Justina Sierra Moctezuma",
                "position": "Técnica de Apoyo",
                "department": "P.E. de Procesos Alimentarios",
                "active": true
            },
            {
                "ide": 30,
                "name": "Francisco Javier Rodríguez Vazquez",
                "position": "Profesor de asignatura \"B\"",
                "department": "P.E. de Procesos Alimentarios",
                "active": true
            },
            {
                "ide": 34,
                "name": "Janet Cabrera García",
                "position": "Profesora de asignatura \"B\"",
                "department": "P.E. de Administración",
                "active": true
            },
            {
                "ide": 36,
                "name": "Cristóbal Sosa López",
                "position": "Técnico de Apoyo",
                "department": "P.E. de Tecnologías de la Información",
                "active": true
            },
            {
                "ide": 37,
                "name": "Virginia García Meneses",
                "position": "Técnica de Apoyo",
                "department": "P.E. de Agrobiotecnología",
                "active": true
            },
            {
                "ide": 38,
                "name": "Socorro Isabel Diego Estudillo",
                "position": "Coordinadora",
                "department": "Subdirección de Extensión Universitaria",
                "active": true
            },
            {
                "ide": 39,
                "name": "Noe Flores Infante",
                "position": "Jefe de Oficina",
                "department": "Departamento de Servicios Escolares",
                "active": true
            },
            {
                "ide": 40,
                "name": "Alicia Lima Sánchez",
                "position": "Profesora de asignatura \"B\"",
                "department": "P.E. de Administración",
                "active": true
            },
            {
                "ide": 41,
                "name": "Daniel Aguilar Jiménez",
                "position": "Profesor de Tiempo Completo Asociado \"A\"",
                "department": "P.E. de Agrobiotecnología",
                "active": true
            },
            {
                "ide": 42,
                "name": "Dominga Madero Arriola",
                "position": "Investigadora especializada",
                "department": "Subdirección de Servicios Administrativos",
                "active": true
            },
            {
                "ide": 43,
                "name": "Jenny Jaimes González",
                "position": "Profesora de asignatura \"B\"",
                "department": "P.E. de Paramédico",
                "active": true
            },
            {
                "ide": 46,
                "name": "Victorina Soriano Narveza",
                "position": "Jefa de Oficina",
                "department": "Departamento de Recursos Materiales y Servicios Generales",
                "active": true
            },
            {
                "ide": 49,
                "name": "Lorena Vázquez Campos",
                "position": "Coordinador",
                "department": "P.E. Tecnologías de la Información y Lengua Inglesa",
                "active": true
            },
            {
                "ide": 51,
                "name": "Ariadna Urusquieta Santiago",
                "position": "Secretaria de Rector",
                "department": "Rectoría",
                "active": true
            },
            {
                "ide": 52,
                "name": "Josué Jiménez Rojas",
                "position": "Analista Administrativo",
                "department": "Departamento de Recursos Materiales y Servicios Generales",
                "active": true
            },
            {
                "ide": 55,
                "name": "Fernando Flores Aguilar",
                "position": "Profesor de Tiempo Completo Asociado \"C\"",
                "department": "P.E. de Contaduría",
                "active": true
            },
            {
                "ide": 58,
                "name": "Fernando Antonio Sierra Moctezuma",
                "position": "Profesor de asignatura \"B\"",
                "department": "P.E. de Administración",
                "active": true
            },
            {
                "ide": 60,
                "name": "Elena Palapa Primor",
                "position": "Analista Administrativo",
                "department": "Departamento de Servicios Escolares",
                "active": true
            },
            {
                "ide": 61,
                "name": "Yoeli Mirena Merino Muñoz",
                "position": "Secretaria de Director de área",
                "department": "P.E. de Contaduría",
                "active": true
            },
            {
                "ide": 62,
                "name": "Socorro González Manjarrez",
                "position": "Analista Administrativo",
                "department": "Departamento de Servicios Médicos",
                "active": true
            },
            {
                "ide": 63,
                "name": "Elidio Martínez Reyes",
                "position": "Coordinador",
                "department": "Departamento de Recursos Materiales y Servicios Generales",
                "active": true
            },
            {
                "ide": 64,
                "name": "María del Carmen Roman Garzón",
                "position": "Técnica de Apoyo",
                "department": "P.E. de Administración",
                "active": true
            },
            {
                "ide": 65,
                "name": "Ana María Aguilar Vázquez",
                "position": "Jefa de Oficina",
                "department": "Rectoría",
                "active": true
            },
            {
                "ide": 66,
                "name": "Anahí Medina Ramírez",
                "position": "Profesora de asignatura \"B\"",
                "department": "P.E. de Administración",
                "active": true
            },
            {
                "ide": 67,
                "name": "Luz María Rosas Castro",
                "position": "Jefa de Oficina",
                "department": "Dirección de Vinculación",
                "active": true
            },
            {
                "ide": 69,
                "name": "Dalia Cruz Hernández",
                "position": "Jefa de Oficina",
                "department": "Departamento de Recursos Humanos",
                "active": true
            },
            {
                "ide": 70,
                "name": "Lorena Cuevas Mendieta",
                "position": "Profesora de asignatura \"B\"",
                "department": "P.E. de Administración",
                "active": true
            },
            {
                "ide": 72,
                "name": "Mauricio Bernardo Torres Sánchez",
                "position": "Chofer de Rector",
                "department": "Departamento de Recursos Materiales y Servicios Generales",
                "active": true
            },
            {
                "ide": 76,
                "name": "Amado Enrique Navarro Frómeta",
                "position": "Profesor de Tiempo Completo Titular \"B\"",
                "department": "P.E. de Procesos Alimentarios",
                "active": true
            },
            {
                "ide": 77,
                "name": "Alfonso Monterrosas Fuentes",
                "position": "Encargado de Despacho del P.E. Tecnologías de la Información y Lengua Inglesa",
                "department": "P.E. de Tecnologías de la Información y Lengua Inglesa ",
                "active": true
            },
            {
                "ide": 78,
                "name": "Carlos Artemio Ortíz Ramírez",
                "position": "Profesor de Tiempo Completo Titular \"A\"",
                "department": "P.E. de Tecnologías de la Información",
                "active": true
            },
            {
                "ide": 80,
                "name": "Sandro Cid Ortega",
                "position": "Profesor de Tiempo Completo Titular \"A\"",
                "department": "P.E. de Procesos Alimentarios",
                "active": true
            },
            {
                "ide": 91,
                "name": "Sonia Guerrero Mentado",
                "position": "Profesora de Tiempo Completo Asociado \"C\"",
                "department": "P.E. de Contaduría",
                "active": true
            },
            {
                "ide": 92,
                "name": "Lucia Reyes Martínez",
                "position": "Profesora de Tiempo Completo Asociado \"C\"",
                "department": "P.E. de Administración",
                "active": true
            },
            {
                "ide": 94,
                "name": "Janet Merino Viazcán",
                "position": "Profesora de Tiempo Completo Asociado \"C\"",
                "department": "P.E. de Administración",
                "active": true
            },
            {
                "ide": 95,
                "name": "Maria de Lourdes Beltrán Romero",
                "position": "Profesora de Tiempo Completo Asociado \"C\"",
                "department": "P.E. de Contaduría",
                "active": true
            },
            {
                "ide": 97,
                "name": "Herendira Vicuña Tapia",
                "position": "Profesora de Tiempo Completo Asociado \"C\"",
                "department": "P.E. de Administración",
                "active": true
            },
            {
                "ide": 98,
                "name": "José Luis Leana Acevedo",
                "position": "Profesor de Tiempo Completo Asociado \"C\"",
                "department": "P.E. de Agricultura Sustentable y Protegida",
                "active": true
            },
            {
                "ide": 99,
                "name": "Humberto Herrera López",
                "position": "Profesor de Tiempo Completo Asociado \"C\"",
                "department": "P.E. de Agricultura Sustentable y Protegida",
                "active": true
            },
            {
                "ide": 110,
                "name": "Iván Antonio Flores Trujillo",
                "position": "Profesor de Tiempo Completo Asociado \"C\"",
                "department": "P.E. de Tecnologías de la Información",
                "active": true
            },
            {
                "ide": 115,
                "name": "Oscar Esteban Guerrero Hernández",
                "position": "Profesor de Tiempo Completo Asociado \"C\"",
                "department": "P.E. de Tecnologías de la Información",
                "active": true
            },
            {
                "ide": 116,
                "name": "Erick Mario López Méndez",
                "position": "Profesor de Tiempo Completo Asociado \"C\"",
                "department": "P.E. de Procesos Alimentarios",
                "active": true
            },
            {
                "ide": 117,
                "name": "Juan Tufiño Barco",
                "position": "Profesor de asignatura \"B\"",
                "department": "P.E. de Contaduría",
                "active": true
            },
            {
                "ide": 118,
                "name": "Reyna Trinidad Reyes Rodríguez",
                "position": "Profesora de Tiempo Completo Asociado \"C\"",
                "department": "P.E. de Agrobiotecnología",
                "active": true
            },
            {
                "ide": 119,
                "name": "Catalina Edith Ortíz Martínez",
                "position": "Profesora de asignatura \"B\"",
                "department": "P.E. de Paramédico",
                "active": true
            },
            {
                "ide": 121,
                "name": "Patricia Mendoza Crisóstomo",
                "position": "Profesora de Tiempo Completo Asociado \"C\"",
                "department": "P.E. de Tecnologías de la Información",
                "active": true
            },
            {
                "ide": 122,
                "name": "Miriam Muñoz Flores",
                "position": "Profesora de asignatura \"B\"",
                "department": "P.E. de Administración",
                "active": true
            },
            {
                "ide": 126,
                "name": "David García Pacheco",
                "position": "Profesor de Tiempo Completo Asociado \"B\"",
                "department": "P.E. de Tecnologías de la Información",
                "active": true
            },
            {
                "ide": 129,
                "name": "Eulalio Rivera López",
                "position": "Profesor de asignatura \"B\"",
                "department": "P.E. de Agrobiotecnología",
                "active": true
            },
            {
                "ide": 135,
                "name": "Silvia Edith Cortes Martínez",
                "position": "Profesora de Tiempo Completo Asociado \"C\"",
                "department": "P.E. de Administración",
                "active": true
            },
            {
                "ide": 139,
                "name": "Soledad Hernández Morales",
                "position": "Profesora de asignatura \"B\"",
                "department": "P.E. de Procesos Alimentarios",
                "active": true
            },
            {
                "ide": 142,
                "name": "Yetzabel Palma Bermejo",
                "position": "Profesora de Tiempo Completo Asociado \"B\"",
                "department": "P.E. de Contaduría ",
                "active": true
            },
            {
                "ide": 144,
                "name": "Leticia Díaz Rincón",
                "position": "Profesora de asignatura \"B\"",
                "department": "P.E. de Agrobiotecnología",
                "active": true
            },
            {
                "ide": 146,
                "name": "Arturo Gutiérrez Salgado",
                "position": "Técnico Bibliotecario",
                "department": "Departamento de Servicios Escolares",
                "active": true
            },
            {
                "ide": 147,
                "name": "Rodolfo Alejandro Gómez Gutiérrez",
                "position": "Profesor de asignatura \"B\"",
                "department": "P.E. de Administración",
                "active": true
            },
            {
                "ide": 151,
                "name": "Isaúl Herrera Vélez",
                "position": "Profesor de asignatura \"B\"",
                "department": "Actividades culturales y deportivas",
                "active": true
            },
            {
                "ide": 162,
                "name": "Sandra Mónica Romero Leal",
                "position": "Profesora de asignatura \"B\"",
                "department": "P.E. de Lengua Inglesa",
                "active": true
            },
            {
                "ide": 165,
                "name": "Gustavo García Rojas",
                "position": "Profesor de Tiempo Completo Asociado \"C\"",
                "department": "P.E. de Contaduría (Tulcingo)",
                "active": true
            },
            {
                "ide": 170,
                "name": "Elizabeth Fortozo Tapia",
                "position": "Jefa de Departamento",
                "department": "Departamento de Planeación y Evaluación",
                "active": true
            },
            {
                "ide": 174,
                "name": "Jesus Avila Valle",
                "position": "Técnico de Apoyo",
                "department": "P.E. de Contaduría (tulcingo)",
                "active": true
            },
            {
                "ide": 179,
                "name": "Sergio Carlos Delgado Reyes",
                "position": "Profesor de Tiempo Completo Asociado \"A\"",
                "department": "P.E. de Administración",
                "active": true
            },
            {
                "ide": 187,
                "name": "Fernando Luna Cano",
                "position": "Profesor de asignatura \"B\"",
                "department": "Actividades culturales y deportivas",
                "active": true
            },
            {
                "ide": 188,
                "name": "Mario Quiñones Mendoza",
                "position": "Profesor de asignatura \"B\"",
                "department": "P.E. de Lengua Inglesa",
                "active": true
            },
            {
                "ide": 189,
                "name": "Mario Romero Moranchel",
                "position": "Profesor de Tiempo Completo Asociado \"C\"",
                "department": "P.E. de Agricultura Sustentable y Protegida",
                "active": true
            },
            {
                "ide": 193,
                "name": "Alicia Esthela Vidal Mejía",
                "position": "Profesora de Tiempo Completo Asociado \"C\"",
                "department": "P.E. de Paramédico",
                "active": true
            },
            {
                "ide": 212,
                "name": "Fernando Díaz de la Rosa",
                "position": "Profesor de asignatura \"B\"",
                "department": "P.E. de Agrobiotecnología",
                "active": true
            },
            {
                "ide": 216,
                "name": "Cupertino Lucero Álvarez",
                "position": "Profesor de Tiempo Completo Asociado \"C\"",
                "department": "P.E. de Tecnologías de la Información",
                "active": true
            },
            {
                "ide": 221,
                "name": "Elva Patricia Ramírez Cortes",
                "position": "Profesora de Tiempo Completo Asociado \"C\"",
                "department": "P.E. de Contaduría",
                "active": true
            },
            {
                "ide": 224,
                "name": "Eva María Sánchez Camacho",
                "position": "Profesora de asignatura \"B\"",
                "department": "P.E. de Contaduría",
                "active": true
            },
            {
                "ide": 227,
                "name": "Carlos Alberto González González",
                "position": "Profesor de asignatura \"B\"",
                "department": "P.E. de Tecnologías de la Información",
                "active": true
            },
            {
                "ide": 229,
                "name": "Ariadna Guadalupe Bravo Aguirre",
                "position": "Profesora de Tiempo Completo Asociado \"A\"",
                "department": "P.E. de Procesos Alimentarios",
                "active": true
            },
            {
                "ide": 243,
                "name": "José Ángel Rosas Alatriste",
                "position": "Profesor de asignatura \"B\"",
                "department": "P.E. de Paramédico",
                "active": true
            },
            {
                "ide": 246,
                "name": "Angela Hernández Ríos",
                "position": "Profesora de asignatura \"B\"",
                "department": "P.E. de Tecnologías de la Información",
                "active": true
            },
            {
                "ide": 248,
                "name": "Ma. Del Carmen Tzoni Cantellano",
                "position": "Profesora de asignatura \"B\"",
                "department": "P.E. de Contaduría",
                "active": true
            },
            {
                "ide": 249,
                "name": "Susana Gabriela Toribio Perez",
                "position": "Técnica de Apoyo",
                "department": "P.E. de Procesos Alimentarios",
                "active": true
            },
            {
                "ide": 251,
                "name": "María Vázquez Vázquez",
                "position": "Profesora de Tiempo Completo Asociado \"C\"",
                "department": "P.E. de Tecnologías de la Información",
                "active": true
            },
            {
                "ide": 256,
                "name": "Miguel Ángel Marín Méndez",
                "position": "Profesor de asignatura \"B\"",
                "department": "P.E. de Tecnologías de la Información",
                "active": true
            },
            {
                "ide": 261,
                "name": "Maria Magdalena Rojas Nando",
                "position": "Técnica de Apoyo",
                "department": "P.E. de Agricultura Sustentable y Protegida",
                "active": true
            },
            {
                "ide": 262,
                "name": "Lorenzo Morales Morales",
                "position": "Profesor de asignatura \"B\"",
                "department": "P.E. de Procesos Alimentarios",
                "active": true
            },
            {
                "ide": 265,
                "name": "Conrado Castro Bravo",
                "position": "Profesor de Tiempo Completo Asociado \"C\"",
                "department": "P.E. Agricultura Sustentable y Protegida",
                "active": true
            },
            {
                "ide": 267,
                "name": "Benito Rodriguez Soriano",
                "position": "Técnico de Apoyo",
                "department": "P.E. de Contaduría",
                "active": true
            },
            {
                "ide": 277,
                "name": "Jorge Antonio Herrera Cárdenas",
                "position": "Jefe de Departamento",
                "department": "Departamento de investigación y Desarrollo",
                "active": true
            },
            {
                "ide": 279,
                "name": "Rosa Delfina González Vicente",
                "position": "Profesora de Tiempo Completo Asociado \"A\"",
                "department": "P.E. de Agricultura Sustentable y Protegida",
                "active": true
            },
            {
                "ide": 284,
                "name": "Pedro García Martínez",
                "position": "Técnico Especializado en Mantenimiento",
                "department": "Departamento de Recursos Materiales y Servicios Generales",
                "active": true
            },
            {
                "ide": 289,
                "name": "Mariza González Vicente",
                "position": "Profesora de asignatura \"B\"",
                "department": "P.E. de Administración",
                "active": true
            },
            {
                "ide": 300,
                "name": "Verónica Barragán Ramales",
                "position": "Profesora de asignatura \"B\"",
                "department": "P.E. de Contaduría (Tulcingo)",
                "active": true
            },
            {
                "ide": 302,
                "name": "Yarismin Montiel Colin",
                "position": "Técnica de Apoyo",
                "department": "P.E. de Contaduría",
                "active": true
            },
            {
                "ide": 303,
                "name": "Cesar Lucero Ayala",
                "position": "Profesor de asignatura \"B\"",
                "department": "P.E. de Agricultura Sustentable y Protegida",
                "active": true
            },
            {
                "ide": 305,
                "name": "Alfonso Felipe Lima Cortes",
                "position": "Profesor de asignatura \"B\"",
                "department": "P.E. de Tecnologías de la Información",
                "active": true
            },
            {
                "ide": 307,
                "name": "Edith Vargas Morales",
                "position": "Profesora de asignatura \"B\"",
                "department": "P.E. de Tecnologías de la Información",
                "active": true
            },
            {
                "ide": 309,
                "name": "Christian Gamez Valencia",
                "position": "Técnico de Apoyo",
                "department": "P.E. de Tecnologías de la Información",
                "active": true
            },
            {
                "ide": 311,
                "name": "Nathaly Solano Palapa",
                "position": "Profesora de Tiempo Completo Asociado \"A\"",
                "department": "P.E. de Administración",
                "active": true
            },
            {
                "ide": 315,
                "name": "Maritza Aguilar Pérez",
                "position": "Técnica Bibliotecaria",
                "department": "Departamento de Servicios Escolares",
                "active": true
            },
            {
                "ide": 319,
                "name": "Monserrat Fernández Carrera",
                "position": "Profesora de asignatura \"B\"",
                "department": "P.E. de Contaduría",
                "active": true
            },
            {
                "ide": 335,
                "name": "Oscar Diego Estudillo",
                "position": "Profesor de Tiempo Completo Asociado \"B\"",
                "department": "P.E. de Procesos Alimentarios",
                "active": true
            },
            {
                "ide": 338,
                "name": "Jaime Bazán Herrera",
                "position": "Jefe de Oficina",
                "department": "Departamento de Planeación y Evaluación",
                "active": true
            },
            {
                "ide": 340,
                "name": "Antonio Aguilar Galicia",
                "position": "Técnico de Apoyo",
                "department": "P.E. de Paramédico",
                "active": true
            },
            {
                "ide": 341,
                "name": "Monserrat Maritza Alonso Guzmán",
                "position": "Jefa de Oficina",
                "department": "Departamento de Recursos Materiales y Servicios Generales",
                "active": true
            },
            {
                "ide": 345,
                "name": "Agustín Vargas Vidals",
                "position": "Profesor de asignatura \"B\"",
                "department": "P.E. de Administración",
                "active": true
            },
            {
                "ide": 346,
                "name": "Leonardo Pérez Rosas",
                "position": "Encargado de Despacho del P.E. de Administración y Contaduría",
                "department": "P.E. de Administración y Contaduría",
                "active": true
            },
            {
                "ide": 348,
                "name": "Verónica Gobea Hernández",
                "position": "Técnica de Apoyo",
                "department": "P.E. de Procesos Alimentarios",
                "active": true
            },
            {
                "ide": 349,
                "name": "Adulfa Guerrero Martínez",
                "position": "Profesora de Tiempo Completo Asociado \"A\"",
                "department": "P.E. de Administración",
                "active": true
            },
            {
                "ide": 352,
                "name": "Cesar Merino Vega",
                "position": "Profesor de asignatura \"B\"",
                "department": "P.E. de Agricultura Sustentable y Protegida",
                "active": true
            },
            {
                "ide": 353,
                "name": "Carlos Manuel Peralta Benítez",
                "position": "Profesor de asignatura \"B\"",
                "department": "P.E. de Contaduría",
                "active": true
            },
            {
                "ide": 358,
                "name": "Jorge Vázquez Toribio",
                "position": "Técnico de Apoyo",
                "department": "P.E. de Tecnologías de la Información (tulcingo)",
                "active": true
            },
            {
                "ide": 359,
                "name": "Mario Alberto Ramírez Salas",
                "position": "Profesor de asignatura \"B\"",
                "department": "P.E. de Contaduría",
                "active": true
            },
            {
                "ide": 360,
                "name": "Pablo Cantorán Ramos",
                "position": "Ingeniero en sistemas",
                "department": "Subdirección de Servicios Administrativos",
                "active": true
            },
            {
                "ide": 365,
                "name": "José Galiel Solano Torres",
                "position": "Técnico de Apoyo",
                "department": "P.E. de Administración",
                "active": true
            },
            {
                "ide": 367,
                "name": "María de la Luz Ortega Barrera",
                "position": "Profesora de asignatura \"B\"",
                "department": "P.E. de Tecnologías de la Información",
                "active": true
            },
            {
                "ide": 373,
                "name": "José Manuel Hernández Delgado",
                "position": "Analista Administrativo",
                "department": "Departamento de Servicios Escolares",
                "active": true
            },
            {
                "ide": 375,
                "name": "Patricia Díaz Rincón",
                "position": "Secretaria de Director de área",
                "department": "P.E. Tecnologías de la Información y Lengua Inglesa",
                "active": true
            },
            {
                "ide": 384,
                "name": "Violeta Méndez Cardoso",
                "position": "Jefa de Oficina",
                "department": "Departamento de Servicios Escolares",
                "active": true
            },
            {
                "ide": 385,
                "name": "Luz Maria Acosta Gómez",
                "position": "Profesora de asignatura \"B\"",
                "department": "P.E. de Administración",
                "active": true
            },
            {
                "ide": 395,
                "name": "Rafael Ponce Ortíz",
                "position": "Profesor de asignatura \"B\"",
                "department": "P.E. de Agricultura Sustentable y Protegida",
                "active": true
            },
            {
                "ide": 396,
                "name": "Luis Roberto Vergara Guevara",
                "position": "Profesor de asignatura \"B\"",
                "department": "P.E. de Contaduría",
                "active": true
            },
            {
                "ide": 400,
                "name": "Iván Hernández Peregrina",
                "position": "Profesor de asignatura \"B\"",
                "department": "P.E. de Contaduría (Tulcingo)",
                "active": true
            },
            {
                "ide": 401,
                "name": "Mariana Rodríguez Ramales",
                "position": "Profesora de asignatura \"B\"",
                "department": "P.E. de Tecnologías de la Información (Tulcingo)",
                "active": true
            },
            {
                "ide": 403,
                "name": "Araceli Nava Rocha",
                "position": "Jefa de Oficina",
                "department": "P. E. Agrobiotecnología",
                "active": true
            },
            {
                "ide": 407,
                "name": "Ángel Venancio Luna Vazquez",
                "position": "Profesor de asignatura \"B\"",
                "department": "Actividades culturales y deportivas",
                "active": true
            },
            {
                "ide": 411,
                "name": "Hilario Toribio Romero",
                "position": "Profesor de Tiempo Completo Asociado \"A\"",
                "department": "P.E. de Agrobiotecnología",
                "active": true
            },
            {
                "ide": 412,
                "name": "Julio Cesar López Calderón",
                "position": "Profesor de Tiempo Completo Asociado \"C\"",
                "department": "P.E. de Agrobiotecnología",
                "active": true
            },
            {
                "ide": 413,
                "name": "Rosalva Salgado Bravo",
                "position": "Directora de Programa Educativo",
                "department": "P.E. de Agrobiotecnología y Agricultura Sustentable y Protegida",
                "active": true
            },
            {
                "ide": 415,
                "name": "Arturo Márquez Hernández",
                "position": "Profesor de asignatura \"B\"",
                "department": "P.E. de Lengua Inglesa",
                "active": true
            },
            {
                "ide": 416,
                "name": "Eusebio Vega Tenorio",
                "position": "Profesor de asignatura \"B\"",
                "department": "P.E. de Administración",
                "active": true
            },
            {
                "ide": 421,
                "name": "Dulce María Sosa García",
                "position": "Profesora de asignatura \"B\"",
                "department": "P.E. de Contaduría",
                "active": true
            },
            {
                "ide": 422,
                "name": "Oscar Morales Barranco",
                "position": "Profesor de asignatura \"B\"",
                "department": "P.E. de Tecnologías de la Información (Tulcingo)",
                "active": true
            },
            {
                "ide": 423,
                "name": "Lorena García Flores",
                "position": "Profesora de asignatura \"B\"",
                "department": "P.E. de Tecnologías de la Información (Tulcingo)",
                "active": true
            },
            {
                "ide": 425,
                "name": "Edgar Felipe Rendon",
                "position": "Abogado General",
                "department": "Abogado General",
                "active": true
            },
            {
                "ide": 426,
                "name": "Erik Reyes Moreno",
                "position": "Profesor de asignatura \"B\"",
                "department": "P.E. de Agrobiotecnología",
                "active": true
            },
            {
                "ide": 448,
                "name": "Omar Martínez Isidoro",
                "position": "Jefe de Oficina",
                "department": "Abogado General",
                "active": true
            },
            {
                "ide": 449,
                "name": "Cesar Enríquez Orea",
                "position": "Profesor de asignatura \"B\"",
                "department": "Actividades culturales y deportivas",
                "active": true
            },
            {
                "ide": 479,
                "name": "Aurora Rocío Alonso Guzmán",
                "position": "Jefa de Oficina",
                "department": "Secretaría Académica",
                "active": true
            },
            {
                "ide": 480,
                "name": "Deyanira Meredith Alarcón Bravo",
                "position": "Jefa de Oficina",
                "department": "Departamento de Contabilida",
                "active": true
            },
            {
                "ide": 484,
                "name": "Pedro García Pérez",
                "position": "Asistente de servicios y mantenimiento",
                "department": "P.E. de Procesos Alimentarios",
                "active": true
            },
            {
                "ide": 489,
                "name": "Efidelia Reyes Aquino",
                "position": "Jefa de Oficina",
                "department": "Departamento de Contabilida",
                "active": true
            },
            {
                "ide": 490,
                "name": "José Eduardo Pineda Pérez",
                "position": "Profesor de asignatura \"B\"",
                "department": "P.E. de Lengua Inglesa",
                "active": true
            },
            {
                "ide": 495,
                "name": "Edwin Hernández Vázquez",
                "position": "Profesor de asignatura \"B\"",
                "department": "P.E. de Tecnologías de la Información (Tulcingo)",
                "active": true
            },
            {
                "ide": 505,
                "name": "Gerardo González Adan",
                "position": "Profesor de Tiempo Completo Asociado \"A\"",
                "department": "P.E. de Contaduría ",
                "active": true
            },
            {
                "ide": 520,
                "name": "Grecia Maritza Montes Vázquez",
                "position": "Jefa de Departamento",
                "department": "Departamento de Recursos Materiales y Servicios Generales",
                "active": true
            },
            {
                "ide": 521,
                "name": "Elizabeth Balderas Domínguez",
                "position": "Profesora de asignatura \"B\"",
                "department": "P.E. de Administración",
                "active": true
            },
            {
                "ide": 523,
                "name": "Virginia Silva Díaz",
                "position": "Profesora de Tiempo Completo Asociado \"C\"",
                "department": "P.E. de Agricultura Sustentable y Protegida",
                "active": true
            },
            {
                "ide": 524,
                "name": "Gabriela Campos González",
                "position": "Encargada de Despacho de la Subdirección de Servicios Administrativos",
                "department": "Subdirección de Servicios Administrativos",
                "active": true
            },
            {
                "ide": 525,
                "name": "Olaf Flores Aguilar",
                "position": "Profesor de asignatura \"B\"",
                "department": "P.E. de contaduría",
                "active": true
            },
            {
                "ide": 528,
                "name": "Elizabeth Diaz Álvarez",
                "position": "Técnica de Apoyo",
                "department": "P.E. de Procesos Alimentarios",
                "active": true
            },
            {
                "ide": 532,
                "name": "Yucelli Osmara Menchaca Castillo",
                "position": "Secretaria de Jefe de Departamento",
                "department": "Departamento de Servicios Escolares",
                "active": true
            },
            {
                "ide": 537,
                "name": "Bardomiano Zenteno Hernández",
                "position": "Jefe de Servicios y Mantenimiento",
                "department": "Departamento de Recursos Materiales y Servicios Generales",
                "active": true
            },
            {
                "ide": 538,
                "name": "Agustina Guadalupe Ponce Quiroz",
                "position": "Técnica en Contabilidad",
                "department": "Departamento de Recursos Humanos",
                "active": true
            },
            {
                "ide": 539,
                "name": "Roberto Mendoza Domínguez",
                "position": "Técnico de Apoyo",
                "department": "P.E. de Agrobiotecnología",
                "active": true
            },
            {
                "ide": 541,
                "name": "Teodoro Ponce Gutiérrez",
                "position": "Profesor de asignatura \"B\"",
                "department": "Actividades culturales y deportivas",
                "active": true
            },
            {
                "ide": 548,
                "name": "Iván Geovanni Reyes Díaz",
                "position": "Profesor de asignatura \"B\"",
                "department": "Actividades culturales y deportivas",
                "active": true
            },
            {
                "ide": 556,
                "name": "Fanny Galeno Reyes",
                "position": "Profesora de asignatura \"B\"",
                "department": "P.E. de Paramédico",
                "active": true
            },
            {
                "ide": 559,
                "name": "Salomón Tapia Aguilar",
                "position": "Profesor de asignatura \"B\"",
                "department": "P.E. de Tecnologías de la Información",
                "active": true
            },
            {
                "ide": 583,
                "name": "Andrea Rebeca Chavez Alcaide",
                "position": "Secretaria de Director de Área",
                "department": "Secretaría de Administración y Finanzas",
                "active": true
            },
            {
                "ide": 605,
                "name": "Francisco Arriaga Herrera",
                "position": "Profesor de asignatura \"B\"",
                "department": "P.E. de Contaduría",
                "active": true
            },
            {
                "ide": 614,
                "name": "Homero Alberto Santos Arguelles",
                "position": "Chofer Administrativo",
                "department": "Departamento de Recursos Materiales y Servicios Generales",
                "active": true
            },
            {
                "ide": 617,
                "name": "Erika Herrera Enrriquez",
                "position": "Secretaria de Jefe de Departamento",
                "department": "Departamento de Contabilida",
                "active": true
            },
            {
                "ide": 618,
                "name": "Karla Ariana Flores Aguilar",
                "position": "Técnica en Contabilidad",
                "department": "Departamento de Contabilida",
                "active": true
            },
            {
                "ide": 620,
                "name": "Maritza Gómez Salamanca",
                "position": "Profesora de asignatura \"B\"",
                "department": "P.E. de Contaduría (Tulcingo)",
                "active": true
            },
            {
                "ide": 622,
                "name": "Blanca Margarita Alcaraz Espino",
                "position": "Profesora de asignatura \"B\"",
                "department": "P.E. de Tecnologías de la Información (Tulcingo)",
                "active": true
            },
            {
                "ide": 625,
                "name": "Ana Marlene Gallegos Magaña",
                "position": "Secretaria de Jefe de Departamento",
                "department": "Departamento de Recursos Humanos",
                "active": true
            },
            {
                "ide": 633,
                "name": "Erandi Vázquez Reyes",
                "position": "Profesora de asignatura \"B\"",
                "department": "P.E. de Administración",
                "active": true
            },
            {
                "ide": 635,
                "name": "Miguel Ángel Enríquez Orea",
                "position": "Profesor de asignatura \"B\"",
                "department": "P.E. de Tecnologías de la Información",
                "active": true
            },
            {
                "ide": 636,
                "name": "Samuel Eduardo Niño Hernández",
                "position": "Profesor de asignatura \"B\"",
                "department": "P.E. de Contaduría",
                "active": true
            },
            {
                "ide": 637,
                "name": "Julio Cesar Cisneros Ramírez",
                "position": "Profesor de asignatura \"B\"",
                "department": "P.E. de Paramédico",
                "active": true
            },
            {
                "ide": 639,
                "name": "Alexis Medina Neri",
                "position": "Técnico de Apoyo",
                "department": "P.E. De Contaduría (Tulcingo)",
                "active": true
            },
            {
                "ide": 640,
                "name": "Santiago Rafael Fuentes Márquez",
                "position": "Profesor de asignatura \"B\"",
                "department": "P.E. de Lengua Inglesa",
                "active": true
            },
            {
                "ide": 644,
                "name": "Cyndi Huerta Pérez",
                "position": "Secretaria de Jefe de Departamento",
                "department": "P.E. de Tecnologías de la Información (Tulcingo)",
                "active": true
            },
            {
                "ide": 645,
                "name": "Elizabeth Luna Aguilar",
                "position": "Secretaria  de Director de Área",
                "department": "Dirección de Vinculación",
                "active": true
            },
            {
                "ide": 646,
                "name": "Yareli Carranza Gutiérrez",
                "position": "Técnica de Apoyo",
                "department": "P.E. de Tecnologías de la Información",
                "active": true
            },
            {
                "ide": 650,
                "name": "Izchel Cordero Rodríguez",
                "position": "Profesora de asignatura \"B\"",
                "department": "P.E. de Tecnologías de la Información (Tulcingo)",
                "active": true
            },
            {
                "ide": 651,
                "name": "Yessica Rodríguez Monfil",
                "position": "Técnica de Apoyo",
                "department": "P.E. de Agrobiotecnología",
                "active": true
            },
            {
                "ide": 653,
                "name": "Manuel Isidro Galeno Tenorio",
                "position": "Técnico de Apoyo",
                "department": "P.E. de Tecnologías de la Información",
                "active": true
            },
            {
                "ide": 655,
                "name": "Mariano Erasto Castro Morán",
                "position": "Jefe de Servicios y Mantenimiento",
                "department": "Departamento de Recursos Materiales y Servicios Generales",
                "active": true
            },
            {
                "ide": 657,
                "name": "Lucía Salvador Mora",
                "position": "Profesora de asignatura \"B\"",
                "department": "P.E. de Paramédico",
                "active": true
            },
            {
                "ide": 658,
                "name": "Magnolia Morelos Gómez",
                "position": "Profesora de asignatura \"B\"",
                "department": "P.E. de Contaduría (Tulcingo)",
                "active": true
            },
            {
                "ide": 659,
                "name": "Erika Policao Avilés",
                "position": "Profesora de asignatura \"B\"",
                "department": "P.E. de Contaduría (Tulcingo)",
                "active": true
            },
            {
                "ide": 660,
                "name": "Zuleyma Reyes Flores",
                "position": "Profesora de asignatura \"B\"",
                "department": "P.E. de Contaduría (Tulcingo)",
                "active": true
            },
            {
                "ide": 661,
                "name": "Jonathan Hernández Infante",
                "position": "Chofer Administrativo",
                "department": "Departamento de Recursos Materiales y Servicios Generales",
                "active": true
            },
            {
                "ide": 662,
                "name": "Rodolfo Jorge Jarquín Rodríguez",
                "position": "Secretario de Jefe de Departamento",
                "department": "Departamento de Prens",
                "active": true
            },
            {
                "ide": 663,
                "name": "Jennyfer Andrea Mejía Madero",
                "position": "Profesor de asignatura \"B\"",
                "department": "P.E. de Tecnologías de la Información (Tulcingo)",
                "active": true
            },
            {
                "ide": 665,
                "name": "Gonzalo González López",
                "position": "Profesor de asignatura \"B\"",
                "department": "P.E. de Paramédico",
                "active": true
            },
            {
                "ide": 666,
                "name": "Javier Santiago Reyes",
                "position": "Rector",
                "department": "Rectoría",
                "active": true
            },
            {
                "ide": 667,
                "name": "Roel Abraham Morales Vázquez",
                "position": "Secretario de Administración y Finanzas",
                "department": "Secretaría de Administración y Finanzas",
                "active": true
            },
            {
                "ide": 669,
                "name": "Diana Karen Miguel Sánchez",
                "position": "Secretaria Académica",
                "department": "Secretaría Académica",
                "active": true
            },
            {
                "ide": 670,
                "name": "Eduardo Estanislao Sosa Negrete",
                "position": "Jefe de Departamento",
                "department": "Departamento de Prácticas y Estadías",
                "active": true
            },
            {
                "ide": 672,
                "name": "Edwin Oswaldo Ávila Morales",
                "position": "Encargado de Despacho de la Dirección de Vinculación",
                "department": "Dirección de Vinculación",
                "active": true
            },
            {
                "ide": 673,
                "name": "Héctor Gatica Guevara",
                "position": "Jefe de Departamento",
                "department": "Departamento de Actividades Culturales",
                "active": true
            },
            {
                "ide": 674,
                "name": "Josefina Contreras González",
                "position": "Jefa de Departamento",
                "department": "Departamento de Servicios Médicos",
                "active": true
            },
            {
                "ide": 677,
                "name": "Anel Selene Castillo Castillo",
                "position": "Jefa de Departamento",
                "department": "Departamento de Contabilida",
                "active": true
            },
            {
                "ide": 678,
                "name": "Dulce María Oliver Vázquez",
                "position": "Secretaria de Secretario",
                "department": "Secretaría de Administración y Finanzas",
                "active": true
            },
            {
                "ide": 679,
                "name": "María Asucena Solano Torres",
                "position": "Jefa de Departamento",
                "department": "Jefa del Departamento de información y Estadística",
                "active": true
            },
            {
                "ide": 681,
                "name": "Alexis Emmanuel Martínez Lezama",
                "position": "Coordinador",
                "department": "Departamento de Servicios Escolares",
                "active": true
            },
            {
                "ide": 682,
                "name": "Leonel Hernández Barrales",
                "position": "Jefe de Oficina",
                "department": "Departamento de Prens",
                "active": true
            },
            {
                "ide": 683,
                "name": "Marco Antonio Hernández España",
                "position": "Analista Administrativo",
                "department": "Departamento de Prens",
                "active": true
            },
            {
                "ide": 684,
                "name": "Natanahel Jaimes Herrera",
                "position": "Secretario de Jefe de Departamento",
                "department": "Departamento de Servicios Médicos",
                "active": true
            },
            {
                "ide": 685,
                "name": "Aldair Alfonso Castaneira Castillo",
                "position": "Jefe de Oficina",
                "department": "Secretaría de Administración y Finanzas",
                "active": true
            },
            {
                "ide": 686,
                "name": "Lizbeth Rodríguez Martínez",
                "position": "Secretaria de Jefe de Departamento",
                "department": "Departamento de información y Estadística",
                "active": true
            },
            {
                "ide": 687,
                "name": "Yahadira Ruíz Martínez",
                "position": "Profesora de asignatura \"B\"",
                "department": "P.E. de Agrobiotecnología",
                "active": true
            },
            {
                "ide": 688,
                "name": "Miroslava Juliana Mendieta Sanchez",
                "position": "Encargada de Despacho de la Subdirección de Extencion ",
                "department": "Subdirección de Extencion ",
                "active": true
            },
            {
                "ide": 689,
                "name": "Eva Lucero Romero",
                "position": "Profesora de asignatura \"B\"",
                "department": "P.E. de Tecnologías de la Información (Tulcingo)",
                "active": true
            },
            {
                "ide": 690,
                "name": "Giovanni Galeno Reyes",
                "position": "Profesor de asignatura \"B\"",
                "department": "P.E. de Tecnologías de la Información",
                "active": true
            },
            {
                "ide": 691,
                "name": "MIREYA IBOND ORTEGA BALBUENA",
                "position": "PROFESOR DE ASIGNATURA \"B\"",
                "department": "ACTIVIDADES CULTURALES Y DEPORTIVAS",
                "active": true
            },
            {
                "ide": 692,
                "name": "MARIO ALBERTO ROJAS MAGAÑA",
                "position": "PROFESOR DE ASIGNATURA \"B\"",
                "department": "ACTIVIDADES CULTURALES Y DEPORTIVAS",
                "active": true
            },
            {
                "ide": 693,
                "name": "JULIO LEÓN MIJANGOS",
                "position": "PROFESOR DE ASIGNATURA \"B\"",
                "department": "ACTIVIDADES CULTURALES Y DEPORTIVAS",
                "active": true
            },
            {
                "ide": 694,
                "name": "GERMÁN PACHECO SÁNCHEZ",
                "position": "PROFESOR DE ASIGNATURA \"B\"",
                "department": "ACTIVIDADES CULTURALES Y DEPORTIVAS",
                "active": true
            },
            {
                "ide": 643,
                "name": "MIRAM FLORES DE LA ROSA",
                "position": "",
                "department": "",
                "active": true
            },
            {
                "ide": 647,
                "name": "CLAUDIO RUBERN CADENA AMARO",
                "position": "",
                "department": "",
                "active": true
            },
            {
                "ide": 20,
                "name": "ALBERTO ALEJANDRO HERNANDO MORALES",
                "position": "DEPARTAMENTO DE RECURSOS MATERIALES Y SERVICIOS GENERALE",
                "department": "ndefine",
                "active": true
            },
            {
                "ide": 25,
                "name": "MARÍA EUGENIA ANDRADE BERNABÉ",
                "position": "DEPARTAMENTO DE PRÁCTICAS Y ESTADÍAS\r",
                "department": "JEFE (A) DE OFICINA\r",
                "active": true
            },
            {
                "ide": 32,
                "name": "YONATAN ERIC CRUZ HERNÁNDEZ",
                "position": "P.E. DE TIC. ÁREA DE SISTEMAS INFORMÁTICOS",
                "department": "ndefine",
                "active": true
            },
            {
                "ide": 53,
                "name": "ELIZABETH MUÑOZ RENDÓN",
                "position": "DEPARTAMENTO DE INFORMACIÓN Y ESTADÍSTICA\r",
                "department": "JEFE DE DEPARTAMENTO\r",
                "active": true
            },
            {
                "ide": 87,
                "name": "MARCELA GARCÍA ALONSO",
                "position": "SECRETARÍA ACADÉMICA\r",
                "department": "SECRETARIO  (A) ACADÉMICO\r",
                "active": true
            },
            {
                "ide": 90,
                "name": "ENRIQUE ROMERO JIMENEZ",
                "position": "SUBDIRECCION DE SERVICIOS ADMINISTRATIVO",
                "department": "ndefine",
                "active": true
            },
            {
                "ide": 93,
                "name": "MARGARITO BARBOZA CARRASCO",
                "position": "RECTORI",
                "department": "ndefine",
                "active": true
            },
            {
                "ide": 153,
                "name": "JAIR MENDOZA ALTAMIRANO",
                "position": "DEPARTAMENTO DE ACTIVIDADES CULTURALES Y DEPORTIVAS",
                "department": "JEFE DE DEPARTAMENTO\r",
                "active": true
            },
            {
                "ide": 159,
                "name": "NAVOR NAVARRO ROMERO",
                "position": "DEPARTAMENTO DE SERVICIOS MEDICO",
                "department": "ndefine",
                "active": true
            },
            {
                "ide": 198,
                "name": "ROCIO JUÁREZ URAGA",
                "position": "DEPARTAMENTO DE CONTABILIDA",
                "department": "ROGRAMACIÓN Y PRESUPUESTO",
                "active": true
            },
            {
                "ide": 270,
                "name": "MARÍA DEL SOCORRO PEÑA VEGA",
                "position": "SUBDIRECCION DE EXTENSIÓN UNIVERSITARI",
                "department": "ndefine",
                "active": true
            },
            {
                "ide": 273,
                "name": "JUAN CARLOS PARRA GUZMAN",
                "position": "SUBDIRECCION DE EXTENSIÓN UNIVERSITARI",
                "department": "ndefine",
                "active": true
            },
            {
                "ide": 286,
                "name": "DULCE MARIA CORONEL SORIANO",
                "position": "DEPARTAMENTO DE SERVICIOS ESCOLARE",
                "department": "ndefine",
                "active": true
            },
            {
                "ide": 325,
                "name": "MARÍA GUADALUPE BARRAGAN RAMÍREZ",
                "position": "P.E. DE PARAMÉDICO\r",
                "department": "SECRETARIA (O) DE DIRECTOR DE Area\r",
                "active": true
            },
            {
                "ide": 369,
                "name": "JOSÉ ROBERTO AMBRIZ VARGAS",
                "position": "P.E. DE PARAMÉDICO\r",
                "department": "TÉCNICO DE APOY",
                "active": true
            },
            {
                "ide": 454,
                "name": "JULIO GUADALUPE LOPEZ PICHARDO",
                "position": "UNIDAD ACADÉMICA DE TULCINGO DE VALL",
                "department": "ndefine",
                "active": true
            },
            {
                "ide": 530,
                "name": "FERNANDO  HERRERA ALVAREZ",
                "position": "P.E. DE AGROBIOTECNOLOGÍA\r",
                "department": "TÉCNICO DE APOY",
                "active": true
            },
            {
                "ide": 612,
                "name": "CESAR ALEJANDRO LOPEZ SANTOS",
                "position": "DEPARTAMENTO DE PRENSA COMUNICACIÓN Y DIFUSIÓN\r",
                "department": "JEFE DE DEPARTAMENTO\r",
                "active": true
            },
            {
                "ide": 615,
                "name": "NESTOR JORGE GONZALEZ ESTRADA",
                "position": "DEPARTAMENTO DE RECURSOS MATERIALES Y SERVICIOS GENERALE",
                "department": "ndefine",
                "active": true
            },
            {
                "ide": 626,
                "name": "JAIRO MORAN RODRIGUEZ",
                "position": "P.E. DE ADMINISTRACIÓN\r",
                "department": "TÉCNICO DE APOY",
                "active": true
            },
            {
                "ide": 628,
                "name": "JORGE HUMBERTO LEYVA GARCIA",
                "position": "P.E. DE TIC. ÁREA DE SISTEMAS INFORMÁTICOS",
                "department": "",
                "active": true
            },
            {
                "ide": 631,
                "name": "JOSÉFRANCISCO RODRÍGUEZ DOMÍNGUEZ",
                "position": "ABOGADO GENERAL",
                "department": "ABOGADO GENERAL\r",
                "active": true
            },
            {
                "ide": 648,
                "name": "JOSÉ ORTEGA CAAMAÑO",
                "position": "DIRECCIÓN DE VINCULACIÓN\r",
                "department": "SECRETARIA (O) DE DIRECTOR DE Area\r",
                "active": true
            },
            {
                "ide": 652,
                "name": "EMELIA MARLEY AVENDAÑO RAMÍREZ",
                "position": "DEPARTAMENTO DE SERVICIOS ESCOLARE",
                "department": "",
                "active": true
            },
            {
                "ide": 654,
                "name": "SAMUEL GONZÁLEZ ROMANO",
                "position": "DEPARTAMENTO DE RECURSOS MATERIALES Y SERVICIOS GENERALES",
                "department": "",
                "active": true
            },
            {
                "ide": 668,
                "name": "HÉCTOR GUEVARA  DELGADILLO",
                "position": "DIRECCIÓN DE VINCULACIÓN\r",
                "department": "DIRECTOR (A) DE VINCULACIÓN\r",
                "active": true
            },
            {
                "ide": 675,
                "name": "ALFONSO  TORRES  MEJÍA",
                "position": "DIRECCIÓN DE VINCULACIÓN\r",
                "department": "COORDINADOR (A)\r",
                "active": true
            },
            {
                "ide": 676,
                "name": "DIEGO ISAID LIMÓN  HUERTA",
                "position": "SECRETARÍA DE ADMINISTRACIÓN Y FINANZAS",
                "department": "JEFE (A) DE OFICINA\r",
                "active": true
            },
            {
                "ide": 680,
                "name": "CARLOS ALBERTO MARTINEZ TRIGO",
                "position": "DEPARTAMENTO DE RECURSOS HUMANO",
                "department": "ndefine",
                "active": true
            },
            {
                "ide": 84,
                "name": "VERONICA GUTIERREZ OCAMPO",
                "position": "",
                "department": "",
                "active": true
            },
            {
                "ide": 114,
                "name": "JOSÉ RAYMUNDO CEJA VAZQUEZ",
                "position": "",
                "department": "",
                "active": true
            },
            {
                "ide": 86,
                "name": "GONZALO ROSAS CABRERA",
                "position": "",
                "department": "",
                "active": true
            },
            {
                "ide": 195,
                "name": "ALEJANDRA MORAN RODRIGUEZ",
                "position": "",
                "department": "",
                "active": true
            },
            {
                "ide": 82,
                "name": "SERGIO VALERO OREA",
                "position": "",
                "department": "",
                "active": true
            },
            {
                "ide": 621,
                "name": "MARIA ANGELICA HERRERA",
                "position": "",
                "department": "",
                "active": true
            },
            {
                "ide": 31,
                "name": "CESAR ESPINOZA JIMENEZ",
                "position": "",
                "department": "",
                "active": true
            },
            {
                "ide": 321,
                "name": "JOSE ANTONIO ALONSO GOMEZ",
                "position": "",
                "department": "",
                "active": true
            },
            {
                "ide": 219,
                "name": "ISAIS FORTOSO TAPIA",
                "position": "",
                "department": "",
                "active": true
            },
            {
                "ide": 327,
                "name": "AGUSTIN ARRIAGA CORTEZANO",
                "position": "",
                "department": "",
                "active": true
            },
            {
                "ide": 254,
                "name": "LIDUVINA PEREZ ROSENDO",
                "position": "",
                "department": "",
                "active": true
            },
            {
                "ide": 185,
                "name": "JAIME VAZQUEZ MARTINEZ",
                "position": "",
                "department": "",
                "active": true
            },
            {
                "ide": 154,
                "name": "JOSE VARGAS HERNANDEZ",
                "position": "",
                "department": "",
                "active": true
            },
            {
                "ide": 156,
                "name": "CECILIA AZUCENA RODRIGUEZ ESPINOZA",
                "position": "",
                "department": "",
                "active": true
            },
            {
                "ide": 290,
                "name": "PATRICIA GARCIA MORUA",
                "position": "",
                "department": "",
                "active": true
            },
            {
                "ide": 363,
                "name": "CARMEN CERVANTES RAMIREZ",
                "position": "",
                "department": "",
                "active": true
            },
            {
                "ide": 291,
                "name": "JAIR MEDINA DELGADO",
                "position": "",
                "department": "",
                "active": true
            },
            {
                "ide": 13,
                "name": "VICTOR ALEJANDRO LUNA DIAZ",
                "position": "",
                "department": "",
                "active": true
            },
            {
                "ide": 616,
                "name": "JUAN CARLOS CASTILLO VALENCIA",
                "position": "",
                "department": "",
                "active": true
            },
            {
                "ide": 619,
                "name": "SAMANTHA RODRIGUEZ ZARATE",
                "position": "",
                "department": "",
                "active": true
            },
            {
                "ide": 624,
                "name": "JAHAZIEL JEUH  BALTAZAR ISIDORO",
                "position": "",
                "department": "",
                "active": true
            },
            {
                "ide": 629,
                "name": "LEONOR SARAI MELLON RAMOS",
                "position": "",
                "department": "",
                "active": true
            },
            {
                "ide": 630,
                "name": "ROLANDO TAPIA LOPEZ",
                "position": "",
                "department": "",
                "active": true
            },
            {
                "ide": 376,
                "name": "MARILU GUADALUPE HERNANDEZ CABRERA",
                "position": "",
                "department": "",
                "active": true
            },
            {
                "ide": 324,
                "name": "MARIA CECILIA LOPEZ CIELO",
                "position": "",
                "department": "",
                "active": true
            },
            {
                "ide": 485,
                "name": "ANGELICA MARIA VALES CORTES",
                "position": "",
                "department": "",
                "active": true
            },
            {
                "ide": 462,
                "name": "GAUDENCIO HERRERA GARCIA",
                "position": "",
                "department": "",
                "active": true
            },
            {
                "ide": 649,
                "name": "ENRIQUE NAVARRETE RODRIGUEZ",
                "position": "",
                "department": "",
                "active": true
            },
            {
                "ide": 106,
                "name": "SERGIO GARZON RODRIGUEZ",
                "position": "",
                "department": "",
                "active": true
            },
            {
                "ide": 656,
                "name": "MARIA DE LOS ANGELES BLAS GERMAN",
                "position": "",
                "department": "",
                "active": true
            },
            {
                "ide": 664,
                "name": "DELIA ENRIQUEZ OREA",
                "position": "",
                "department": "",
                "active": true
            }
        ]
        const newDatas = datas.map(data => {
            return ({
                ide: data.ide,
                name: data.name,
                position: data.position,
                area: data.department,
                active: data.active
            })
        })
        console.log(JSON.stringify(newDatas))
    }, [])
    return (
        <div className="flex flex-col items-center justify-center">
            <h1 className="text-1xl font-bold text-center text-utim tracking-widest capitalize p-2 m-2">Crear nueva plantilla</h1>
            <div className="flex flex-col gap-2 object-fill w-5/6 sm:w-2/3">
                <YearSelectorAlter />
                <ModalError error={error} />
                <Select
                    isRequired
                    items={areas}
                    title="Area"
                    placeholder="Area a la que pertenece la plantilla"
                    label='Area'
                    disallowEmptySelection
                    onSelectionChange={(area) => {
                        setTemplate({ ...template, areaId: Number(area.anchorKey) })
                        console.log(template)
                    }}
                >
                    {
                        (area) => (
                            <SelectItem key={area.id} variant="flat">{area.name}</SelectItem>
                        )
                    }
                </Select>
                {
                    template.id ?? (
                        <div className="flex gap-2 text-utim">
                            Estado :
                            <Chip isDisabled={!(template.id) ?? true} color={templateStatus.color}>
                                {templateStatus.name}
                            </Chip>
                        </div>
                    )
                }
                <Button
                    startContent={
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>
                    }
                    isDisabled={template.areaId === ''}
                    className="bg-utim"
                    onPress={handleSubmit}
                >
                    Crear plantilla
                </Button>
            </div>
        </div>
    )
}