import { YearSelectorAlter } from "@/components/Selector";
import { Button } from "@nextui-org/react";

export default function DirectorIndex() {
    return (
        <div className="flex flex-col items-center justify-center">
            <h1 className="text-1xl font-bold text-center text-utim tracking-widest capitalize p-2 m-2">Crear nueva plantilla</h1>
            <div className="flex flex-col gap-2 object-fill w-5/6 sm:w-2/3">
                <YearSelectorAlter />
                <Button
                    startContent={
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>
                    }
                    className="bg-utim"
                >
                    Crear plantilla
                </Button>
            </div>
        </div>
    )
}