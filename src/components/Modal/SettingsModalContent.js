import { Avatar, Button, Divider, Input, Link, ModalBody, ModalContent, ModalFooter, ModalHeader, Select, SelectItem } from "@nextui-org/react"
import { useDispatch, useSelector } from "react-redux"
import { deleteInvestments, importInvestments } from "../../actions/investments"
import { useEffect, useMemo, useRef, useState } from "react"
import { useTranslation } from "react-i18next"
import { languages, textInputStyle } from "../../Util/Global"
import { addInitialAccountTypes, deleteAllAccountTypes, setFiriAccessKey } from "../../actions/account"

export default function SettingsModalContent() {
    const dispatch = useDispatch()
    const { t, i18n } = useTranslation();
    const investments = useSelector(state => state.rootReducer.investments.investments)
    const accountTypes = useSelector(state => state.rootReducer.accounts.accountTypes)

    const accessKey = useSelector(state => state.rootReducer.accounts.firi)

    const [accessKeyInput, setAccessKeyInput] = useState("")

    const hiddenFileInput = useRef(null);
    const [lang, setLang] = useState(JSON.parse(window.localStorage.getItem('settings')) !== null ? JSON.parse(window.localStorage.getItem('settings')).language : 'us')

    const [selectedKeys, setSelectedKeys] = useState(new Set([lang]));

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
            const json = JSON.parse(e.target.result)
            dispatch(importInvestments(json.investments));
            dispatch(addInitialAccountTypes(json.accountTypes))
            setLang(json.settings.language)
            setSelectedKeys(new Set([json.settings.language]))
            window.localStorage.setItem('settings', JSON.stringify(json.settings))
            i18n.changeLanguage(json.settings.language)
        };
    };

    const processFile = () => {
        return JSON.stringify({
            investments: investments,
            settings: JSON.parse(window.localStorage.getItem('settings')),
            accountTypes: accountTypes
        })
    }

    useEffect(() => {
        i18n.changeLanguage(selectedLanguage)
        window.localStorage.setItem('settings', JSON.stringify({ language: selectedLanguage }))
        if(accessKeyInput !== "") {
            dispatch(setFiriAccessKey(accessKeyInput))   
        }
        if(accessKey !== "") {
            setAccessKeyInput(accessKey)
        }
    }, [selectedLanguage, i18n, accessKeyInput, accessKey])

    return (
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

                        <Input type="text" classNames={textInputStyle} label="Firi access key" value={accessKeyInput} onValueChange={setAccessKeyInput} />
                        <Divider />
                        <Button color="primary" variant="flat" onPress={handleClick}>
                            <input type="file" className="hidden" onChange={importInvestmentsFile} ref={hiddenFileInput} />
                            {t('settings.importButton')}
                        </Button>
                        <Button color="primary" variant="flat" href={`data:text/json;charset=utf-8,${encodeURIComponent(
                            processFile()
                        )}`} as={Link} download="investments-export.json">
                            {t('settings.exportButton')}
                        </Button>

                        <Divider />
                        <h4 className="text-medium font-semibold leading-none text-danger-600">{t('settings.deleteTitle')}</h4>
                        <Button color="danger" variant="light" onPress={() => {
                            window.localStorage.clear()
                            dispatch(deleteInvestments())
                            dispatch(deleteAllAccountTypes(t('valuators.defaultAccountType')))
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
    )
}