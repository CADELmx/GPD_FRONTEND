import { AcademicTemplateForm } from "@/components/AcademicTemplateForm"
import { ModalError } from "@/components/ModalError"
import { getEducationalPrograms } from "@/models/transactions/educational-program"
import { getAllPersonalData } from "@/models/transactions/personal-data"
import { EducationalProgram } from "@/models/types/educational-program"
import { PersonalData } from "@/models/types/personal-data"


export default function Index(
  { educationalPrograms, academicWorkers, getSsrError }: {
    educationalPrograms: EducationalProgram[],
    academicWorkers: PersonalData[],
    getSsrError: string | null
  }
) {
  return (
    <>
      <h1 className="text-1xl font-bold text-center text-utim tracking-widest capitalize p-2 m-2">llenado de plantilla</h1>
      <ModalError error={getSsrError} />
      <AcademicTemplateForm educationalPrograms={educationalPrograms} academicWorkers={academicWorkers} />
    </>
  )
}

export const getStaticProps = async () => {
  const eduPromise = getEducationalPrograms()
  const acaPromise = getAllPersonalData()
  const [educationalResponse, academicResponse] = await Promise.all([eduPromise, acaPromise])
  const { data: academicData } = academicResponse
  const { data: educationalData } = educationalResponse
  const error = educationalData.error || academicData.error
  if (error) {
    console.error('#ERROR# Error al obtener datos de programas educativos y/o trabajadores')
  }
  return {
    revalidate: 1,
    props: {
      getSsrError: error ? 'Algo salió mal, recarga la página' : null,
      educationalPrograms: educationalData.data,
      academicWorkers: academicData.data,
    }
  }
}
