import { InitSelectedKeys } from "@/utils"
import { Selection } from "@nextui-org/react"
import { Key, useState } from "react"

export const useSelectionKeys = ({ onSelectionChange, clearSelection, defaultSelectedKeys }: {
    onSelectionChange?: (e: Set<Key>) => void,
    clearSelection?: () => void,
    defaultSelectedKeys?: Key[]
}) => {
    const [selectedKeys, setSelectedKeys] = useState(defaultSelectedKeys ? new Set<Key>(defaultSelectedKeys) : InitSelectedKeys)
    const onChange = (e: Selection) => {
        if (e === "all") return
        if (onSelectionChange) onSelectionChange(e)
        setSelectedKeys(e)
    }
    const cleanup = () => {
        if (clearSelection) clearSelection()
        setSelectedKeys(new Set<Key>([]))
    }
    return {
        selectedKeys,
        setSelectedKeys,
        onSelectionChange: onChange,
        clearSelection: cleanup,
    }
}