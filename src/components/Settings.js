import { Button, Divider, Link, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@nextui-org/react"
import { useDispatch, useSelector } from "react-redux"
import { deleteInvestments, importInvestments } from "../actions/investments"
import { useRef } from "react"
import { useTranslation } from "react-i18next"

export default function Settings({ isOpen, onOpenChange }) {
    const dispatch = useDispatch()
    const {t} = useTranslation();
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
                        <ModalHeader className="flex flex-col gap-1">{t('settings.header')}</ModalHeader>
                        <ModalBody>
                            <Button color="primary" variant="flat" onPress={handleClick}>
                                <input type="file" className="hidden" onChange={importInvestmentsFile} ref={hiddenFileInput}/>
                                {t('settings.importButton')}
                            </Button>
                            <Button color="primary" variant="flat" href={`data:text/json;charset=utf-8,${encodeURIComponent(
                                    JSON.stringify(investments)
                                )}`} as={Link} download="investments-export.json">
                                {t('settings.exportButton')}
                            </Button>

                            <Divider />
                            <Button color="danger" variant="light" onPress={() => {
                                window.localStorage.clear()
                                dispatch(deleteInvestments())
                                alert(t('settings.deleteAlert'))
                                onClose()
                            }}>
                                {t('settings.deleteButton')}
                            </Button>
                        </ModalBody>
                        <ModalFooter>
                            <Button color="primary" variant="flat" aria-label="close" onPress={() => {
                                onClose()
                            }}>
                                {t('settings.closeButton')}
                            </Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    )
}