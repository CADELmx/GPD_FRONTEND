
import { Area } from "@/models/types/area";
import { EducationalProgram } from "@/models/types/educational-program";
import { PartialTemplate } from "@/models/types/partial-template";
import { Template } from "@/models/types/template";
import { Server } from "socket.io";

const iohandler = (_: any, res: any) => {
    if (!res.socket.server.io) {
        const io = new Server(res.socket.server, {
            cors: {
                origin: '*',
                methods: ['GET', 'POST']
            },
            allowEIO3: true,
            transports: ['websocket', 'polling']
        })
        const onCreateArea = async (area: Area) => {
            io.emit('createdArea', area)
        }
        const onUpdateArea = async (area: Area) => {
            io.emit('updatedArea', area)
        }
        const onDeleteArea = async (area: Area) => {
            io.emit('deletedArea', area)
        }
        const onCreateEducationalProgram = async (educationalProgram: EducationalProgram) => {
            io.emit('createdEducationalProgram', educationalProgram)
        }
        const onUpdateEducationalProgram = async (educationalProgram: EducationalProgram) => {
            io.emit('updatedEducationalProgram', educationalProgram)
        }
        const onDeleteEducationalProgram = async (educationalProgram: EducationalProgram) => {
            io.emit('deletedEducationalProgram', educationalProgram)
        }
        const onCreatePartialTemplate = async (partialTemplate: PartialTemplate) => {
            io.emit('createdPartialTemplate', partialTemplate)
        }
        const onCreateTemplate = async (template: Template) => {
            io.emit('createdTemplate', template)
        }
        const onUpdateTemplateStatus = async (template: Template) => {
            io.emit('templateStatus', template)
        }
        const onUpdateTemplate = async (template: Template) => {
            io.emit('updatedTemplate', template)
        }
        const onDeleteTemplate = async (template: Template) => {
            io.emit('deletedTemplate', template)
        }
        const onUpdatePartialTemplateStatus = async (partialTemplate: PartialTemplate) => {
            io.emit('partialTemplateStatus', partialTemplate)
        }
        const onCorrectionPartialTemplate = async (partialTemplate: PartialTemplate) => {
            io.emit('correctionPartialTemplate', partialTemplate)
        }
        const onDeletePartialTemplate = async (partialTemplate: PartialTemplate) => {
            io.emit('deletedPartialTemplate', partialTemplate)
        }
        const onCreateComment = async (comment: Comment) => {
            io.emit('createdComment', comment)
        }
        const onDeleteComment = async (comment: Comment) => {
            io.emit('deletedComment', comment)
        }
        io.on('connection', socket => {
            socket.emit('connection', socket.id)
            socket.on('createArea', onCreateArea)
            socket.on('updateArea', onUpdateArea)
            socket.on('deleteArea', onDeleteArea)
            socket.on('createEducationalProgram', onCreateEducationalProgram)
            socket.on('updateEducationalProgram', onUpdateEducationalProgram)
            socket.on('deleteEducationalProgram', onDeleteEducationalProgram)
            socket.on('createPartialTemplate', onCreatePartialTemplate)
            socket.on('createTemplate', onCreateTemplate)
            socket.on('deleteTemplate', onDeleteTemplate)
            socket.on('updateTemplate', onUpdateTemplate)
            socket.on('partialTemplateStatus', onUpdatePartialTemplateStatus)
            socket.on('deletePartialTemplate',onDeletePartialTemplate)
            socket.on('correctionPartialTemplate', onCorrectionPartialTemplate)
            socket.on('updateTemplateStatus', onUpdateTemplateStatus)
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