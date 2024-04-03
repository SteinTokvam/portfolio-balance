import { Button, Input, ModalBody, ModalContent, ModalFooter, ModalHeader, Select, SelectItem } from "@nextui-org/react";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { getHoldings, textInputStyle } from "../../Util/Global";
import { v4 as uuidv4 } from 'uuid';
import { newTransaction } from "../../actions/accounts";


export default function NewTransactionModalContent({ accountKey }) {
    const { t } = useTranslation()

    const [transactionName, setTransactionName] = useState("")
    const [cost, setCost] = useState(0)
    const [date, setDate] = useState(new Date())
    const [equityPrice, setEquityPrice] = useState(0)
    const [e24Key, setE24Key] = useState("")
    const [equityShare, setEquityShare] = useState(0)

    const accounts = useSelector(state => state.rootReducer.accounts.accounts)

    const transactionType = [
        "BUY",
        "SELL",
        "PLATFORM_FEE",
        "DIVIDEND",
        "YIELD",
        "DEPOSIT",
        "WITHDRAWAL",
    ]
    const [selectedTransactionKeys, setSelectedTransactionKeys] = useState([]);
    const selectedTransactionType = useMemo(
        () => Array.from(selectedTransactionKeys).join(", ").replaceAll("_", " "),
        [selectedTransactionKeys]
    );

    const investmentType = [
        "Stock",
        "Fund",
        "Obligasjon",
        "Kryptovaluta",
    ]
    const [selectedInvestmentKeys, setSelectedInvestmentKeys] = useState([]);
    const selectedInvestmentType = useMemo(
        () => Array.from(selectedInvestmentKeys).join(", ").replaceAll("_", " "),
        [selectedInvestmentKeys]
    );

    const dispatch = useDispatch()

    function handleSubmit() {
        const transactionToAdd = {
            key: uuidv4(),
            cost,
            name: transactionName,
            type: selectedTransactionType,
            date,
            equityPrice,
            e24Key,
            equityShare,
            equityType: selectedInvestmentType
        }
        dispatch(
            newTransaction(accountKey,
                transactionToAdd,
                getHoldings(accountKey, [transactionToAdd], selectedTransactionType, accounts)
            )
        )
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

                        <Input type="text"
                            classNames={textInputStyle}
                            label={"Investeringskostnad"}
                            value={cost}
                            onValueChange={setCost} />

                        <Select
                            label={"Transaksjonstype"}
                            placeholder={"Transaksjonstype"}
                            className="pt-4 drop-shadow-xl"
                            onSelectionChange={setSelectedTransactionKeys}
                            selectedKeys={selectedTransactionKeys}
                        >
                            {transactionType.map((transactionType) => (
                                <SelectItem key={transactionType} value={transactionType} >
                                    {transactionType}
                                </SelectItem>
                            ))}
                        </Select>

                        <Input type="date"
                            classNames={textInputStyle}
                            label={"Transaksjonsdato"}
                            value={date}
                            onValueChange={setDate} />

                        <Input type="number"
                            classNames={textInputStyle}
                            label={"Enhetspris"}
                            value={equityPrice}
                            onValueChange={setEquityPrice} />

                        <Input type="text"
                            classNames={textInputStyle}
                            label={"E24 ID"}
                            value={e24Key}
                            onValueChange={setE24Key} />

                        <Input type="number"
                            classNames={textInputStyle}
                            label={"Antall"}
                            value={equityShare}
                            onValueChange={setEquityShare} />

                        <Select
                            label={"Investeringstype"}
                            placeholder={"Investeringstype"}
                            className="pt-4 drop-shadow-xl"
                            onSelectionChange={setSelectedInvestmentKeys}
                            selectedKeys={selectedInvestmentKeys}
                        >
                            {investmentType.map((investmentType) => (
                                <SelectItem key={investmentType} value={investmentType} >
                                    {investmentType}
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