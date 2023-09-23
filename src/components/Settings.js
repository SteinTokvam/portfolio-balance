import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@nextui-org/react"
import { useDispatch } from "react-redux"
import { deleteInvestments } from "../actions/investments"

export default function Settings({isOpen, onOpenChange}) {
    const dispatch = useDispatch()

    return (
        <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader className="flex flex-col gap-1">Settings</ModalHeader>
                        <ModalBody>
                            <Button color="danger" variant="light" onPress={() => {
                                window.localStorage.clear()
                                dispatch(deleteInvestments())
                                alert("All user data deleted.")
                                onClose()
                                }}>
                                Delete all user data!
                            </Button>
                        </ModalBody>
                        <ModalFooter>
                            <Button color="primary" variant="flat" aria-label="close" onPress={() => {
                                onClose()
                            }}>
                                Close
                            </Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    )
}