import { Modal } from "@nextui-org/react"

export default function EmptyModal({ isOpen, onOpenChange, hideCloseButton = true, children }) {

    return (
        <Modal isOpen={isOpen} onOpenChange={onOpenChange} backdrop='blur' scrollBehavior='inside' hideCloseButton={hideCloseButton} isDismissable={false}>
            {children}
        </Modal>
    )
}