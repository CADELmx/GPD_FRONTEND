import Image from "next/image";
import { Button } from "@nextui-org/react";
import toast from "react-hot-toast";

export default function About() {
    const handleDownload = async () => {
        const downloadPromise = new Promise((resolve, reject) => {
            const link = document.createElement('a');
            link.href = '/public/uploads/gpd_manual.pdf';
            link.download = 'gpd_manual.pdf';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            resolve('File downloaded successfully');
        });

        toast.promise(downloadPromise, {
            loading: 'Downloading...',
            success: 'Download complete!',
            error: 'Download failed'
        });
    };

    return (
        <div className="flex flex-col gap-2 items-center justify-center">
            <Image alt='captura de pantalla desde dispisitivo móvil' src={'/social_preview.jpg'} width={600} height={874} />
            <p className="font-bold">
                Si tienes dudas del funcionamiento de la aplicación, descarga el manual de usuario, este te ayudará a conocer mejor la aplicación.
            </p>
            <Button color="primary" onPress={handleDownload}>
                Descargar manual de usuario
            </Button>
        </div>
    )
}