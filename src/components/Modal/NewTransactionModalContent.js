import { Button, Input, ModalBody, ModalContent, ModalFooter, ModalHeader, Select, SelectItem, Accordion, AccordionItem, Link } from "@nextui-org/react";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { getHoldings, textInputStyle } from "../../Util/Global";
import { v4 as uuidv4 } from 'uuid';
import { newTransaction } from "../../actions/accounts";
import { useSelector } from "react-redux";


export default function NewTransactionModalContent({ account }) {
    const { t } = useTranslation()

    const [transactionName, setTransactionName] = useState("")
    const [cost, setCost] = useState(0)
    const [date, setDate] = useState(new Date())
    const [equityPrice, setEquityPrice] = useState(0)
    const [e24Key, setE24Key] = useState("")
    const [equityShare, setEquityShare] = useState(0)

    const equityTypes = useSelector(state => state.rootReducer.equity.equityTypes)

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

    const [selectedInvestmentKeys, setSelectedInvestmentKeys] = useState([]);
    const selectedInvestmentType = useMemo(
        () => Array.from(selectedInvestmentKeys).join(", ").replaceAll("_", " "),
        [selectedInvestmentKeys]
    );

    const dispatch = useDispatch()

    function handleSubmit() {
        var transactionToAdd = {}
        if(account.type === 'Obligasjon') {
            transactionToAdd = {
                key: uuidv4(),
                cost: parseFloat(cost),
                name: transactionName,
                type: selectedTransactionType,
                date,
                equityPrice: parseFloat(cost),
                e24Key,
                equityShare: 1,
                equityType: selectedInvestmentType
            }
        } else {
            transactionToAdd = {
                key: uuidv4(),
                cost: parseFloat(cost),
                name: transactionName,
                type: selectedTransactionType,
                date,
                equityPrice: parseFloat(equityPrice),
                e24Key,
                equityShare: parseFloat(equityShare),
                equityType: selectedInvestmentType
            }
        }
        dispatch(
            newTransaction(account.key,
                transactionToAdd,
                getHoldings([transactionToAdd], account)
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
                                            title={<h1 className="border-b">Hvordan fylle ut</h1>}
                                        >
                                            <div className="">
                                                <p>Gå til <Link
                                                    href="https://e24.no/bors/nyheter"
                                                    isExternal
                                                    showAnchorIcon
                                                >
                                                    E24
                                                </Link> og søk opp investeringen.
                                                    <br />Eksempel: <Link
                                                        isExternal
                                                        showAnchorIcon
                                                        href="https://e24.no/bors/instrument/KR-KINGL.OSE"
                                                    >
                                                        Kron Indeks Global
                                                    </Link> så er det verdien "KR-KINGL" som står rett over "Kron Indeks Global" som skal inn i tekstboksen.
                                                </p>
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
                            onSelectionChange={setSelectedInvestmentKeys}
                            selectedKeys={selectedInvestmentKeys}
                        >
                            {equityTypes.map((equityType) => (
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