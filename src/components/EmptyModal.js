import { Button, Modal, ModalContent, ModalFooter } from "@nextui-org/react"
import { Children } from "react"
import { useTranslation } from "react-i18next"
import DeleteIcon from "../icons/DeleteIcon"

export default function EmptyModal({ isOpen, onOpenChange, handleClose, children }) {

    const { t } = useTranslation()

    return (
        <Modal isOpen={isOpen} onOpenChange={onOpenChange} backdrop='blur' scrollBehavior='inside' hideCloseButton={true}>

            <ModalContent>
                {(onClose) => (
                    <>
                        {children}
                        <ModalFooter>
                            <Button isIconOnly color="danger" variant="solid" onPress={() => {
                                onClose()
                                handleClose()
                            }}>
                                <DeleteIcon />
                            </Button>
                            <Button color="primary" variant="light" onPress={onClose}>
                                {t('investmentModal.close')}
                            </Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    )
}