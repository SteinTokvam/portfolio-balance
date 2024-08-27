import React, { useEffect } from "react"
import { Button, Input, ModalBody, ModalContent, ModalFooter, ModalHeader, Select, SelectItem, Tab, Tabs, Accordion, AccordionItem, Link, RadioGroup, Radio } from "@nextui-org/react"
import { useTranslation } from "react-i18next"
import { styles } from "../../Util/Global"
import { useMemo, useState } from "react"
import { useDispatch } from "react-redux"
import { v4 as uuidv4 } from 'uuid';
import { addAutomaticAccount, addNewAccount, editAccount } from "../../actions/accounts"
import { Account, AccountTypes } from "../../types/Types"
import { SupabaseClient } from "@supabase/supabase-js"

export function AccountTypeModalContent({ isEdit, account, supabase }: { isEdit: boolean, account?: Account, supabase: SupabaseClient }) {

    const { t } = useTranslation()

    const [accountName, setAccountName] = useState(isEdit && account ? account.name : "")
    const [selected, setSelected] = useState("Manual");

    const [selectedKeys, setSelectedKeys] = useState([]);
    const selectedAccountType = useMemo(
        () => Array.from(selectedKeys).join(", ").replaceAll("_", " "),
        [selectedKeys]
    );

    const [selectedRadio, setSelectedRadio] = useState(isEdit && account && !account.isManual ? account.name : "Firi");
    const [accessKeyText, setAccessKeyText] = useState(isEdit && account && !account.isManual && account.apiInfo? account.apiInfo.accessKey : "")
    const [kronAccountId, setKronAccountId] = useState(isEdit && account && !account.isManual && account.apiInfo ? account.apiInfo.kronAccountId : "")

    const dispatch = useDispatch()

    useEffect(() => {
        if (isEdit) {
            setSelected(account && account.isManual ? "Manual" : "Auto")
        } else {
            setSelected("Manual")
        }
    }, [isEdit, account])

    function handleSubmit() {
        if (accessKeyText === "") {
            dispatch(isEdit ? editAccount(
                supabase,
                {
                    name: accountName,
                    key: account ? account.key: uuidv4(),
                    type: selectedAccountType,
                    transactions: account ? account.transactions : [],
                    totalValue: 0,
                    yield: 0,
                    isManual: true,
                }
            ) : addNewAccount(
                supabase,
                {
                    name: accountName,
                    key: uuidv4(),
                    type: selectedAccountType,
                    transactions: [],
                    totalValue: 0,
                    yield: 0,
                    isManual: true,
                }
            ))
        } else {
            dispatch(isEdit ? editAccount(
                supabase,
                {
                    name: selectedRadio,
                    key: account ? account.key : uuidv4(),
                    type: account ? account.type : "",
                    transactions: [],
                    totalValue: 0,
                    yield: 0,
                    isManual: false,
                    apiInfo: {
                        accessKey: accessKeyText,
                        kronAccountId
                    }
                }
            ) : addAutomaticAccount(
                supabase,
                {
                    name: selectedRadio,
                    key: uuidv4(),
                    type: selectedRadio === "Firi" || selectedRadio === "Bare Bitcoin" ? AccountTypes.CRYPTOCURRENCY : AccountTypes.AKSJEFONDSKONTO,
                    transactions: [],
                    totalValue: 0,
                    yield: 0,
                    isManual: false,
                    apiInfo: {
                        accessKey: accessKeyText,
                        kronAccountId
                    }
                }
            ))
        }
    }

    return (
        <ModalContent>
            {(onClose) => (
                <>
                    <ModalHeader className="flex flex-col gap-1">{isEdit ? t('accountModal.editTitle') : t('accountModal.title')}</ModalHeader>
                    <ModalBody className="">
                        <Tabs
                            selectedKey={selected}
                            // @ts-ignore
                            onSelectionChange={setSelected}>
                            <Tab key="Manual" title={t('accountModal.manualTabTitle')} className="w-full">
                                <Input type="text"
                                    classNames={styles.textInputStyle}
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
                                    {Object.values(AccountTypes).map(accountType => (
                                        <SelectItem key={accountType} value={accountType} >
                                            {accountType}
                                        </SelectItem>
                                    ))}
                                </Select>
                            </Tab>
                            <Tab key="Auto" title={t('accountModal.autoTabTitle')}>

                                <RadioGroup
                                    label="Velg type konto"
                                    orientation="horizontal"
                                    value={selectedRadio}
                                    onValueChange={setSelectedRadio}
                                >
                                    <Radio value="Firi">Firi</Radio>
                                    <Radio value="Bare Bitcoin">Bare Bitcoin</Radio>
                                    <Radio value="Kron">Kron</Radio>
                                </RadioGroup>

                                <Input type="text"
                                    classNames={styles.textInputStyle}
                                    className="pt-4"
                                    label={selectedRadio === "Firi" ? "Firi api key" : selectedRadio === "Kron" ? "Kron access key" : "Bare Bitcoin api key"}
                                    value={accessKeyText}
                                    onValueChange={setAccessKeyText} />
                                {
                                    selectedRadio === 'Kron' && <Input type="text"
                                        classNames={styles.textInputStyle}
                                        className="pt-4"
                                        label={t('accountModal.kronAccountId')}
                                        value={kronAccountId}
                                        onValueChange={setKronAccountId} />
                                }
                                <Accordion>
                                    <AccordionItem
                                        title={<h1 className="border-b">{selectedRadio === "Firi" ? t('accountModal.firiAccordionTitle') : t('accountModal.kronAccordionTitle')}</h1>}
                                    >
                                        <div className="">
                                            <p>{selectedRadio === "Firi" ? t('accountModal.firiHelpText1') : selectedRadio === "Kron" ? t('accountModal.kronHelpText1') : "Bare Bitcoin"}

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
                                                    t('accountModal.kronHelpText2')}</p>
                                            <p>{selectedRadio === "Kron" && t('accountModal.kronHelpText3')}</p>
                                            <p>{selectedRadio === "Kron" && t('accountModal.kronHelpText4')}</p>
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
                        <Button color="success" variant="light" aria-label={isEdit ? t('general.saveEdit') : t('general.save')} onPress={() => {
                            onClose()
                            handleSubmit()
                        }}>
                            {isEdit ? t('general.saveEdit') : t('general.save')}
                        </Button>
                    </ModalFooter>
                </>
            )
            }
        </ModalContent >
    )
}
