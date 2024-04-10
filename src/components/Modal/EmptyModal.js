import { Modal } from "@nextui-org/react"

export default function EmptyModal({ isOpen, onOpenChange, hideCloseButton = true, isDismissable = false, size = 'md', children }) {

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