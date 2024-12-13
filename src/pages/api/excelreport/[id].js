import { generateWorkSheet, serverClient, setupWorkSheet } from "."

const getPartialTemplateJoinActivity = async (id) => {
    return serverClient.get(`/partial-templates/activities`, {
        params: { id }
    })
}

export default async function handler(req, res) {
    const { id } = req.query
    const { data: { data, error }, status } = await getPartialTemplateJoinActivity(id)
    if (status !== 200) {
        return res.status(500).json({ error: 'Error al obtener los datos de la plantilla' })
    }
    if (error) {
        return res.status(500).json({ error: 'Error al obtener los datos de la plantilla' })
    }
    if (data.length === 0) {
        return res.status(404).json({ error: 'No se encontraron datos' })
    }
    try {
        const record = data[0]
        const { workbook, worksheet, cellType } = generateWorkSheet()
        record.activities.forEach((act, i) => setupWorkSheet(act, i, cellType))
        worksheet.cell(3, 16, 7, 16, true).number(record.total)
        const buffer = await workbook.writeToBuffer()
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
        return res.send(buffer)
    } catch (error) {
        return res.status(500).json({ error: 'Error al generar el archivo' })
    }
}