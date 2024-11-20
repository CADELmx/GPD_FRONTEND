
import formidable, { IncomingForm } from "formidable"
import { readFile, writeFile } from "fs/promises"
import { NextApiRequest, NextApiResponse } from "next"

export const config = {
    api: {
        bodyParser: false,
        responseLimit: '50000mb',
    }
}

const formidableParse = async (req: NextApiRequest): Promise<[formidable.Fields, formidable.Files]> =>
    new Promise((resolve, reject) =>
        new IncomingForm().parse(req, (err, fields, files) => err ? reject(err) : resolve([fields, files]))
    )

type File = formidable.File | undefined

async function readAndWriteFile(file: File, newPath: string) {
    try {
        if(!file) {
            return 'error'
        }
        const path = `${newPath}/${file.originalFilename}`
        const data = await readFile(file.filepath)
        console.log(data)
        await writeFile(path, data)
        return 'ok'
    } catch (error: any) {
        console.log(error.message)
        return 'error'
    }
}

export default async function (req: NextApiRequest, res: NextApiResponse) {
    const [_, { file }] = await formidableParse(req)
    if(!file) {
        return res.status(400).json({ error: { code: 400, message: 'No se ha seleccionado ningún archivo' } })
    }
    const status = await readAndWriteFile(file[0], './public/uploads')
    if (status === 'error') {
        return res.status(500).json({ error: { code: 500, message: 'Algo salió mal' } })
    }
    if (status === 'ok') {
        return res.status(200).json({ message: 'Archivo subido correctamente' })
    }
}
