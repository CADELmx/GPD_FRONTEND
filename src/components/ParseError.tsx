import { Button } from "@nextui-org/react"
import Link, { LinkProps } from "next/link"
import { QuestionMarkIcon } from "./Icons"
import { PropsWithoutRef } from "react";

type ChildrenProps = {
    children?: React.ReactNode
}

export const ParseErrorLink = ({ children, ...props }: PropsWithoutRef<LinkProps & ChildrenProps>) => {
    return (
        <Link {...props}>
            <Button
                size="sm"
                color="default"
                className="text-danger"
                variant="light"
                endContent={QuestionMarkIcon}
            >
                {children}
            </Button>
        </Link>
    )
}