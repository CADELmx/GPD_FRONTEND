import { AcademicTemplateForm } from "@/components/AcademicTemplateForm";
import { ModalError } from "@/components/ModalError";
import { AxiosAbtraction, getAcademicPrograms, getAllAcademicWorkers } from "@/models/transactions";
import { promiseResolver } from "@/utils";

export default function Index({ academicPrograms, academicWorkers, getSsrError }) {
  return (
    <>
      <h1 className="text-2xl font-bold text-center text-utim tracking-widest capitalize p-2 m-2">Crear plantilla</h1>
      <ModalError error={getSsrError} />
      <AcademicTemplateForm academicPrograms={academicPrograms} academicWorkers={academicWorkers} />
    </>
  )
}

export const getStaticProps = async () => {
  const eduPromise =AxiosAbtraction(getAcademicPrograms())
  const acaPromise = AxiosAbtraction(getAllAcademicWorkers())
  const [educationalData, academicData] = await promiseResolver([eduPromise, acaPromise])
  const error = educationalData.error || academicData.error
  if (error) {
    console.error('#ERROR# Error al obtener datos de programas educativos y/o trabajadores')
  }
  return {
    revalidate: 3,
    props: {
      getSsrError: error ? 'Algo salió mal, recarga la página' : null,
      academicPrograms: educationalData.data,
      academicWorkers: academicData.data,
    }
  }
}
