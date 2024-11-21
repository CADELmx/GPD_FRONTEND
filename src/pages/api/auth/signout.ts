import { deleteCookie } from "cookies-next"
import { NextApiRequest, NextApiResponse } from "next"

const logoutHandler = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === 'GET') {
        deleteCookie('token', {
            req,
            res,
            secure: true
        })
        return res.status(200).json({ message: 'Sesión cerrada' })
    }
    return res.status(400).json({ error: 'Método no permitido' })
}

export default logoutHandler