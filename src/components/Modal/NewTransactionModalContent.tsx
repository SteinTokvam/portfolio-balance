import { Button, Input, ModalBody, ModalContent, ModalFooter, ModalHeader, Select, SelectItem, Accordion, AccordionItem, Link } from "@nextui-org/react";
import React, { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { getHoldings, textInputStyle } from "../../Util/Global";
import { v4 as uuidv4 } from 'uuid';
import { newTransaction } from "../../actions/accounts";
import { useSelector } from "react-redux";
import { addHolding, updateHoldings } from "../../actions/holdings";
import { Account, EquityType, Transaction } from "../../types/Types";


export default function NewTransactionModalContent({ account }: { account: Account }) {
    const { t } = useTranslation()

    const [transactionName, setTransactionName] = useState("")
    const [cost, setCost] = useState("0")
    const [date, setDate] = useState("")
    const [equityPrice, setEquityPrice] = useState("0")
    const [e24Key, setE24Key] = useState("")
    const [equityShare, setEquityShare] = useState("0")

    // @ts-ignore
    const equityTypes = useSelector(state => state.rootReducer.equity.equityTypes)

    const transactionType = [
        {key: "BUY", label: t('transactionType.buy')},
        {key: "SELL", label: t('transactionType.sell')},
        {key: "PLATFORM_FEE", label: t('transactionType.plattform_fee')},
        {key: "DIVIDEND", label: t('transactionType.dividend')},
        {key: "YIELD", label: t('transactionType.yield')},
        {key: "DEPOSIT", label: t('transactionType.deposit')},
        {key: "WITHDRAWAL", label: t('transactionType.withdrawal')},
    ]
    const [selectedTransactionKeys, setSelectedTransactionKeys] = useState([]);
    const selectedTransactionType = useMemo(
        () => Array.from(selectedTransactionKeys).join(", ").replaceAll("_", " "),
        [selectedTransactionKeys]
    );

    const [selectedInvestmentKeys, setSelectedInvestmentKeys] = useState([]);
    const selectedInvestmentType = useMemo(
        () => Array.from(selectedInvestmentKeys).join(", ").replaceAll("_", " "),
        [selectedInvestmentKeys]
    );

    const dispatch = useDispatch()

    function handleSubmit() {
        var transactionToAdd: Transaction[] = []
        if(account.type === 'Obligasjon') {
            transactionToAdd.push({
                key: uuidv4(),
                cost: parseFloat(cost),
                name: transactionName,
                type: selectedTransactionType,
                date,
                equityPrice: parseFloat(cost),
                e24Key,
                equityShare: 1,
                equityType: selectedInvestmentType
            })
        } else {
            transactionToAdd.push({
                key: uuidv4(),
                cost: parseFloat(cost),
                name: transactionName,
                type: selectedTransactionType,
                date,
                equityPrice: parseFloat(equityPrice),
                e24Key,
                equityShare: parseFloat(equityShare),
                equityType: selectedInvestmentType
            })
        }
        
        if(account.transactions.some((transaction: Transaction) => transaction.name === transactionToAdd[0].name)) {
            // @ts-ignore
            dispatch(updateHoldings(getHoldings([...account.transactions, transactionToAdd[0]], account), account.key))
        } else {
            // må ignore.. returtypen er føkka da det ikke er en ts fil funksjonen er i
            // @ts-ignore
            const holding = getHoldings([transactionToAdd[0]], account)[0]
            dispatch(addHolding(holding))
        }
        dispatch(newTransaction(account.key, transactionToAdd[0]))
    }
    return (
        <ModalContent>
            {(onClose) => (
                <>
                    <ModalHeader className="flex flex-col gap-1">Ny transaksjon</ModalHeader>
                    <ModalBody className="">

                        <Input type="text"
                            classNames={textInputStyle}
                            label={"Navn på investering"}
                            value={transactionName}
                            onValueChange={setTransactionName} />

                        <Input type="number"
                            classNames={textInputStyle}
                            label={"Investeringskostnad"}
                            value={cost}
                            onValueChange={setCost} />

                        <Select
                            label={"Transaksjonstype"}
                            placeholder={"Transaksjonstype"}
                            className="pt-4 drop-shadow-xl"
                            // @ts-ignore
                            onSelectionChange={setSelectedTransactionKeys}
                            selectedKeys={selectedTransactionKeys}
                        >
                            {transactionType.map((transactionType) => (
                                <SelectItem key={transactionType.key} value={transactionType.key} >
                                    {transactionType.label}
                                </SelectItem>
                            ))}
                        </Select>

                        <Input type="date"
                            classNames={textInputStyle}
                            label={"Transaksjonsdato"}
                            // @ts-ignore
                            value={date}
                            // @ts-ignore
                            onValueChange={setDate} />

                        {
                            account.type !== 'Obligasjon' &&
                            <>
                                <Input type="number"
                                    classNames={textInputStyle}
                                    label={"Enhetspris"}
                                    value={equityPrice}
                                    onValueChange={setEquityPrice} />

                                <div className="border rounded-xl p-1 grid grid-cols-1 gap-4">
                                    <Input type="text"
                                        classNames={textInputStyle}
                                        label={"E24 ID"}
                                        value={e24Key}
                                        onValueChange={setE24Key}
                                    />
                                    <Accordion

                                    >
                                        <AccordionItem
                                            title={<h1 className="border-b">{t('accountModal.e24AccordionTitle')}</h1>}
                                        >
                                            <div className="">
                                                <p>{t('accountModal.e24HelpText1')}<Link
                                                    href="https://e24.no/bors/nyheter"
                                                    isExternal
                                                    showAnchorIcon
                                                >
                                                    E24
                                                </Link> {t('accountModal.e24HelpText2')}</p>
                                                
                                                    <p><br />{t('accountModal.e24HelpText3')}</p><Link
                                                        isExternal
                                                        showAnchorIcon
                                                        href="https://e24.no/bors/instrument/KR-KINGL.OSE"
                                                    >
                                                        Kron Indeks Global
                                                    </Link> 
                                                <p>{t('accountModal.e24HelpText4')}</p>
                                            </div>
                                        </AccordionItem>
                                    </Accordion>
                                </div>
                                <Input type="number"
                                    classNames={textInputStyle}
                                    label={"Antall"}
                                    value={equityShare}
                                    onValueChange={setEquityShare} />
                            </>
                        }

                        <Select
                            label={"Investeringstype"}
                            placeholder={"Investeringstype"}
                            className="pt-4 drop-shadow-xl"
                            // @ts-ignore
                            onSelectionChange={setSelectedInvestmentKeys}
                            selectedKeys={selectedInvestmentKeys}
                        >
                            {equityTypes.map((equityType: EquityType) => (
                                <SelectItem key={equityType.key} value={t(`equityTypes.${equityType.key.toLowerCase()}`)} >
                                    {t(`equityTypes.${equityType.key.toLowerCase()}`)}
                                </SelectItem>
                            ))}
                        </Select>
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
            )}
        </ModalContent>
    )
}