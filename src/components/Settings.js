import { Avatar, Button, Divider, Input, Link, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Select, SelectItem } from "@nextui-org/react"
import { useDispatch, useSelector } from "react-redux"
import { deleteInvestments, importInvestments } from "../actions/investments"
import { useEffect, useMemo, useRef, useState } from "react"
import { useTranslation } from "react-i18next"
import { languages, textInputStyle } from "../Util/Global"
import { addNewAccountType, deleteAccountTypes } from "../actions/account"

export default function Settings({ isOpen, onOpenChange }) {
    const dispatch = useDispatch()
    const { t, i18n } = useTranslation();
    const investments = useSelector(state => state.rootReducer.investments.investments)

    const hiddenFileInput = useRef(null);
    const lang = JSON.parse(window.localStorage.getItem('settings')) !== null ? JSON.parse(window.localStorage.getItem('settings')).language : 'us'

    const [selectedKeys, setSelectedKeys] = useState(new Set([lang]));
    const [accountTypeText, setAccountTypeText] = useState("")

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
                                    <SelectItem key={lang} value={lang} startContent={<Avatar alt="lang" className="w-6 h-6" src={`https://flagcdn.com/${lang}.svg`} />}>
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
                                dispatch(deleteAccountTypes(t('valuators.defaultAccountType')))
                                alert(t('settings.deleteAlert'))
                                onClose()
                            }}>
                                {t('settings.deleteButton')}
                            </Button>

                            <Divider />
                            {
                                //Her kommer mulighet for å legge til egne kontotyper. usikker på hvor den funksjonaliteten egentlig bør ligge, men legger den her for nå
                            }
                            <Input type="text" classNames={textInputStyle} label={t('settings.accountType')} value={accountTypeText} onValueChange={setAccountTypeText} />
                            <Button color="primary" variant="flat" onPress={() => {
                                dispatch(addNewAccountType(accountTypeText))
                                setAccountTypeText("")
                            }} >
                                {t('settings.addAccountButton')}
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