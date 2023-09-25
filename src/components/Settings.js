import { Button, Divider, Link, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@nextui-org/react"
import { useDispatch, useSelector } from "react-redux"
import { addNewInvestment, deleteInvestments, importInvestments } from "../actions/investments"
import { useRef } from "react"

export default function Settings({ isOpen, onOpenChange }) {
    const dispatch = useDispatch()
    const investments = useSelector(state => state.rootReducer.investments.investments)

    const hiddenFileInput = useRef(null);

    const handleClick = event => {
        hiddenFileInput.current.click();
      };

    const importInvestmentsFile = e => {
        const fileReader = new FileReader();
        fileReader.readAsText(e.currentTarget.files[0], "UTF-8");
        fileReader.onload = e => {
            console.log("e.target.result", e.target.result);
            dispatch(importInvestments(JSON.parse(e.target.result)));
        };
    };

    return (
        <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader className="flex flex-col gap-1">Settings</ModalHeader>
                        <ModalBody>
                            <Button color="primary" variant="flat" onPress={handleClick}>
                                <input type="file" className="hidden" onChange={importInvestmentsFile} ref={hiddenFileInput}/>
                                Import data
                            </Button>
                            <Button color="primary" variant="flat">
                                <Link href={`data:text/json;charset=utf-8,${encodeURIComponent(
                                    JSON.stringify(investments)
                                )}`}
                                    download="investments-export.json">
                                    Export data
                                </Link>
                            </Button>

                            <Divider />
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