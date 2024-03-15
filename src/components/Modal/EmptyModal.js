import { Modal } from "@nextui-org/react"

export default function EmptyModal({ isOpen, onOpenChange, hideCloseButton = true, size = 'md', children }) {

    return (
        <Modal
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            backdrop='blur'
            scrollBehavior='inside'
            hideCloseButton={hideCloseButton}
            isDismissable={false} size={size}>
            {children}
        </Modal>
    )
}