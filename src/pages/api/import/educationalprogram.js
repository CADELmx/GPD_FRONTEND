
import { IncomingForm } from "formidable"
import { readFile, writeFile } from "fs/promises"

export const config = {
    api: {
        bodyParser: false,
        responseLimit: '50000mb',
    }
}

const formidableParse = async (req) =>
    new Promise((resolve, reject) =>
        new IncomingForm().parse(req, (err, fields, files) => err ? reject(err) : resolve([fields, files]))
    )

async function readAndWriteFile({ originalFilename, filepath }, newPath) {
    try {
        const path = `${newPath}/${originalFilename}`
        const data = await readFile(filepath)
        await writeFile(path, data)
        return 'ok'
    } catch (error) {
        console.log(error.message)
        return 'error'
    }
}

export default async function (req, res) {
    const [_, { file }] = await formidableParse(req)
    const status = await readAndWriteFile(file[0], './public/uploads')
    if (status === 'error') {
        return res.status(500).json({ error: { code: 500, message: 'Algo salió mal' } })
    }
    if (status === 'ok') {
        return res.status(200).json({ message: 'Archivo subido correctamente' })
    }
}
