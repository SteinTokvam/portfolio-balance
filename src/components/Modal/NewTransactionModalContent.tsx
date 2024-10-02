import { Button, Input, ModalBody, ModalContent, ModalFooter, ModalHeader, Select, SelectItem, Accordion, AccordionItem, Link } from "@nextui-org/react";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { getHoldings, styles } from "../../Util/Global";
import { v4 as uuidv4 } from 'uuid';
import { newTransaction } from "../../actions/accounts";
import { useSelector } from "react-redux";
import { Account, EquityType, Holding, Transaction, TransactionType } from "../../types/Types";
import { deleteHoldingsForAccount, updateHoldings } from "../../actions/holdings";
import { SupabaseClient } from "@supabase/supabase-js";


export default function NewTransactionModalContent({ supabase, account }: { supabase: SupabaseClient, account: Account }) {
    const { t } = useTranslation()

    const [transactionName, setTransactionName] = useState("")
    const [cost, setCost] = useState("0")
    const [date, setDate] = useState("")
    const [equityPrice, setEquityPrice] = useState("0")
    const [e24Key, setE24Key] = useState("")
    const [equityShare, setEquityShare] = useState("0")

    const dispatch = useDispatch()

    const equityTypes = useSelector((state: any) => state.rootReducer.equity.equityTypes)

    const transactionType = [
        { key: TransactionType.BUY, label: t('transactionType.buy') },
        { key: TransactionType.SELL, label: t('transactionType.sell') },
        { key: TransactionType.PLATFORM_FEE, label: t('transactionType.plattform_fee') },
        { key: TransactionType.DIVIDEND, label: t('transactionType.dividend') },
        { key: TransactionType.YIELD, label: t('transactionType.yield') },
        { key: TransactionType.DEPOSIT, label: t('transactionType.deposit') },
        { key: TransactionType.WITHDRAWAL, label: t('transactionType.withdrawal') },
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

    useEffect(() => {
        getHoldings(account)
            .then((holdings: Holding[]) => {
                if (holdings.length === 0) {
                    return
                }
                dispatch(updateHoldings(holdings, account.key))
            })
    }, [account, dispatch]);

function handleSubmit() {
    var transactionToAdd: Transaction[] = []
    dispatch(deleteHoldingsForAccount(account))
    if (account.type === 'Obligasjon') {
        transactionToAdd.push({
            transactionKey: uuidv4(),
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
            transactionKey: uuidv4(),
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

    dispatch(newTransaction(supabase,account.key, transactionToAdd[0]))
}
return (
    <ModalContent>
        {(onClose) => (
            <>
                <ModalHeader className="flex flex-col gap-1">Ny transaksjon</ModalHeader>
                <ModalBody className="">

                    <Input type="text"
                        classNames={styles.textInputStyle}
                        label={"Navn på investering"}
                        value={transactionName}
                        onValueChange={setTransactionName} />

                    <Input type="number"
                        classNames={styles.textInputStyle}
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
                        classNames={styles.textInputStyle}
                        label={"Transaksjonsdato"}
                        value={date}
                        onValueChange={setDate} />

                    {
                        account.type !== 'Obligasjon' &&
                        <>
                            <Input type="number"
                                classNames={styles.textInputStyle}
                                label={"Enhetspris"}
                                value={equityPrice}
                                onValueChange={setEquityPrice} />

                            <div className="border rounded-xl p-1 grid grid-cols-1 gap-4">
                                <Input type="text"
                                    classNames={styles.textInputStyle}
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
                                classNames={styles.textInputStyle}
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