
import { Server } from "socket.io";
import { insertPartialTemplate, setPartialTemplateStatus } from "../../models/transactions/partial-template";
import { deleteComment, getComment, insertComment, updateComment } from "../../models/transactions/comment";
import { insertActivities } from "../../models/transactions/activity";
import { generateTemplateObject } from "../../utils";

const iohandler = (_, res) => {
    if (!res.socket.server.io) {
        const io = new Server(res.socket.server, {
            cors: {
                origin: '*',
                methods: ['GET', 'POST']
            },
            allowEIO3: true,
            transports: ['websocket', 'polling']
        })
        const onUpdateStatus = async statusObject => {
            const { data: { error } } = await setPartialTemplateStatus({
                id: statusObject.id, status: statusObject.status.name
            })
            io.emit('updateStatus', { error, ...statusObject })
        }
        const onCreateComment = async commentObject => {
            const { data } = await getComment(commentObject.id)
            if (data) {
                const { data: { error } } = await updateComment({
                    partialTemplateId: commentObject.id,
                    comment: commentObject.comment
                })
                io.emit('existentComment', { error })
                return
            }
            const { data: { error } } = await insertComment({
                partialTemplateId: commentObject.id,
                comment: commentObject.comment
            })
            io.emit('createComment', { error, id: commentObject.id })
        }
        const onCreateTemplate = async templateObject => {
            const template = generateTemplateObject(templateObject)
            const { data: { error: templateError, data } } = await insertPartialTemplate({ data: template as any })
            if (templateError) {
                io.emit('templateError', 'Error al guardar plantilla')
                return
            }
            const activities = templateObject.activities.map(p => ({
                ...p,
                plantilla_id: data[0]?.id,
            }))
            const { data: { error: actError } } = await insertActivities(activities)
            const newTemplate = {
                id: data[0]?.id,
                ...templateObject,
            }
            if (actError) {
                io.emit('templateError', 'Error al guardar carga académica')
                return
            }
            io.emit('createdTemplate', newTemplate)
        }
        const onDeleteComment = async commentObject => {
            const { data: { error } } = await deleteComment(commentObject.id)
            io.emit('deleteComment', { error, id: commentObject.id })
        }
        io.on('connection', socket => {
            socket.emit('connection', socket.id)
            socket.on('updateStatus', onUpdateStatus)
            socket.on('createTemplate', onCreateTemplate)
            socket.on('createComment', onCreateComment)
            socket.on('deleteComment', onDeleteComment)
        })
        res.socket.server.io = io
    } else {
        console.log('Using existing socket')
    }
    res.end()
}

export const config = {
    api: {
        bodyParser: false
    }
}

export default iohandler