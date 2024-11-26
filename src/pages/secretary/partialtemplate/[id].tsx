import { AcademicTemplateForm } from "@/components/AcademicTemplateForm"
import { ModalError } from "@/components/ModalError"
import { generateSingleRecord } from "@/models/apiClient"
import { getEducationalPrograms } from "@/models/transactions/educational-program"
import { getAllPersonalData } from "@/models/transactions/personal-data"
import { getTemplates } from "@/models/transactions/templates"
import { EducationalProgram } from "@/models/types/educational-program"
import { PartialTemplate } from "@/models/types/partial-template"
import { PersonalData } from "@/models/types/personal-data"
import { useRouter } from "next/router"

export default function SecretaryPartialTemplate({ template, error, educationalPrograms, academicWorkers }: {
    template: PartialTemplate,
    error: string | null,
    educationalPrograms: EducationalProgram[],
    academicWorkers: PersonalData[],
}) {
    const router = useRouter()
    if (router.isFallback) {
        return <h1>Loading...</h1>
    }
    return (
        <>
            <ModalError error={error} />
            <AcademicTemplateForm academicWorkers={academicWorkers} educationalPrograms={educationalPrograms} template={template} />
        </>
    )
}

export const getStaticPaths = async () => {
    const { data: { data, error } } = await getTemplates()
    if (error || data.length === 0) {
        return {
            paths: [],
            fallback: true,
        }
    }
    const paths = data.map(({ id }) => ({ params: { id: id.toString() } }))
    return {
        paths,
        fallback: true,
    }
}

export const getStaticProps = async ({ params: { id } }: { params: { id: string } }) => {
    const eduPromise = getEducationalPrograms()
    const acaPromise = getAllPersonalData()
    const [educationalResponse, academicResponse] = await Promise.all([eduPromise, acaPromise])
    const { data: educationalData } = educationalResponse
    const { data: academicData } = academicResponse
    const { props } = await generateSingleRecord({ id: Number(id) })
    const error = educationalData.error || academicData.error || props.error
    return {
        revalidate: 3,
        props: {
            ...props,
            error: error ? 'Algo salió mal, recarga la página' : null,
            academicWorkers: academicData.data,
            educationalPrograms: educationalData.data,
        }
    }
}