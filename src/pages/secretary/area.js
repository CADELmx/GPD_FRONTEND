import { getAreas } from "@/models/transactions"

export const getServerSideProps = async () => {
    const { data: { data, error } } = await getAreas()
    return {
        props: {
            areas: data,
            error
        }
    }
}

export default function Areas({ areas, error }) {
    return (
        <div>
            <h1>Áreas</h1>
            <ul>
                {areas.map((area) => (
                    <li key={area.id}>{area.name}</li>
                ))}
            </ul>
        </div>
    )
}