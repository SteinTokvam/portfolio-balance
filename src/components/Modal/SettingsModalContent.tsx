import { Avatar, Button, Divider, ModalBody, ModalContent, ModalFooter, ModalHeader, Select, SelectItem } from "@nextui-org/react"
import { useEffect, useMemo, useState } from "react"
import { useTranslation } from "react-i18next"
import { languages } from "../../Util/Global"
// @ts-ignore
import i18n from "../../i18n/config"
import { deleteAllAccountSupabase } from "../../Util/Supabase"
import { supabase } from "../../supabaseClient"

export default function SettingsModalContent() {
    const { t } = useTranslation();
    
    const [lang, _] = useState(JSON.parse(window.localStorage.getItem('settings') as string) !== null ? JSON.parse(window.localStorage.getItem('settings') as string).language : 'us')
    const [selectedKeys, setSelectedKeys] = useState(new Set([lang]));

    const selectedLanguage = useMemo(
        () => Array.from(selectedKeys).join(", ").replaceAll("_", " "),
        [selectedKeys]
    );

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
                        <h4 className="text-medium font-semibold leading-none text-danger-600">{t('settings.deleteTitle')}</h4>
                        <Button color="danger" variant="light" onPress={() => {
                            window.localStorage.clear()
                            deleteAllAccountSupabase(supabase)
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