import { useRouter } from "next/router"
import { getTemplate, getTemplates } from "../../../models/transactions/templates"
import { Template } from "../../../models/types/template"

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
    const { data: { data, error, message } } = await getTemplate({ id: Number(id) })
    return {
        props: {
            error: error ? message : null,
            template: data
        }
    }
}

export default function DirectorPartialTemplate({ template: ssrTemplate }: { template: Template }) {
    console.log(ssrTemplate)
    const router = useRouter()
    if (router.isFallback) {
        return (<div>...loading</div>)
    }
    return (
        <div className="bg-utim">
            {ssrTemplate.period}
        </div>
    )
}