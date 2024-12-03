import { AcademicTemplateForm } from "@/components/AcademicTemplateForm"
import { UseSecretary } from "@/context"
import { getEducationalPrograms } from "@/models/transactions/educational-program"
import { getAllPersonalData } from "@/models/transactions/personal-data"
import { getTemplate, getTemplates } from "@/models/transactions/templates"
import { EducationalProgram } from "@/models/types/educational-program"
import { PersonalData } from "@/models/types/personal-data"
import { Template } from "@/models/types/template"
import { generatePaths } from "@/utils/routes"
import { useRouter } from "next/router"
import { useEffect } from "react"

export const getStaticPaths = async () => {
    const { data: { data, error } } = await getTemplates()
    const { fallback, paths } = generatePaths({
        data, error
    })
    return {
        fallback,
        paths
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
        partialTemplateState: { selectedPartialTemplate },
        educationalState: { educationalPrograms }, setStoredEducationalPrograms,
        setStoredTemplates,
        setStoredPartialTemplates,
    } = UseSecretary()
    const router = useRouter()

    useEffect(() => {
        setStoredEducationalPrograms({
            educationalPrograms: ssrEducationalPrograms
        })
        setStoredTemplates({
            selectedTemplate: ssrTemplate
        })
        const selectedPeriod = ssrTemplate.period.split(':')[0]
        setStoredPartialTemplates({
            selectedPartialTemplate: {
                ...selectedPartialTemplate,
                year: selectedPeriod.substring(selectedPeriod.length - 4, selectedPeriod.length),
                period: ssrTemplate.period,
                templateId: Number(ssrTemplate.id)
            }
        })
    }, [])

    if (router.isFallback) {
        return (<div>...loading</div>)
    }
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