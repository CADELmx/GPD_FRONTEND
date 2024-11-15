import { readFile, unlink } from "fs/promises"

export default async function handler(req, res) {
    console.log(req.query.filename)
    const file = await readFile(`./public/uploads/${req.query.filename}`, { encoding: 'utf-8' })
    await unlink(`./public/uploads/${req.query.filename}`)
    res.status(200).json(file)
}