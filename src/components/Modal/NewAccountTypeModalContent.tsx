import React from "react"
import { Button, Input, ModalBody, ModalContent, ModalFooter, ModalHeader, Select, SelectItem, Tab, Tabs, Accordion, AccordionItem, Link, RadioGroup, Radio } from "@nextui-org/react"
import { useTranslation } from "react-i18next"
import { accountTypes, textInputStyle } from "../../Util/Global"
import { useMemo, useState } from "react"
import { useDispatch } from "react-redux"
import { v4 as uuidv4 } from 'uuid';
import { addAutomaticAccount, addNewAccount } from "../../actions/accounts"

export function NewAccountTypeModalContent() {

    const { t } = useTranslation()

    const [accountName, setAccountName] = useState("")

    const [selectedKeys, setSelectedKeys] = useState([]);
    const selectedAccountType = useMemo(
        () => Array.from(selectedKeys).join(", ").replaceAll("_", " "),
        [selectedKeys]
    );

    const [selectedRadio, setSelectedRadio] = useState("Firi");

    const [accessKeyText, setAccessKeyText] = useState("")

    const [kronAccountId, setKronAccountId] = useState("")

    const dispatch = useDispatch()

    function handleSubmit() {
        if (accessKeyText === "") {
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
                    name: selectedRadio,
                    key: uuidv4(),
                    type: selectedRadio === "Firi" ? "Kryptovaluta" : "Aksjesparekonto",
                    transactions: [],
                    totalValue: 0,
                    yield: 0,
                    isManual: false,
                    apiInfo: {
                        accessKey: accessKeyText,
                        kronAccountId
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
                                    // @ts-ignore
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

                                <RadioGroup
                                    label="Velg type konto"
                                    orientation="horizontal"
                                    value={selectedRadio}
                                    onValueChange={setSelectedRadio}
                                >
                                    <Radio value="Firi">Firi</Radio>
                                    <Radio value="Kron">Kron</Radio>
                                </RadioGroup>

                                <Input type="text"
                                    classNames={textInputStyle}
                                    className="pt-4"
                                    label={selectedRadio === "Firi" ? "Firi api key" : "Kron access key"}
                                    value={accessKeyText}
                                    onValueChange={setAccessKeyText} />
                                {
                                    selectedRadio === 'Kron' && <Input type="text"
                                        classNames={textInputStyle}
                                        className="pt-4"
                                        label="Kron account id"
                                        value={kronAccountId}
                                        onValueChange={setKronAccountId} />
                                }
                                <Accordion>
                                    <AccordionItem
                                        title={<h1 className="border-b">{selectedRadio === "Firi" ? t('accountModal.firiAccordionTitle') : t('accountModal.kronAccordionTitle')}</h1>}
                                    >
                                        <div className="">
                                            <p>{selectedRadio === "Firi" ? t('accountModal.firiHelpText1') : t('accountModal.kronHelpText1')}</p>

                                            {
                                                selectedRadio === "Firi" ? <Link
                                                    href="https://firi.no"
                                                    isExternal
                                                    showAnchorIcon
                                                >
                                                    Firi
                                                </Link> :
                                                    <Link
                                                        href="https://kron.no"
                                                        isExternal
                                                        showAnchorIcon
                                                    >
                                                        Kron
                                                    </Link>
                                            }
                                            {selectedRadio === "Firi" ?
                                                t('accountModal.firiHelpText2') :
                                                t('accountModal.kronHelpText2')}
                                        </div>
                                    </AccordionItem>
                                </Accordion>
                            </Tab>
                        </Tabs>

                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" variant="light" onPress={() => {
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
            )
            }
        </ModalContent >
    )
}
