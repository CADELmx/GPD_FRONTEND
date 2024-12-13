import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from '@nextui-org/react'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { DownloadIcon, RightArrowIcon, VericalDotsIcon } from './Icons'

export const MoreOptions = ({ templateid, templatename }:{
    templateid: number,
    templatename: string
}) => {
    const download = async (data: Response) => {
        const blob = await data.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `Plantilla ${templatename}.xlsx`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
    }
    const onDownload = () => {
        toast.promise(fetch(`/api/excelreport/${templateid}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            }
        }), {
            loading: 'Descargando...',
            success: (data) => {
                switch (data.status) {
                    case 200:
                        download(data)
                        return 'Descargado'
                    case 404:
                        return 'No se encontraron datos'
                    case 500:
                        return 'Error al generar el archivo'
                    default:
                        return 'Error al descargar'
                }
            },
            error: 'Error al descargar'
        }, {
            id: 'download-template',
        })
    }
    return (
        <Dropdown>
            <DropdownTrigger>
                <Button variant="light" isIconOnly aria-label="opciones">
                    {VericalDotsIcon}
                </Button>
            </DropdownTrigger>
            <DropdownMenu
                aria-label='Menú de acciones'
                className='p-0 m-0'
                onAction={key => key === 'descargar' && onDownload()}
            >
                <DropdownItem
                    key={'descargar'}
                    aria-label='descargar'
                    startContent={DownloadIcon}
                >
                    Descargar excel
                </DropdownItem>
                <DropdownItem
                    key={'ver'}
                    aria-label='ver'
                    startContent={RightArrowIcon}
                >
                    <Link legacyBehavior passHref href={`/partialtemplate/${templateid}`}>
                        Ver plantilla
                    </Link>
                </DropdownItem>
            </DropdownMenu>
        </Dropdown>
    )
}
