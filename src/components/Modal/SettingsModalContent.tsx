import { Avatar, Button, Divider, Link, ModalBody, ModalContent, ModalFooter, ModalHeader, Select, SelectItem } from "@nextui-org/react"
import { useDispatch, useSelector } from "react-redux"
import React, { useEffect, useMemo, useRef, useState } from "react"
import { useTranslation } from "react-i18next"
import { languages } from "../../Util/Global"
import { deleteAllAccounts, importAccounts } from "../../actions/accounts"
import { setAllPercentages } from "../../actions/equityType"
import i18n from "../../i18n/config"
import { SupabaseClient } from "@supabase/supabase-js"
import { addTransaction } from "../../Util/Supabase"
import { Account, Transaction } from "../../types/Types"

export default function SettingsModalContent({supabase}: {supabase: SupabaseClient}) {
    const dispatch = useDispatch()
    const { t } = useTranslation();

    // @ts-ignore
    const accounts = useSelector(state => state.rootReducer.accounts)
    // @ts-ignore
    const equityTypes = useSelector(state => state.rootReducer.equity.equityTypes)
    const hiddenFileInput = useRef(null);
    // @ts-ignore
    const [lang, setLang] = useState(JSON.parse(window.localStorage.getItem('settings')) !== null ? JSON.parse(window.localStorage.getItem('settings')).language : 'us')
    const [selectedKeys, setSelectedKeys] = useState(new Set([lang]));

    const selectedLanguage = useMemo(
        () => Array.from(selectedKeys).join(", ").replaceAll("_", " "),
        [selectedKeys]
    );

    const handleClick = () => {
        // @ts-ignore
        hiddenFileInput.current.click();
    };

    const importInvestmentsFile = (e: any) => {
        const fileReader = new FileReader();
        fileReader.readAsText(e.currentTarget.files[0], "UTF-8");
        fileReader.onload = e => {
            // @ts-ignore
            const json = JSON.parse(e.target.result)
            setLang(json.settings.language)
            setSelectedKeys(new Set([json.settings.language]))
            dispatch(importAccounts(supabase, json.accounts.accounts))        
            dispatch(setAllPercentages(json.equitytypes))
            window.localStorage.setItem('settings', JSON.stringify(json.settings))
            i18n.changeLanguage(json.settings.language)
        };
    };

    const processFile = () => {
        return JSON.stringify({
            // @ts-ignore
            settings: JSON.parse(window.localStorage.getItem('settings')),
            accounts: accounts,
            equitytypes: equityTypes
        })
    }

    useEffect(() => {
        i18n.changeLanguage(selectedLanguage)
        window.localStorage.setItem('settings', JSON.stringify({ language: selectedLanguage }))
        
    }, [selectedLanguage])

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
                            // @ts-ignore
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
                            processFile()
                        )}`} as={Link} download="investments-export.json">
                            {t('settings.exportButton')}
                        </Button>

                        <Divider />
                        <h4 className="text-medium font-semibold leading-none text-danger-600">{t('settings.deleteTitle')}</h4>
                        <Button color="danger" variant="light" onPress={() => {
                            window.localStorage.clear()
                            dispatch(deleteAllAccounts(supabase, true))
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
                            {t('general.closeButton')}
                        </Button>
                    </ModalFooter>
                </>
            )}
        </ModalContent>
    )
}