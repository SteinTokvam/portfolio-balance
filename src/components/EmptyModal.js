import { Modal } from "@nextui-org/react"

export default function EmptyModal({ isOpen, onOpenChange, children }) {

    return (
        <Modal isOpen={isOpen} onOpenChange={onOpenChange} backdrop='blur' scrollBehavior='inside' hideCloseButton={true}>
            {children}
        </Modal>
    )
}