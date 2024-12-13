import { setCookie } from 'cookies-next'
import { NextApiRequest, NextApiResponse } from 'next'
import { signUp } from '@/models/transactions/auth'
const loginHandler = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === 'POST') {
        const { email, password, nt } = req.body
        if (email === '' || password === '' || !email || !password) {
            return res.status(400).json({ error: 'Credenciales requeridas' })
        }
        const { data: { data, error, message }, status } = await signUp({ data: { email, password, nt, active: true } })
        if (error) {
            return res.status(400).json({ error: message })
        }
        if (status === 201 || status === 200) {
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
    }
    return res.status(400).json({ error: 'Método no permitido' })
}

export default loginHandler