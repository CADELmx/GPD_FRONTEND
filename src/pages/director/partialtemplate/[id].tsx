import { useRouter } from "next/router"
import { getTemplate, getTemplates } from "../../../models/transactions/templates"
import { Template } from "../../../models/types/template"
import { AcademicTemplateForm } from "../../../components/AcademicTemplateForm"
import { getEducationalPrograms } from "../../../models/transactions/educational-program"
import { EducationalProgram } from "../../../models/types/educational-program"
import { useEffect } from "react"
import { UseSecretary, UseTemplates } from "../../../context"
import { getAllPersonalData } from "../../../models/transactions/personal-data"
import { PersonalData } from "../../../models/types/personal-data"

export const getStaticPaths = async () => {
    const { data: { data, error } } = await getTemplates()
    if (error || data.length === 0) {
        return {
            paths: [],
            fallback: true
        }
    }
    const paths = data.map(({ id }) => ({ params: { id: id.toString() } }))
    return {
        paths,
        fallback: true
    }
}

export const getStaticProps = async ({ params: { id } }: { params: { id: string } }) => {
    const templatePromise = getTemplate({ id: Number(id) })
    const educationalPromise = getEducationalPrograms()
    const personalDataPromise = getAllPersonalData()
    const responses = await Promise.all([
        templatePromise,
        educationalPromise,
        personalDataPromise
    ])
    const [
        templateResponse,
        educationalResponse,
        personalDataResponse
    ] = responses
    const errorResponses = responses.every(({ data, status }) => !data.error || status !== 200)
    const { data: { data: TemplateData } } = templateResponse
    const { data: { data: EducationalData } } = educationalResponse
    const { data: { data: PersonalData } } = personalDataResponse
    const error = errorResponses ? 'Error al cargar plantilla o programas educativos, carga de nuevo la página' : null
    return {
        props: {
            error: error,
            template: TemplateData,
            educationalPrograms: EducationalData,
            personalData: PersonalData
        }
    }
}

export default function DirectorPartialTemplate({
    template: ssrTemplate,
    educationalPrograms: ssrEducationalPrograms,
    personalData: ssrPersonalData
}: {
    template: Template,
    educationalPrograms: EducationalProgram[],
    personalData: PersonalData[],
}) {
    const {
        educationalState: { educationalPrograms }, setStoredEducationalPrograms,
        setStoredTemplates
    } = UseSecretary()
    const router = useRouter()
    if (router.isFallback) {
        return (<div>...loading</div>)
    }
    useEffect(() => {
        setStoredEducationalPrograms({
            educationalPrograms: ssrEducationalPrograms
        })
        setStoredTemplates({
            selectedTemplate: ssrTemplate
        })
    }, [])

    return (
        <>
            <AcademicTemplateForm
                academicWorkers={ssrPersonalData}
                educationalPrograms={educationalPrograms}
                template={ssrTemplate}
            />
        </>
    )
}