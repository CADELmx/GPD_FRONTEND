import { readFile, unlink } from "fs/promises"
import { NextApiRequest, NextApiResponse } from "next"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const file = await readFile(`./public/uploads/${req.query.filename}`, { encoding: 'utf-8' })
    await unlink(`./public/uploads/${req.query.filename}`)
    res.status(200).json(file)
}