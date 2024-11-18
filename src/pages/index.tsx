
import { getEducationalPrograms } from "../models/transactions/educational-program";
import { getAllPersonalData } from "../models/transactions/personal-data";
import { promiseResolver } from "../utils";
import { ModalError } from "../components/ModalError";
import { AcademicTemplateForm } from "../components/AcademicTemplateForm";

export default function Index({ educationalPrograms, academicWorkers, getSsrError }) {
  return (
    <>
      <h1 className="text-1xl font-bold text-center text-utim tracking-widest capitalize p-2 m-2">llenado de plantilla</h1>
      <ModalError error={getSsrError} />
      <AcademicTemplateForm educationalPrograms={educationalPrograms} academicWorkers={academicWorkers} template={null} />
    </>
  )
}

export const getStaticProps = async () => {
  const eduPromise = getEducationalPrograms()
  const acaPromise = getAllPersonalData()
  const [educationalResponse, academicResponse] = await promiseResolver([eduPromise, acaPromise])
  const { data: academicData } = academicResponse
  const { data: educationalData } = educationalResponse
  console.log(educationalData, academicData)
  const error = educationalData.error || academicData.error
  if (error) {
    console.error('#ERROR# Error al obtener datos de programas educativos y/o trabajadores')
  }
  return {
    revalidate: 3,
    props: {
      getSsrError: error ? 'Algo salió mal, recarga la página' : null,
      educationalPrograms: educationalData.data,
      academicWorkers: academicData.data,
    }
  }
}
