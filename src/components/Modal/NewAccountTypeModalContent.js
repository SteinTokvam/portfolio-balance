import { Button, Input, ModalBody, ModalContent, ModalFooter, ModalHeader, Select, SelectItem, Tab, Tabs, Accordion, AccordionItem, Link } from "@nextui-org/react"
import { useTranslation } from "react-i18next"
import { accountTypes, textInputStyle } from "../../Util/Global"
import { useMemo, useState } from "react"
import { useDispatch } from "react-redux"
import { v4 as uuidv4 } from 'uuid';
import { addAutomaticAccount, addNewAccount } from "../../actions/accounts"

export function NewAccountTypeModalContent({ setScreen = () => { } }) {

    const { t } = useTranslation()

    const [accountName, setAccountName] = useState("")

    const [selectedKeys, setSelectedKeys] = useState([]);
    const selectedAccountType = useMemo(
        () => Array.from(selectedKeys).join(", ").replaceAll("_", " "),
        [selectedKeys]
    );

    const [accessKeyText, setAccessKeyText] = useState("")

    const dispatch = useDispatch()

    function handleSubmit() {
        setScreen(true)

        if (selectedAccountType !== "Kryptovaluta") {
            dispatch(addNewAccount(
                {
                    name: accountName,
                    key: uuidv4(),
                    type: selectedAccountType,
                    transactions: [],
                    totalValue: 0,
                    yield: 0,
                    isManual: true,
                    apiInfo: {},
                    holdings: []
                }
            ))
        } else {
            dispatch(addAutomaticAccount(
                {
                    name: accountName,
                    key: uuidv4(),
                    type: selectedAccountType,
                    transactions: [],
                    totalValue: 0,
                    yield: 0,
                    isManual: false,
                    apiInfo: {
                        accessKey: accessKeyText
                    },
                    holdings: []
                }
            ))
        }
    }

    return (
        <ModalContent>
            {(onClose) => (
                <>
                    <ModalHeader className="flex flex-col gap-1">{t('accountModal.title')}</ModalHeader>
                    <ModalBody className="">
                        <Tabs>
                            <Tab key="Manual" title="Manual import" className="w-full">
                                <Input type="text"
                                    classNames={textInputStyle}
                                    label={"Kontonavn"}
                                    value={accountName}
                                    onValueChange={setAccountName} />
                                <Select
                                    label={"Kontotype"}
                                    placeholder={"Kontotype"}
                                    className="pt-4 drop-shadow-xl"
                                    onSelectionChange={setSelectedKeys}
                                    selectedKeys={selectedKeys}
                                >
                                    {accountTypes.map((accountType) => (
                                        <SelectItem key={accountType} value={accountType} >
                                            {accountType}
                                        </SelectItem>
                                    ))}
                                </Select>
                            </Tab>
                            <Tab key="Auto" title="Automatic import">
                                <Input type="text"
                                    classNames={textInputStyle}
                                    label={"Kontonavn"}
                                    value={accountName}
                                    onValueChange={setAccountName} />
                                <Select
                                    label={"Kontotype"}
                                    placeholder={"Kontotype"}
                                    className="pt-4 drop-shadow-xl"
                                    onSelectionChange={setSelectedKeys}
                                    selectedKeys={selectedKeys}
                                >
                                    {accountTypes.map((accountType) => (
                                        <SelectItem key={accountType} value={accountType} >
                                            {accountType}
                                        </SelectItem>
                                    ))}
                                </Select>
                                <Input type="text"
                                    classNames={textInputStyle}
                                    className="pt-4"
                                    label="Firi api key"
                                    value={accessKeyText}
                                    onValueChange={setAccessKeyText} />
                                    <Accordion>
                                    <AccordionItem
                                        title={<h1 className="border-b">Hvordan finne Firi API-nøkkel</h1>}
                                    >
                                        <div className="">
                                            <p>For å hente API-nøkkel fra Firi, så logger du inn på <Link
                                                href="https://firi.no"
                                                isExternal
                                                showAnchorIcon
                                            >
                                                Firi
                                            </Link> kontoen din.
                                                Så trykker du på navnet ditt øverst til høyre og velger Innstillinger. I menyen som kommer opp så trykker du på "API" og så velger du "Legg til ny nøkkel".
                                                I boksen som kommer opp så må du kopiere med deg det som står under API nøkkel. Denne informasjonen vises bare 1 gang.
                                                Om du vil så kan du også gå inn på Endre tillatelser og velger at nøkkelen kun skal ha lesetilgang til kontoen din. Nøkkelen som du har kopiert med deg limer du inn i tekstboksen under her.
                                            </p>
                                        </div>
                                    </AccordionItem>
                                </Accordion>
                            </Tab>
                        </Tabs>

                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" variant="light" onPress={() => {
                            setScreen(true)
                            onClose()
                        }}>
                            {t('general.closeButton')}
                        </Button>
                        <Button color="success" variant="light" aria-label={t('general.save')} onPress={() => {
                            onClose()
                            handleSubmit()
                        }}>
                            {t('general.save')}
                        </Button>
                    </ModalFooter>
                </>
            )}
        </ModalContent>
    )
}
