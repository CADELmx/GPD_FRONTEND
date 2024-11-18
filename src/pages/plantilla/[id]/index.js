import { AcademicTemplateForm } from "@/components/AcademicTemplateForm"
import { ModalError } from "@/components/ModalError"
import { generateSingleRecord, getAcademicPrograms, getAllPersonalData, getTemplates } from "@/models/transactions"
import { promiseResolver } from "@/utils"

export default function TemplateById({ plantilla, getSsrError, academicPrograms, academicWorkers }) {
    return (
        <>
            <ModalError error={getSsrError} />
            <AcademicTemplateForm academicWorkers={academicWorkers} academicPrograms={academicPrograms} template={plantilla} />
        </>
    )
}

export const getStaticPaths = async () => {
    const { data: { data, error }, error: axiosError } = await getTemplates()
    if (error || axiosError) {
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

export const getStaticProps = async ({ params: { id } }) => {
    const eduPromise = getAcademicPrograms()
    const acaPromise = getAllPersonalData()
    const [educationalResponse, academicResponse] = await promiseResolver([eduPromise, acaPromise])
    const { data: educationalData } = educationalResponse
    const { data: academicData } = academicResponse
    const { props } = await generateSingleRecord(id)
    const error = educationalData.error || academicData.error || props.error
    return {
        revalidate: 3,
        props: {
            ...props,
            getSsrError: error ? 'Algo salió mal, recarga la página' : null,
            academicWorkers: academicData.data,
            academicPrograms: educationalData.data,
        }
    }
}