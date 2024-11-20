import { setCookie } from 'cookies-next'
import { NextApiRequest, NextApiResponse } from 'next'
import { signIn } from '@/models/transactions/auth'
const loginHandler = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === 'POST') {
        const { email, password } = req.body
        if (email === '' || password === '' || !email || !password) {
            return res.status(400).json({ error: 'Credenciales requeridas' })
        }
        const { data: { data, error, message }, status } = await signIn({ data: { email, password } })
        if (error) {
            return res.status(400).json({ error: message })
        }
        if (status === 401) {
            return res.status(401).json({ error: 'Credenciales inválidas' })
        }
        if (status === 201 || status === 200) {
            const { access_token } = data
            setCookie('token', access_token, {
                req,
                res,
                maxAge: 60 * 60 * 24,
                httpOnly: true,
                secure: true,
                sameSite: 'strict',
            })
            return res.status(200).json({ message: 'Usuario autenticado', user: email })
        }
    }
    return res.status(400).json({ error: 'Método no permitido' })
}

export default loginHandler