import { Button, Divider, Link, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Select, SelectItem } from "@nextui-org/react"
import { useDispatch, useSelector } from "react-redux"
import { deleteInvestments, importInvestments } from "../actions/investments"
import { useEffect, useMemo, useRef, useState } from "react"
import { useTranslation } from "react-i18next"
import { languages } from "../Util/Global"

export default function Settings({ isOpen, onOpenChange }) {
    const dispatch = useDispatch()
    const { t, i18n } = useTranslation();
    const investments = useSelector(state => state.rootReducer.investments.investments)

    const hiddenFileInput = useRef(null);

    const [selectedKeys, setSelectedKeys] = useState(new Set([JSON.parse(window.localStorage.getItem('settings')).language || 'en']));

    const selectedLanguage = useMemo(
        () => Array.from(selectedKeys).join(", ").replaceAll("_", " "),
        [selectedKeys]
        );

    const handleClick = () => {
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

    useEffect(() => {
        i18n.changeLanguage(selectedLanguage)
        window.localStorage.setItem('settings', JSON.stringify({language: selectedLanguage}))
    }, [selectedLanguage, i18n])

    return (
        <Modal isOpen={isOpen} onOpenChange={onOpenChange} backdrop='blur'>
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader className="flex flex-col gap-1">{t('settings.header')}</ModalHeader>
                        <ModalBody>
                            <Select
                                label={t('settings.selectType')}
                                placeholder={t('settings.selectLabel')}
                                className="max-w-xs"
                                onSelectionChange={setSelectedKeys}
                                selectedKeys={selectedKeys}
                            >
                                {languages.map((lang) => (
                                    <SelectItem key={lang} value={lang}>
                                        {lang}
                                    </SelectItem>
                                ))}
                            </Select>
                            <Divider />
                            <Button color="primary" variant="flat" onPress={handleClick}>
                                <input type="file" className="hidden" onChange={importInvestmentsFile} ref={hiddenFileInput} />
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