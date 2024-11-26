import { getTemplate, getTemplates } from "@/models/transactions/templates";
import { Template } from "@/models/types/template";
import { useRouter } from "next/router";

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
    const { data: { data: template, error } } = await getTemplate({ id: Number(id) })
    return {
        revalidate: 3,
        props: {
            template,
            error
        }
    }
}

export default function DirectorTemplateById({ template: ssrTemplate }: { template: Template }) {
    const router = useRouter()
    if (router.isFallback) {
        return <h1>Loading...</h1>
    }
    return (
        <div>
            <h1>{ssrTemplate.period}</h1>
            <h1>Estado: {ssrTemplate.state}</h1>
        </div>
    )
}