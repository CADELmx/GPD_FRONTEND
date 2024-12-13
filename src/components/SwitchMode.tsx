import { Switch, SwitchProps } from "@nextui-org/react"
import { PencilIcon } from "./Icons"
import { PropsWithoutRef } from "react";

export const SwitchMode = ({ children, ...props }: PropsWithoutRef<SwitchProps>) => {
    return (
        <Switch
            {...props}
            aria-label="Switch selection mode"
            className="flex max-w-full w-full"
            classNames={{
                base: 'flex gap-2 p-1.5 bg-content2 rounded-lg border-2 border-transparent data-[selected=true]:border-default data-[disabled=true]:cursor-default data-[disabled=true]:opacity-50',
            }}
            thumbIcon={PencilIcon}
        >
            {
                children
            }
        </Switch>
    )
}