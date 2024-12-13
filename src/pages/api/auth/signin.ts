import { NextApiRequest, NextApiResponse } from 'next'
import { signIn } from '@/models/transactions/auth'
import { setCookie } from 'cookies-next'
const loginHandler = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === 'POST') {
        const { email, password } = req.body
        if (email === '' || password === '' || !email || !password) {
            return res.status(400).json({ error: 'Credenciales requeridas' })
        }
        const { data: { data, error, message } } = await signIn({ data: { email, password } })
        if (error) {
            return res.status(400).json({
                error: message
            })
        }
        const { access_token } = data
        setCookie('token', access_token, {
            req,
            res,
            maxAge: 60 * 60 * 24,
        })
        setCookie('user', email, {
            req,
            res,
            maxAge: 60 * 60 * 24,
        })
        return res.status(200).json({ message: 'Usuario autenticado', user: email, token: access_token })

    }
    return res.status(400).json({ error: 'Método no permitido' })
}

export default loginHandler