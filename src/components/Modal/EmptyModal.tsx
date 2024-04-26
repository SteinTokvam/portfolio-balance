import React from "react"
import { Modal } from "@nextui-org/react"

type Props = {
    isOpen: boolean
    onOpenChange: (isOpen: boolean) => void
    hideCloseButton?: boolean
    isDismissable?: boolean
    size?: "md" | "sm" | "lg" | "xl" | "2xl" | "xs" | "3xl" | "4xl" | "5xl" | "full" | undefined,
    children: React.ReactNode
}

export default function EmptyModal({ isOpen, onOpenChange, hideCloseButton = true, isDismissable = false, size = "md", children }: Props) {

    return (
        <Modal
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            backdrop='blur'
            scrollBehavior='inside'
            hideCloseButton={hideCloseButton}
            isDismissable={isDismissable}
            size={size}>
            {children}
        </Modal>
    )
}