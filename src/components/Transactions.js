import { Accordion, AccordionItem, Avatar, Spinner, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, User, getKeyValue } from "@nextui-org/react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { editInvestment } from "../actions/investments";


export default function Transactions() {

    const investments = useSelector(state => state.rootReducer.investments.investments);

    const [crypto, setCrypto] = useState([]);
    const accessKey = useSelector(state => state.rootReducer.accounts.firi)
    const dispatch = useDispatch()

    async function getTransactionsFromFiri(accessKey) {
        return await fetch('https://api.firi.com/v2/history/transactions', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'firi-access-key': accessKey
            }
        })
            .then(response => {
                return response.json()
            })
    }

    function calculateValue(orders, currencies) {
        return currencies.map(currency => {
            var cryptoValue = 0.0
            orders.reverse()
                .filter(order => order.currency === currency).forEach(order => {
                    cryptoValue += parseFloat(order.amount)
                })

            return { cryptoValue, currency }
        })
    }

    async function getValueInFiat(currencies, accessKey) {
        const value = currencies.map(async cryptocurrency => {
            const response = await fetch(`https://api.firi.com/v1/markets/${cryptocurrency}nok`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'firi-access-key': accessKey
                }
            });
            return await response.json();
        })

        const ret = Promise.all(value)
        return await ret
    }

    useEffect(() => {
        async function fetchData() {
            const transactions = await getTransactionsFromFiri(accessKey).then(orders => {
                if (orders.name === "ApiKeyNotFound") {
                    setCrypto(["FEIL"])
                    return ["FEIL"]
                }
                const allCurrencies = [...new Set(orders.map(order => order.currency))]
                const valueOfCurrency = calculateValue(orders, allCurrencies)
                return { allCurrencies, valueOfCurrency, orders }
            })

            if (transactions[0] === "FEIL") {
                return
            }

            const valueInFiat = await getValueInFiat(transactions.allCurrencies, accessKey)

            const allCrypto = valueInFiat.map((value, i) => {
                return {
                    cryptoValue: transactions.valueOfCurrency[i].cryptoValue.toFixed(8),
                    cryptocurrency: transactions.valueOfCurrency[i].currency,
                    fiatValue: parseFloat((transactions.valueOfCurrency[i].cryptoValue) * value.last).toFixed(2),
                    fiatCurrency: 'NOK',
                    lastPrice: value.last,
                    transactions: transactions.orders
                        .filter(order => order.currency === transactions.valueOfCurrency[i].currency)
                        .filter(order => order.type !== 'Stake')
                }
            }).filter(crypto => crypto.fiatValue > 0)
            setCrypto(allCrypto)
            const currencies = allCrypto.map(crypto => {
                return {
                    currency: crypto.cryptocurrency,
                    fiatValue: crypto.fiatValue
                }
            })

            var cryptoInvestments = []
            investments.filter(investment => {
                if (currencies.map(currency => currency.currency).includes(investment.name)) {
                    const fiatValue = currencies.find(currency => currency.currency === investment.name).fiatValue
                    const tmpInvestement = {
                        key: investment.key,
                        type: investment.type,
                        name: investment.name,
                        account: investment.account,
                        value: parseFloat(fiatValue),
                        note: investment.note,
                        percentage: investment.percentage
                    }
                    cryptoInvestments.push(tmpInvestement)
                }
            })
            cryptoInvestments.forEach(investment => dispatch(editInvestment(investment)))
        }

        if (accessKey === "") {
            return
        }
        fetchData()
    }, [crypto, accessKey])

    const columns = [
        { key: 'amount', label: 'Amount' },
        { key: 'currency', label: 'Currency' },
        { key: 'date', label: 'Date' },
        { key: 'type', label: 'Type' },
    ]

    return (
        <div className="grid grid-flow-col justify-stretch">
            {
                crypto.length === 0 ? <Spinner /> :
                    crypto[0] === "FEIL" ? <p>FEIL! Er API-nøkkel satt i innstillingene?</p> :
                        <Accordion selectionMode="multiple">
                            {crypto.map(item => {
                                const rows = item.transactions
                                return (
                                    <AccordionItem
                                        key={item.cryptocurrency}
                                        subtitle={
                                            <div className="">
                                                <div>{`${item.cryptoValue} ${item.cryptocurrency}`}</div>
                                                <div>{`${item.fiatValue} ${item.fiatCurrency}`}</div>
                                            </div>}
                                        startContent={
                                            <Avatar
                                                src={`https://raw.githubusercontent.com/ErikThiart/cryptocurrency-icons/master/128/${item.cryptocurrency === 'ETH' ? 'ethereum' : item.cryptocurrency === 'BTC' ? 'bitcoin' : item.cryptocurrency === 'LTC' ? 'litecoin' : item.cryptocurrency}.png`}
                                            />
                                        }
                                    >
                                        <Table aria-label="Example table with dynamic content" selectionMode="none" isStriped>
                                            <TableHeader columns={columns}>
                                                {(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
                                            </TableHeader>
                                            <TableBody items={rows}>
                                                {(item) => (
                                                    <TableRow key={item.id}>
                                                        {(columnKey) => <TableCell>{getKeyValue(item, columnKey)}</TableCell>}
                                                    </TableRow>
                                                )}
                                            </TableBody>
                                        </Table>
                                    </AccordionItem>
                                )
                            })}
                        </Accordion>
            }
        </div>
    )
}