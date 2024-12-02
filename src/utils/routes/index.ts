import { Area } from "../../models/types/area"
import { Comment } from "../../models/types/comment"
import { EducationalProgram } from "../../models/types/educational-program"
import { PartialTemplate } from "../../models/types/partial-template"
import { Subject } from "../../models/types/subject"
import { Template } from "../../models/types/template"

interface DataToGeneratePaths {
    data: Template[] | Area[] | Subject[] | PartialTemplate[] | EducationalProgram[] | Comment[],
    error: string | null
}

export const generatePaths = ({ data, error }: DataToGeneratePaths) => {
    const fallback = true
    if (error || data.length === 0) return {
        paths: [],
        fallback
    }
    const paths = data.map(({ id }) => ({ params: { id: id.toString() } }))
    return {
        paths,
        fallback
    }

}